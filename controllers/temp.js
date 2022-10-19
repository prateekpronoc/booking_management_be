module.exports = function (config, _) {
    return function (database, data, req) {
        req.log.info('searchAvailability: Data = ', data);
        if (!data.from || !data.to) {
            return config.Promise.reject(new config.restify.BadRequestError('Invalid date/time range specified'));
        }
        console.log(config.sysCatalogs.fleetBookingStatus.inverted);
        var returnObj = {},
            peakdayList;
        var packageVehicles;
        let cancelStatus = config.sysCatalogs.vehicleBookingStatus.inverted.cancelled;
        let completedStatus = config.sysCatalogs.vehicleBookingStatus.inverted.completed;
        let fleetCancelStatus = config.sysCatalogs.fleetBookingStatus.inverted.cancelled;
        let fleetBookingCompleted = config.sysCatalogs.fleetBookingStatus.inverted.tripCompleted;
        let subscribedStatus = config.sysCatalogs.vehicleBookingStatus.inverted.subscribed;
        let queryStr = 'SELECT b.vehicle_id AS vehicleId, COUNT(b.id) AS count FROM temp_bookings AS b WHERE (b.status not in (:cancelStatus,:completedStatus,:fleetCancelStatus,:fleetBookingCompleted)) and ((b.from >= :from AND b.from <= :to) OR (b.to >= :from AND b.to <= :to) or (:from between b.from and b.to) or (:to between b.from and b.to) or (b.to between :from and :to) or (b.from between :from and :to)) group by b.vehicle_id';
        req.log.info('Query : ' + queryStr);
        let dt = {
            from: data.from,
            to: data.to,
            cancelStatus: cancelStatus,
            completedStatus: completedStatus,
            fleetCancelStatus: fleetCancelStatus,
            fleetBookingCompleted: fleetBookingCompleted
        };
        console.log(dt);
        req.log.info('Req Data = ', dt);

        let blockQueryString = 'select b.vehicle_id as vehicleId,COUNT(b.id) as count FROM blocked_vehicles as b WHERE (b.is_unblocked=0) and ((b.from >= :from AND b.from <= :to) OR (b.end_date >= :from AND b.end_date <= :to) or (:from between b.from and b.end_date) or (:to between b.from and b.end_date) or (b.end_date between :from and :to) or (b.from between :from and :to)) group by b.vehicle_id';
        let vehicleBookingString = 'SELECT b.vehicle_id AS vehicleId, COUNT(b.id) AS count FROM vehicle_bookings AS b WHERE (b.status not in (:cancelStatus,:completedStatus)) and ((b.book_from >= :from AND b.book_from <= :to) OR (b.book_to >= :from AND b.book_to <= :to) or (:from between b.book_from and b.book_to) or (:to between b.book_from and b.book_to) or (b.book_to between :from and :to) or (b.book_from between :from and :to)) group by b.vehicle_id';
        var startDateObject = {
            startDate: config.moment(data.from).format('YYYY-MM-DD'),
            startTime: config.moment(data.from).format('HH:mm')
        },
            endDateObject = {
                endDate: config.moment(data.to).format('YYYY-MM-DD'),
                endTime: config.moment(data.to).format('HH:mm')
            };
        var busyOnes = [],
            whereCondition = { status: { $in: [config.sysCatalogs.vehicleStatus.inverted.active] } };
        return database.query(queryStr, {
            replacements: dt,
            type: database.QueryTypes.SELECT
        }).then((resp) => {
            busyOnes = _.map(resp, 'vehicleId');
            return database.query(blockQueryString, {
                replacements: dt,
                type: database.QueryTypes.SELECT
            });
        }).then((resp) => {
            var blockedVehicles = _.map(resp, 'vehicleId');
            busyOnes = _.concat(busyOnes, blockedVehicles);

            return database.query(vehicleBookingString, {
                replacements: dt,
                type: database.QueryTypes.SELECT
            });
        }).then((resp) => {
            var vehicleBookingVehicles = _.map(resp, 'vehicleId');
            busyOnes = _.concat(busyOnes, vehicleBookingVehicles);

            if (busyOnes.length > 0) {
                whereCondition = _.merge(whereCondition, { id: { $notIn: [busyOnes] } });
            }
            return fetchPeakDays(startDateObject, endDateObject, database);
        }).then((peakhrList) => {
            peakdayList = peakhrList;
            console.log(whereCondition);
            return fetchVehicleDetails(whereCondition, database, req, busyOnes);
        }).then((vehicleList) => {
            returnObj.vehicleList = _.uniqBy(vehicleList, 'groupId');
            return fetchPackageVehicles(_.map(_.uniqBy(vehicleList, 'groupId'), 'id'), database);
        }).then((resp) => {
            packageVehicles = _.indexify(resp, 'packageId', 'vehicleId');
            return fetchPackageDetails(_.map(resp, 'packageId'), database);
        }).then((resp) => {
            var packageInfo = [];
            return config.Promise.all(_.map(resp, (result) => {
                return calculateTripCost(result.dataValues, startDateObject, endDateObject, peakdayList).then((resp) => {
                    resp.vehicleId = packageVehicles[result.id];
                    return config.Promise.resolve(result);
                });
            }));
        }).then((resp) => {

            var dataValues = _.map(resp, 'dataValues');

            var maxKmVal = _.maxBy(dataValues, (val) => { return val.totalFreeKms }).totalFreeKms;

            var finalValue = _.map(dataValues, (val) => {
                if (val.totalTripDurationInHrs > 24 && val.totalFreeKms >= maxKmVal) {
                    val.isUnlimited = true;

                    val.totalFreeKmsValue = 'Unlimited';
                } else {
                    val.isUnlimited = false;
                    val.totalFreeKmsValue = val.totalFreeKms;
                }
                return val;
            });

            config.queue.create('create-search-history', {
                data: _.merge(returnObj, startDateObject, endDateObject),
            }).removeOnComplete(true).save();

            returnObj.otherInfo = _.indexify(finalValue, 'vehicleId');
            return config.Promise.resolve(returnObj);
        }).catch((err) => {
            return config.Promise.resolve({ result: -1, msg: 'Error getting vehicles : ' + err });
        });

    };

    function calculateTripCost(packageDetail, startDateObject, endDateObject, peakdayList) {
        packageDetail = _.merge(packageDetail, {
            weekdayRent: 0,
            weekendRent: 0,
            noOfWeekday: 0,
            noOfWeekends: 0,
            weekDayHrs: 0,
            weekEndHrs: 0,
            totalRent: 0,
            costToTheCustomer: 0,
            totalAmountAfterDiscount: 0,
            totalRentWithTax: 0,
            totalRentWithoutTax: 0,
            totalAmountWithSecurity: 0,
            totalTripDurationInDays: 0,
            totalTripDurationInHrs: 0
        });
        return new Promise((resolve) => {
            if (checkSameDay(startDateObject.startDate, endDateObject.endDate)) {
                packageDetail.testingValue = 'Im Testing Same Day';
                return calculateSameDayRent(startDateObject, endDateObject, packageDetail).then((costConfiguration) => {
                    costConfiguration.weekEndHrs = _.round(costConfiguration.weekEndHrs, 2);
                    costConfiguration.weekDayHrs = _.round(costConfiguration.weekDayHrs, 2);
                    costConfiguration.weekendRent = _.round((costConfiguration.weekendTariff / costConfiguration.costingHr) *
                        costConfiguration.weekEndHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekends = _.round((costConfiguration.weekEndHrs / 24), 2);

                    costConfiguration.weekdayRent = _.round((costConfiguration.weekdayTariff / costConfiguration.costingHr) *
                        costConfiguration.weekDayHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekday = _.round((costConfiguration.weekDayHrs / 24), 2);
                    costConfiguration.totalRent = _.round((costConfiguration.weekendRent + costConfiguration.weekdayRent));
                    // costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
                    costConfiguration.totalTripDurationInHrs = _.round(costConfiguration.weekEndHrs + costConfiguration.weekDayHrs);
                    costConfiguration.totalTripDurationInDays = _.round((costConfiguration.weekEndHrs + costConfiguration
                        .weekDayHrs) / 24);
                    costConfiguration.totalFreeKms = _.round((costConfiguration.freeKm / 24) * costConfiguration.totalTripDurationInHrs,
                        2);
                    return calculateCost(startDateObject, endDateObject, costConfiguration, peakdayList);
                }).then((costConfiguration) => {
                    resolve(costConfiguration);
                });
            } else {
                return calculateStartDayRent(startDateObject, packageDetail).then((costConfiguration) => {
                    return calculateInbetweenRent(startDateObject, endDateObject, costConfiguration);
                }).then((costConfiguration) => {
                    return calculateEndDayRent(endDateObject, costConfiguration);

                }).then(function (costConfiguration) {
                    costConfiguration.weekEndHrs = _.round(costConfiguration.weekEndHrs, 2);
                    costConfiguration.weekDayHrs = _.round(costConfiguration.weekDayHrs, 2);
                    costConfiguration.weekendRent = _.round((costConfiguration.weekendTariff / costConfiguration.costingHr) *
                        costConfiguration.weekEndHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekends = _.round((costConfiguration.weekEndHrs / 24), 2);

                    costConfiguration.weekdayRent = _.round((costConfiguration.weekdayTariff / costConfiguration.costingHr) *
                        costConfiguration.weekDayHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekday = _.round((costConfiguration.weekDayHrs / 24), 2);
                    costConfiguration.totalRent = _.round((costConfiguration.weekendRent + costConfiguration.weekdayRent));
                    // costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
                    costConfiguration.totalTripDurationInHrs = _.round(costConfiguration.weekEndHrs + costConfiguration.weekDayHrs);
                    costConfiguration.totalTripDurationInDays = _.round((costConfiguration.weekEndHrs + costConfiguration
                        .weekDayHrs) / 24);
                    costConfiguration.totalFreeKms = _.round((costConfiguration.freeKm / 24) * costConfiguration.totalTripDurationInHrs,
                        2);


                    return calculateCost(startDateObject, endDateObject, costConfiguration, peakdayList).then(function (costConfiguration) {
                        costConfiguration.testingValue = 'Im Testing Not Same Day';
                        resolve(costConfiguration);
                    });
                });

            }

            //resolve(packageDetail);
            //   console.log(packageDetail);
            // packageDetail.testingValue = 'Im Testing Value';
            // resolve(packageDetail);
        });
    }

    function calculateInbetweenRent(startDateObject, endDateObject, costConfiguration) {
        var startDate = config.moment(startDateObject.startDate).add(1, "days").format("YYYY-MM-DD"),
            endDate = config.moment(endDateObject.endDate).subtract(1, "days").format("YYYY-MM-DD");
        costConfiguration.weekEndHrs += findWeekendhrs(startDate, endDate);
        costConfiguration.weekDayHrs += findWeekdayhrs(startDate, endDate);
        return config.Promise.resolve(costConfiguration);
    }

    function calculateEndDayRent(endDateObject, costConfiguration) {
        if (findThursday(endDateObject.endDate)) {
            if (endDateObject.endTime < '18:00') {

                costConfiguration.weekDayHrs += _.round(calculateHrs({
                    startDate: endDateObject.endDate,
                    startTime: '00:00',
                    endDate: endDateObject.endDate,
                    endTime: endDateObject.endTime
                }));

            } else {

                costConfiguration.weekDayHrs += _.round(calculateHrs({
                    startDate: endDateObject.endDate,
                    startTime: '00:00',
                    endDate: endDateObject.endDate,
                    endTime: '18:00'
                }));

                costConfiguration.weekEndHrs += _.round(calculateHrs({
                    startDate: endDateObject.endDate,
                    startTime: '18:00',
                    endDate: endDateObject.endDate,
                    endTime: endDateObject.endTime
                }));
            }
        } else if (findWeekend(endDateObject.endDate, endDateObject.endTime)) {
            costConfiguration.weekEndHrs += _.round(calculateHrs({
                startDate: endDateObject.endDate,
                startTime: '00:00',
                endDate: endDateObject.endDate,
                endTime: endDateObject.endTime
            }));
        } else {
            costConfiguration.weekDayHrs += _.round(calculateHrs({
                startDate: endDateObject.endDate,
                startTime: '00:00',
                endDate: endDateObject.endDate,
                endTime: endDateObject.endTime
            }));
        }
        return config.Promise.resolve(costConfiguration);
    }

    function calculateSameDayRent(starteDateObj, endDateObj, costConfiguration) {
        if (!findWeekend(starteDateObj.startDate, starteDateObj.startTime) && !(
            findWeekend(endDateObj.endDate, endDateObj.endTime))) {
            //Calcuate WeekDayRent
            costConfiguration = _.merge(costConfiguration, calculateWeekDayRent({
                startDate: starteDateObj.startDate,
                startTime: starteDateObj.startTime,
                endDate: endDateObj.endDate,
                endTime: endDateObj.endTime
            }, costConfiguration));
            return config.Promise.resolve(costConfiguration);
        }

        //Check for WeekEnd
        if (findWeekend(starteDateObj.startDate, starteDateObj.startTime) && (
            findWeekend(endDateObj.endDate, endDateObj.endTime))) {
            //Calculate WeekEndREnt
            costConfiguration = _.merge(costConfiguration, calculateWeekEndRent({
                startDate: starteDateObj.startDate,
                startTime: starteDateObj.startTime,
                endDate: endDateObj.endDate,
                endTime: endDateObj.endTime
            }, costConfiguration));
            return config.Promise.resolve(costConfiguration);
        }

        //Automate Thursday
        costConfiguration = _.merge(costConfiguration, calculateWeekDayRent({
            startDate: starteDateObj.startDate,
            startTime: starteDateObj.startTime,
            endDate: endDateObj.endDate,
            endTime: '18:00'
        }, costConfiguration));


        costConfiguration = _.merge(costConfiguration, calculateWeekEndRent({
            startDate: starteDateObj.startDate,
            startTime: '18:00',
            endDate: endDateObj.endDate,
            endTime: endDateObj.endTime
        }, costConfiguration));

        return config.Promise.resolve(costConfiguration);
    }

    function calculateWeekDayRent(dateObj, costConfig) {
        var diff = calculateHrs(dateObj);
        costConfig.weekdayRent = _.round((costConfig.weekdayTariff / costConfig.costingHr) * diff, 2);
        costConfig.totalRent += costConfig.weekdayRent;
        costConfig.noOfWeekday += diff / 24;
        costConfig.weekDayHrs += diff;
        return costConfig;
    }


    function calculateWeekEndRent(dateObj, costConfig) {
        var diff = calculateHrs(dateObj);
        costConfig.weekendRent = _.round((costConfig.weekendTariff / costConfig.costingHr) * diff, 2);
        costConfig.totalRent += _.round(costConfig.weekdayRent, 2);
        costConfig.noOfWeekends += diff / 24;
        costConfig.weekEndHrs += diff;
        return costConfig;
    }

    function calculateStartDayRent(startDateObject, costConfiguration) {
        if (findThursday(startDateObject.startDate)) {
            if (startDateObject.startTime < '18:00') {

                costConfiguration.weekDayHrs = _.round(calculateHrs({
                    startDate: startDateObject.startDate,
                    startTime: startDateObject.startTime,
                    endDate: startDateObject.startDate,
                    endTime: '18:00'
                }), 2);

                costConfiguration.weekEndHrs = _.round(calculateHrs({
                    startDate: startDateObject.startDate,
                    startTime: '18:00',
                    endDate: startDateObject.startDate,
                    endTime: '23:59'
                }), 2);
            } else {
                costConfiguration.weekEndHrs = _.round(calculateHrs({
                    startDate: startDateObject.startDate,
                    startTime: startDateObject.startTime,
                    endDate: startDateObject.startDate,
                    endTime: '23:59'
                }), 2);
            }
        } else if (findWeekend(startDateObject.startDate, startDateObject.startTime)) {
            costConfiguration.weekEndHrs = _.round(calculateHrs({
                startDate: startDateObject.startDate,
                startTime: startDateObject.startTime,
                endDate: startDateObject.startDate,
                endTime: '23:59'
            }), 2);
        } else {
            costConfiguration.weekDayHrs = _.round(calculateHrs({
                startDate: startDateObject.startDate,
                startTime: startDateObject.startTime,
                endDate: startDateObject.startDate,
                endTime: '23:59'
            }), 2);
        }
        return config.Promise.resolve(costConfiguration);
    }

    function calculateCost(startDateObject, endDateObject, costConfiguration, peakdayList) {

        var securityDeposit = 3000;
        var startDateTime = new Date(startDateObject.startDate + ' ' + startDateObject.startTime),
            endDateTime = new Date(endDateObject.endDate + ' ' + endDateObject.endTime),
            timeDiffObj = (endDateTime - startDateTime) / 1000 / 60 / 60; //(bookingDetails.bookingEndDate, endDateTime);

        if (timeDiffObj <= 24) {
            securityDeposit = 1500;
        }

        var pStartDate = config.moment(startDateObject.startDate).format('YYYY-MM-DD');
        var pEndDate = config.moment(endDateObject.endDate).format('YYYY-MM-DD');
        var holidayDate = config.moment('2020-01-26').format('YYYY-MM-DD');

        costConfiguration.normalWeekdayRent = costConfiguration.weekdayRent;
        costConfiguration.normalWeekendRent = costConfiguration.weekendRent;


        if (peakdayList.length > 0) {
            peakdayList = _.maxBy(peakdayList, 'charges'); //peakdayList[peakdayList.length - 1];

            //Conditon 1 : if peak start date is between booking start and end date
            //condition 2 : if peak end date is between booking start and end date
            //condition 3 : if booking start and end date between peak start date and end date
            //console.log(costConfiguration);
            //console.log(peakdayList);
            if (config.moment(peakdayList.startDate).isBetween(pStartDate, pEndDate, undefined,
                '[]')) {
                //   console.log(1);
                costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);

                costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
            } else if (config.moment(peakdayList.endDate).isBetween(pStartDate, pEndDate, undefined,
                '[]')) {
                var endDiff = config.moment(pEndDate).diff(peakdayList.endDate, 'hours');
                var startDiff = config.moment(peakdayList.endDate).diff(pStartDate, 'hours');

                if (startDiff >= 18 && endDiff <= 24) {
                    //console.log('In between!!!');
                    costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                    costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);
                    costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
                }
            } else if (moment(pStartDate).isBetween(config.moment(peakdayList.startDate), config.moment(peakdayList.endDate), undefined,
                '[]') && moment(pEndDate).isBetween(config.moment(peakdayList.startDate), config.moment(peakdayList.endDate), undefined,
                    '[]')) {
                // console.log(3);
                costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);
                costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
            } else {
                // console.log('Others!!!!');
                costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);
                costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
            }





        }

        //In between
        // if (config.moment('2021-01-26').isBetween(pStartDate, pEndDate, undefined,
        //     '[]')) {

        //   // console.log(costConfiguration.weekendTariff);
        //   // console.log('-------------------------------------');

        //   costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * 1.5);
        //   costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * 1.5);
        //   costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
        // }

        //Start Date is Same 

        //  if (config.moment('2021-01-26').isSame(pStartDate)) {
        //   console.log('startdate');
        //    costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * 1.5);
        //    costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * 1.5);
        //    costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
        //  }


        //  // End Date is Same
        // else if (config.moment('2021-01-26').isSame(pEndDate)) {
        //  console.log('enddate');
        //    costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * 1.5);
        //    costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * 1.5);
        //    costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
        //  }

        // if (moment(pEndDate).isSame(startDateObject.startDate)) {
        //   return peakhr;
        // }

        // if (moment(pEndDate).isSame(endDateObject.endDate)) {
        //   return peakhr;
        // }
        // console.log(costConfiguration);

        costConfiguration.totalHrs = _.round(costConfiguration.weekDayHrs + costConfiguration.weekEndHrs);
        costConfiguration.securityDeposit = securityDeposit;
        costConfiguration.discountPercentage = costConfiguration.discountPercentage || 0;
        costConfiguration.totalAmountAfterDiscount = costConfiguration.discountPercentage == 0 ? costConfiguration
            .totalRent :
            costConfiguration.totalRent - (costConfiguration.totalRent * costConfiguration.discountPercentage /
                100);
        costConfiguration.totalDiscount = _.round(costConfiguration.totalRent * costConfiguration.discountPercentage /
            100, 2);

        costConfiguration.totalRentWithoutTax = costConfiguration.totalAmountAfterDiscount;
        costConfiguration.totalRentWithTax = _.round(costConfiguration.totalRentWithoutTax + (costConfiguration
            .totalRentWithoutTax *
            28 / 100));
        costConfiguration.totalTripDurationInHrs = _.round(costConfiguration.weekEndHrs + costConfiguration.weekDayHrs);
        costConfiguration.extraFreeKm = costConfiguration.extraFreeKm || 0;
        costConfiguration.totalFreeKms = (costConfiguration.freeKm / 24) * costConfiguration.totalTripDurationInHrs;
        costConfiguration.totalFreeKms = _.round(costConfiguration.totalFreeKms) + costConfiguration.extraFreeKm;
        costConfiguration.taxAmount = _.round(costConfiguration.totalRentWithoutTax * 28 / 100);
        costConfiguration.bookingLineItems = [];
        costConfiguration.bookingLineItems.push({
            name: 'Weekday Charges',
            price: costConfiguration.weekdayRent || 0,
            description: 'Weekday Charges ',
            discount: 0
        }, {
            name: 'Weekend Charges',
            price: costConfiguration.weekendRent || 0,
            description: 'Weekend Charges ',
            discount: 0
        }, {
            name: 'Security Deposit',
            price: securityDeposit,
            description: 'Refunable Amount',
            discount: 0
        }, {
            id: 'deliveryCharges',
            name: 'Delivery Charges',
            price: costConfiguration.deliveryCharges || 0,
            description: 'Delivery Charges',
            discount: 0
        }, {
            id: 'pickupCharges',
            name: 'Pickup Charges',
            price: costConfiguration.pickupCharges || 0,
            description: 'Pickup Charges',
            discount: 0
        }, {
            name: 'Discount',
            price: costConfiguration.totalDiscount ? costConfiguration.totalDiscount : 0,
            description: 'Discount Amount ',
            discount: costConfiguration.totalDiscount ? costConfiguration.totalDiscount : 0
        }, {
            name: 'Tax',
            price: costConfiguration.taxAmount,
            description: 'CGST-14% , SGST-14% ',
            discount: 0
        });

        if (!_.has(costConfiguration, 'isExtension')) {
            costConfiguration.totalAmountWithSecurity = _.round(costConfiguration.totalRentWithTax + securityDeposit);
        } else {
            costConfiguration.totalAmountWithSecurity = _.round(costConfiguration.totalRentWithTax);
            costConfiguration.totalAmountWithSecurity += costConfiguration.deliveryCharges || 0;
            costConfiguration.totalAmountWithSecurity += costConfiguration.pickupCharges || 0;
        }

        costConfiguration.costToTheCustomer = costConfiguration.totalAmountWithSecurity;
        return config.Promise.resolve(costConfiguration);
    }

    function findWeekendhrs(startDate, endDate) {
        var start = new Date(startDate),
            finish = new Date(endDate),
            dayMilliseconds = 1000 * 60 * 60 * 24,
            weekendhrs = 0;

        while (start <= finish) {
            var day = start.getDay();
            if (day == 0 || day == 5 || day == 6) {
                weekendhrs += 24;
            }
            if (day == 4) {
                weekendhrs += 6;
            }
            start = new Date(+start + dayMilliseconds);
        }
        return weekendhrs;
    }

    function findWeekdayhrs(startDate, endDate) {
        var start = new Date(startDate),
            finish = new Date(endDate),
            dayMilliseconds = 1000 * 60 * 60 * 24,
            weekdayhrs = 0;

        while (start <= finish) {
            var day = start.getDay();
            if (day == 1 || day == 2 || day == 3) {
                weekdayhrs += 24;
            }
            if (day == 4) {
                weekdayhrs += 18;
            }
            start = new Date(+start + dayMilliseconds);
        }
        return weekdayhrs;
    }

    function findWeekend(dateObj, timeObj) {
        dateObj = new Date(dateObj);
        if (dateObj.getDay() === 4 && timeObj > '18:00') {
            return true;
        }
        return _.indexOf([0, 5, 6], dateObj.getDay()) < 0 ? false : true;
    }

    function calculateHrs(dateObj) {
        var startDateTime = new Date(dateObj.startDate + ' ' + dateObj.startTime);
        var endDateTime = new Date(dateObj.endDate + ' ' + dateObj.endTime);
        return (endDateTime - startDateTime) / 1000 / 60 / 60;
    }

    function checkSameDay(startDate, endDate) {
        return config.moment(startDate).isSame(endDate);
    }

    function findThursday(dateObj) {
        dateObj = new Date(dateObj);
        if (dateObj.getDay() === 4) {
            return true;
        }
        return false;
        // return  _.indexOf([4], dateObj.getDay()) > 0 ? true : false;
    }

    function fetchVehicleDetails(whereCondition, database, req, busyOnes) {
        // console.log(busyOnes);
        return config.svc.commonGetAll({
            limit: 10000,
            key: 'wowVehicles',
            status: config.sysCatalogs.vehicleStatus.inverted.active
        }, req).then((response) => {
            if (response.rows.length < 1) {
                return config.Promise.reject();
            }

            console.log(busyOnes);

            var availableVehicles = _.difference(_.map(response.rows, 'id'), busyOnes);
            console.log(availableVehicles);
            var filteredVehicles = _.filter(response.rows, (val) => {
                if (_.indexOf(availableVehicles, val.id) > -1) {
                    return val;
                }
            });
            // console.log(_.map(filteredVehicles, 'id'));
            //  console.log(availableVehicles);
            // // console.log(availableVehicles);
            // // var filteredVehicles = _.filter(response.rows, (val) => {
            // //   if (_.indexOf(availableVehicles, val.id) > -1) {
            // //     val.isSoldOut = false;
            // //     return val;
            // //   }
            // // });

            // //WOrking Code
            // var uniqVehicleList = _.uniqBy(response.rows, 'groupId');
            // var diff = _.difference(_.map(response.rows, 'id'), busyOnes);
            // // console.log(busyOnes);
            //  console.log(diff);


            // var filteredVehicles = _.filter(response.rows, (val) => {
            //     if (_.indexOf(diff, val.id) > -1) {
            //         val.isSoldOut = false;
            //         return val;
            //     }
            // });

            // var bookedVehicles = _.filter(response.rows, (val) => {
            //     if (_.indexOf(busyOnes, val.id) > -1) {
            //         val.isSoldOut = true;
            //         return val;
            //     }
            // });

            response.rows = filteredVehicles;
            return config.Promise.resolve(response.rows);
        });
        // return database.wowVehicles.findAll({
        //   where: whereCondition,
        //   limit: 100
        // }).then((vehiclelist) => {
        //   // console.log(_.map(vehiclelist, 'dataValues').length);

        //   if (_.map(vehiclelist, 'dataValues').length < 1) {
        //     return config.Promise.reject();
        //   }
        //   return config.Promise.resolve(vehiclelist);
        // });
    }

    function fetchPeakDays(startDateObject, endDateObject, database) {
        return database.peakhrs.findAll({
            limit: 100
        }).then((peakhrList) => {
            peakhrList = _.map(peakhrList, 'dataValues');
            //  console.log(peakhrList);
            var selectedPeakHrs = _.filter(peakhrList, function (peakhr) {
                var pStartDate = moment(peakhr.startDate).format('YYYY-MM-DD');
                // console.log(pStartDate);
                var pEndDate = moment(peakhr.endDate).format('YYYY-MM-DD');
                if (moment(pStartDate).isBetween(startDateObject.startDate, endDateObject.endDate, undefined,
                    '[]')) {
                    return peakhr;
                }

                if (moment(pEndDate).isBetween(startDateObject.startDate, endDateObject.endDate, undefined, '[]')) {
                    return peakhr;
                }

                if (moment(pStartDate).isSame(startDateObject.startDate)) {
                    return peakhr;
                }

                if (moment(pStartDate).isSame(endDateObject.endDate)) {
                    return peakhr;
                }

                if (moment(pEndDate).isSame(startDateObject.startDate)) {
                    return peakhr;
                }

                if (moment(pEndDate).isSame(endDateObject.endDate)) {
                    return peakhr;
                }

                if (moment(startDateObject.startDate).isBetween(pStartDate, pEndDate, undefined, '[]') && moment(endDateObject.endDate).isBetween(pStartDate, pEndDate, undefined, '[]')) {
                    return peakhr;
                }

                if (moment(pStartDate).isBetween(moment(startDateObject.startDate), moment(endDateObject.endDate), undefined, '[]') && moment(pEndDate).isBetween(moment(startDateObject.startDate), moment(endDateObject.endDate), undefined, '[]')) {
                    return peakhr;
                }
                // console.log('test');
            });
            // console.log(selectedPeakHrs);
            return config.Promise.resolve(selectedPeakHrs);
        });
    }

    function fetchPackageVehicles(vehicleIds, database) {
        // console.log('vehicleIds');
        // console.log(vehicleIds);
        return database.packageVehicles.findAll({
            where: { vehicleId: { $in: [vehicleIds] } },
            attributes: ['packageId', 'vehicleId']
        }).then((resp) => {
            // console.log(_.indexify(resp, 'vehicleId', 'packageId'));
            return config.Promise.resolve(resp);
        });
    }

    function fetchPackageDetails(packageIds, database) {
        //  console.log(packageIds);
        return database.packageDetails.findAll({
            where: { id: { $in: packageIds } },
            attributes: ['id', 'name', 'freeKm', 'extraKmCharges', 'vehicleId', 'weekdayTariff', 'weekendTariff', 'minimumBookingHrs', 'costingHr']
        }).then((resp) => {
            // console.log(resp.dataValues);
            return config.Promise.resolve(resp);
        });
    }
};





// CREATE TABLE `mobility_core`.`temp_bookings` (
//     `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
//     `vehicle_id` BIGINT(20) NULL,
//     `start_date` DATETIME NULL,
//     `end_date` DATETIME NULL,
//     `booking_status` VARCHAR(45) NULL,
//     `vehicle_uuid` VARCHAR(245) NULL,
//     `booking_id` BIGINT(20) NULL,
//     `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//     `modified_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//     `created_by` BIGINT(20) NULL DEFAULT 0,
//     `modified_by` BIGINT(20) NULL DEFAULT 0,
//     PRIMARY KEY (`id`));
  



'use strict';
const Razorpay = require('razorpay');
module.exports = function (config, _) {
    return function (database, data, req) {
        let vehicleDetails = data.vehicleDetails,
            packageDetails = data.packageDetails, peakdayList = [];


        return fetchPeakDays(data.startDateObject, data.endDateObject, database).then((resp) => {
            peakdayList = resp;
            return calculateTripCost(packageDetails, data.startDateObject, data.endDateObject, peakdayList);
        }).then((resp) => {
           
            return config.Promise.resolve(resp);
        });

        return config.Promise.resolve(packageDetails);
    };

    function fetchPeakDays(startDateObject, endDateObject, database) {
        var moment = config.moment;
        return database.peakhrs.findAll({
            limit: 100
        }).then((peakhrList) => {

            peakhrList = _.map(peakhrList, 'dataValues');
            //  console.log(peakhrList);
            var selectedPeakHrs = _.filter(peakhrList, function (peakhr) {
                var pStartDate = moment(peakhr.startDate).format('YYYY-MM-DD');
                // console.log(pStartDate);
                var pEndDate = moment(peakhr.endDate).format('YYYY-MM-DD');
                if (moment(pStartDate).isBetween(startDateObject.startDate, endDateObject.endDate, undefined,
                    '[]')) {
                    return peakhr;
                }

                if (moment(pEndDate).isBetween(startDateObject.startDate, endDateObject.endDate, undefined, '[]')) {
                    return peakhr;
                }

                if (moment(pStartDate).isSame(startDateObject.startDate)) {
                    return peakhr;
                }

                if (moment(pStartDate).isSame(endDateObject.endDate)) {
                    return peakhr;
                }

                if (moment(pEndDate).isSame(startDateObject.startDate)) {
                    return peakhr;
                }

                if (moment(pEndDate).isSame(endDateObject.endDate)) {
                    return peakhr;
                }

                if (moment(startDateObject.startDate).isBetween(pStartDate, pEndDate, undefined, '[]') && moment(endDateObject.endDate).isBetween(pStartDate, pEndDate, undefined, '[]')) {
                    return peakhr;
                }

                if (moment(pStartDate).isBetween(moment(startDateObject.startDate), moment(endDateObject.endDate), undefined, '[]') && moment(pEndDate).isBetween(moment(startDateObject.startDate), moment(endDateObject.endDate), undefined, '[]')) {
                    return peakhr;
                }
                // console.log('test');
            });
            // console.log(selectedPeakHrs);
            return config.Promise.resolve(selectedPeakHrs);
        });
    }

    function calculateTripCost(packageDetail, startDateObject, endDateObject, peakdayList) {
        packageDetail = _.merge(packageDetail, {
            weekdayRent: 0,
            weekendRent: 0,
            noOfWeekday: 0,
            noOfWeekends: 0,
            weekDayHrs: 0,
            weekEndHrs: 0,
            totalRent: 0,
            costToTheCustomer: 0,
            totalAmountAfterDiscount: 0,
            totalRentWithTax: 0,
            totalRentWithoutTax: 0,
            totalAmountWithSecurity: 0,
            totalTripDurationInDays: 0,
            totalTripDurationInHrs: 0
        });
        return new Promise((resolve) => {
            if (checkSameDay(startDateObject.startDate, endDateObject.endDate)) {
                packageDetail.testingValue = 'Im Testing Same Day';
                return calculateSameDayRent(startDateObject, endDateObject, packageDetail).then((costConfiguration) => {
                    costConfiguration.weekEndHrs = _.round(costConfiguration.weekEndHrs, 2);
                    costConfiguration.weekDayHrs = _.round(costConfiguration.weekDayHrs, 2);
                    costConfiguration.weekendRent = _.round((costConfiguration.weekendTariff / costConfiguration.costingHr) *
                        costConfiguration.weekEndHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekends = _.round((costConfiguration.weekEndHrs / 24), 2);

                    costConfiguration.weekdayRent = _.round((costConfiguration.weekdayTariff / costConfiguration.costingHr) *
                        costConfiguration.weekDayHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekday = _.round((costConfiguration.weekDayHrs / 24), 2);
                    costConfiguration.totalRent = _.round((costConfiguration.weekendRent + costConfiguration.weekdayRent));
                    // costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
                    costConfiguration.totalTripDurationInHrs = _.round(costConfiguration.weekEndHrs + costConfiguration.weekDayHrs);
                    costConfiguration.totalTripDurationInDays = _.round((costConfiguration.weekEndHrs + costConfiguration
                        .weekDayHrs) / 24);
                    costConfiguration.totalFreeKms = _.round((costConfiguration.freeKm / 24) * costConfiguration.totalTripDurationInHrs,
                        2);
                    return calculateCost(startDateObject, endDateObject, costConfiguration, peakdayList);
                }).then((costConfiguration) => {
                    resolve(costConfiguration);
                });
            } else {
                return calculateStartDayRent(startDateObject, packageDetail).then((costConfiguration) => {
                    return calculateInbetweenRent(startDateObject, endDateObject, costConfiguration);
                }).then((costConfiguration) => {
                    return calculateEndDayRent(endDateObject, costConfiguration);

                }).then(function (costConfiguration) {
                    costConfiguration.weekEndHrs = _.round(costConfiguration.weekEndHrs, 2);
                    costConfiguration.weekDayHrs = _.round(costConfiguration.weekDayHrs, 2);
                    costConfiguration.weekendRent = _.round((costConfiguration.weekendTariff / costConfiguration.costingHr) *
                        costConfiguration.weekEndHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekends = _.round((costConfiguration.weekEndHrs / 24), 2);

                    costConfiguration.weekdayRent = _.round((costConfiguration.weekdayTariff / costConfiguration.costingHr) *
                        costConfiguration.weekDayHrs);
                    // costConfiguration.totalRent += _.round(costConfiguration.weekdayRent, 2);
                    costConfiguration.noOfWeekday = _.round((costConfiguration.weekDayHrs / 24), 2);
                    costConfiguration.totalRent = _.round((costConfiguration.weekendRent + costConfiguration.weekdayRent));
                    // costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
                    costConfiguration.totalTripDurationInHrs = _.round(costConfiguration.weekEndHrs + costConfiguration.weekDayHrs);
                    costConfiguration.totalTripDurationInDays = _.round((costConfiguration.weekEndHrs + costConfiguration
                        .weekDayHrs) / 24);
                    costConfiguration.totalFreeKms = _.round((costConfiguration.freeKm / 24) * costConfiguration.totalTripDurationInHrs,
                        2);


                    return calculateCost(startDateObject, endDateObject, costConfiguration, peakdayList).then(function (costConfiguration) {
                        costConfiguration.testingValue = 'Im Testing Not Same Day';
                        resolve(costConfiguration);
                    });
                });

            }

            //resolve(packageDetail);
            //   console.log(packageDetail);
            // packageDetail.testingValue = 'Im Testing Value';
            // resolve(packageDetail);
        });
    }

    function calculateInbetweenRent(startDateObject, endDateObject, costConfiguration) {
        var startDate = config.moment(startDateObject.startDate).add(1, "days").format("YYYY-MM-DD"),
            endDate = config.moment(endDateObject.endDate).subtract(1, "days").format("YYYY-MM-DD");
        costConfiguration.weekEndHrs += findWeekendhrs(startDate, endDate);
        costConfiguration.weekDayHrs += findWeekdayhrs(startDate, endDate);
        return config.Promise.resolve(costConfiguration);
    }

    function calculateEndDayRent(endDateObject, costConfiguration) {
        if (findThursday(endDateObject.endDate)) {
            if (endDateObject.endTime < '18:00') {

                costConfiguration.weekDayHrs += _.round(calculateHrs({
                    startDate: endDateObject.endDate,
                    startTime: '00:00',
                    endDate: endDateObject.endDate,
                    endTime: endDateObject.endTime
                }));

            } else {

                costConfiguration.weekDayHrs += _.round(calculateHrs({
                    startDate: endDateObject.endDate,
                    startTime: '00:00',
                    endDate: endDateObject.endDate,
                    endTime: '18:00'
                }));

                costConfiguration.weekEndHrs += _.round(calculateHrs({
                    startDate: endDateObject.endDate,
                    startTime: '18:00',
                    endDate: endDateObject.endDate,
                    endTime: endDateObject.endTime
                }));
            }
        } else if (findWeekend(endDateObject.endDate, endDateObject.endTime)) {
            costConfiguration.weekEndHrs += _.round(calculateHrs({
                startDate: endDateObject.endDate,
                startTime: '00:00',
                endDate: endDateObject.endDate,
                endTime: endDateObject.endTime
            }));
        } else {
            costConfiguration.weekDayHrs += _.round(calculateHrs({
                startDate: endDateObject.endDate,
                startTime: '00:00',
                endDate: endDateObject.endDate,
                endTime: endDateObject.endTime
            }));
        }
        return config.Promise.resolve(costConfiguration);
    }

    function calculateSameDayRent(starteDateObj, endDateObj, costConfiguration) {
        if (!findWeekend(starteDateObj.startDate, starteDateObj.startTime) && !(
            findWeekend(endDateObj.endDate, endDateObj.endTime))) {
            //Calcuate WeekDayRent
            costConfiguration = _.merge(costConfiguration, calculateWeekDayRent({
                startDate: starteDateObj.startDate,
                startTime: starteDateObj.startTime,
                endDate: endDateObj.endDate,
                endTime: endDateObj.endTime
            }, costConfiguration));
            return config.Promise.resolve(costConfiguration);
        }

        //Check for WeekEnd
        if (findWeekend(starteDateObj.startDate, starteDateObj.startTime) && (
            findWeekend(endDateObj.endDate, endDateObj.endTime))) {
            //Calculate WeekEndREnt
            costConfiguration = _.merge(costConfiguration, calculateWeekEndRent({
                startDate: starteDateObj.startDate,
                startTime: starteDateObj.startTime,
                endDate: endDateObj.endDate,
                endTime: endDateObj.endTime
            }, costConfiguration));
            return config.Promise.resolve(costConfiguration);
        }

        //Automate Thursday
        costConfiguration = _.merge(costConfiguration, calculateWeekDayRent({
            startDate: starteDateObj.startDate,
            startTime: starteDateObj.startTime,
            endDate: endDateObj.endDate,
            endTime: '18:00'
        }, costConfiguration));


        costConfiguration = _.merge(costConfiguration, calculateWeekEndRent({
            startDate: starteDateObj.startDate,
            startTime: '18:00',
            endDate: endDateObj.endDate,
            endTime: endDateObj.endTime
        }, costConfiguration));

        return config.Promise.resolve(costConfiguration);
    }

    function calculateWeekDayRent(dateObj, costConfig) {
        var diff = calculateHrs(dateObj);
        costConfig.weekdayRent = _.round((costConfig.weekdayTariff / costConfig.costingHr) * diff, 2);
        costConfig.totalRent += costConfig.weekdayRent;
        costConfig.noOfWeekday += diff / 24;
        costConfig.weekDayHrs += diff;
        return costConfig;
    }


    function calculateWeekEndRent(dateObj, costConfig) {
        var diff = calculateHrs(dateObj);
        costConfig.weekendRent = _.round((costConfig.weekendTariff / costConfig.costingHr) * diff, 2);
        costConfig.totalRent += _.round(costConfig.weekdayRent, 2);
        costConfig.noOfWeekends += diff / 24;
        costConfig.weekEndHrs += diff;
        return costConfig;
    }

    function calculateStartDayRent(startDateObject, costConfiguration) {
        if (findThursday(startDateObject.startDate)) {
            if (startDateObject.startTime < '18:00') {

                costConfiguration.weekDayHrs = _.round(calculateHrs({
                    startDate: startDateObject.startDate,
                    startTime: startDateObject.startTime,
                    endDate: startDateObject.startDate,
                    endTime: '18:00'
                }), 2);

                costConfiguration.weekEndHrs = _.round(calculateHrs({
                    startDate: startDateObject.startDate,
                    startTime: '18:00',
                    endDate: startDateObject.startDate,
                    endTime: '23:59'
                }), 2);
            } else {
                costConfiguration.weekEndHrs = _.round(calculateHrs({
                    startDate: startDateObject.startDate,
                    startTime: startDateObject.startTime,
                    endDate: startDateObject.startDate,
                    endTime: '23:59'
                }), 2);
            }
        } else if (findWeekend(startDateObject.startDate, startDateObject.startTime)) {
            costConfiguration.weekEndHrs = _.round(calculateHrs({
                startDate: startDateObject.startDate,
                startTime: startDateObject.startTime,
                endDate: startDateObject.startDate,
                endTime: '23:59'
            }), 2);
        } else {
            costConfiguration.weekDayHrs = _.round(calculateHrs({
                startDate: startDateObject.startDate,
                startTime: startDateObject.startTime,
                endDate: startDateObject.startDate,
                endTime: '23:59'
            }), 2);
        }
        return config.Promise.resolve(costConfiguration);
    }

    function calculateCost(startDateObject, endDateObject, costConfiguration, peakdayList) {

        var securityDeposit = 3000;
        var startDateTime = new Date(startDateObject.startDate + ' ' + startDateObject.startTime),
            endDateTime = new Date(endDateObject.endDate + ' ' + endDateObject.endTime),
            timeDiffObj = (endDateTime - startDateTime) / 1000 / 60 / 60; //(bookingDetails.bookingEndDate, endDateTime);

        if (timeDiffObj <= 24) {
            securityDeposit = 1500;
        }

        var pStartDate = config.moment(startDateObject.startDate).format('YYYY-MM-DD');
        var pEndDate = config.moment(endDateObject.endDate).format('YYYY-MM-DD');
        var holidayDate = config.moment('2020-01-26').format('YYYY-MM-DD');

        costConfiguration.normalWeekdayRent = costConfiguration.weekdayRent;
        costConfiguration.normalWeekendRent = costConfiguration.weekendRent;


        if (peakdayList.length > 0) {
            peakdayList = _.maxBy(peakdayList, 'charges'); //peakdayList[peakdayList.length - 1];

            //Conditon 1 : if peak start date is between booking start and end date
            //condition 2 : if peak end date is between booking start and end date
            //condition 3 : if booking start and end date between peak start date and end date
            //console.log(costConfiguration);
            //console.log(peakdayList);
            if (config.moment(peakdayList.startDate).isBetween(pStartDate, pEndDate, undefined,
                '[]')) {
                //   console.log(1);
                costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);

                costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
            } else if (config.moment(peakdayList.endDate).isBetween(pStartDate, pEndDate, undefined,
                '[]')) {
                var endDiff = config.moment(pEndDate).diff(peakdayList.endDate, 'hours');
                var startDiff = config.moment(peakdayList.endDate).diff(pStartDate, 'hours');

                if (startDiff >= 18 && endDiff <= 24) {
                    //console.log('In between!!!');
                    costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                    costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);
                    costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
                }
            } else if (moment(pStartDate).isBetween(config.moment(peakdayList.startDate), config.moment(peakdayList.endDate), undefined,
                '[]') && moment(pEndDate).isBetween(config.moment(peakdayList.startDate), config.moment(peakdayList.endDate), undefined,
                    '[]')) {
                // console.log(3);
                costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);
                costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
            } else {
                // console.log('Others!!!!');
                costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * peakdayList.charges);
                costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * peakdayList.charges);
                costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
            }





        }

        //In between
        // if (config.moment('2021-01-26').isBetween(pStartDate, pEndDate, undefined,
        //     '[]')) {

        //   // console.log(costConfiguration.weekendTariff);
        //   // console.log('-------------------------------------');

        //   costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * 1.5);
        //   costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * 1.5);
        //   costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
        // }

        //Start Date is Same 

        //  if (config.moment('2021-01-26').isSame(pStartDate)) {
        //   console.log('startdate');
        //    costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * 1.5);
        //    costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * 1.5);
        //    costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
        //  }


        //  // End Date is Same
        // else if (config.moment('2021-01-26').isSame(pEndDate)) {
        //  console.log('enddate');
        //    costConfiguration.weekdayRent = _.round(costConfiguration.weekdayRent * 1.5);
        //    costConfiguration.weekendRent = _.round(costConfiguration.weekendRent * 1.5);
        //    costConfiguration.totalRent = costConfiguration.weekendRent + costConfiguration.weekdayRent;
        //  }

        // if (moment(pEndDate).isSame(startDateObject.startDate)) {
        //   return peakhr;
        // }

        // if (moment(pEndDate).isSame(endDateObject.endDate)) {
        //   return peakhr;
        // }
        // console.log(costConfiguration);

        costConfiguration.totalHrs = _.round(costConfiguration.weekDayHrs + costConfiguration.weekEndHrs);
        costConfiguration.securityDeposit = securityDeposit;
        costConfiguration.discountPercentage = costConfiguration.discountPercentage || 0;
        costConfiguration.totalAmountAfterDiscount = costConfiguration.discountPercentage == 0 ? costConfiguration
            .totalRent :
            costConfiguration.totalRent - (costConfiguration.totalRent * costConfiguration.discountPercentage /
                100);
        costConfiguration.totalDiscount = _.round(costConfiguration.totalRent * costConfiguration.discountPercentage /
            100, 2);

        costConfiguration.totalRentWithoutTax = costConfiguration.totalAmountAfterDiscount;
        costConfiguration.totalRentWithTax = _.round(costConfiguration.totalRentWithoutTax + (costConfiguration
            .totalRentWithoutTax *
            28 / 100));
        costConfiguration.totalTripDurationInHrs = _.round(costConfiguration.weekEndHrs + costConfiguration.weekDayHrs);
        costConfiguration.extraFreeKm = costConfiguration.extraFreeKm || 0;
        costConfiguration.totalFreeKms = (costConfiguration.freeKm / 24) * costConfiguration.totalTripDurationInHrs;
        costConfiguration.totalFreeKms = _.round(costConfiguration.totalFreeKms) + costConfiguration.extraFreeKm;
        costConfiguration.taxAmount = _.round(costConfiguration.totalRentWithoutTax * 28 / 100);
        costConfiguration.bookingLineItems = [];
        costConfiguration.bookingLineItems.push({
            name: 'Weekday Charges',
            price: costConfiguration.weekdayRent || 0,
            description: 'Weekday Charges ',
            discount: 0
        }, {
            name: 'Weekend Charges',
            price: costConfiguration.weekendRent || 0,
            description: 'Weekend Charges ',
            discount: 0
        }, {
            name: 'Security Deposit',
            price: securityDeposit,
            description: 'Refunable Amount',
            discount: 0
        }, {
            id: 'deliveryCharges',
            name: 'Delivery Charges',
            price: costConfiguration.deliveryCharges || 0,
            description: 'Delivery Charges',
            discount: 0
        }, {
            id: 'pickupCharges',
            name: 'Pickup Charges',
            price: costConfiguration.pickupCharges || 0,
            description: 'Pickup Charges',
            discount: 0
        }, {
            name: 'Discount',
            price: costConfiguration.totalDiscount ? costConfiguration.totalDiscount : 0,
            description: 'Discount Amount ',
            discount: costConfiguration.totalDiscount ? costConfiguration.totalDiscount : 0
        }, {
            name: 'Tax',
            price: costConfiguration.taxAmount,
            description: 'CGST-14% , SGST-14% ',
            discount: 0
        });

        if (!_.has(costConfiguration, 'isExtension')) {
            costConfiguration.totalAmountWithSecurity = _.round(costConfiguration.totalRentWithTax + securityDeposit);
        } else {
            costConfiguration.totalAmountWithSecurity = _.round(costConfiguration.totalRentWithTax);
            costConfiguration.totalAmountWithSecurity += costConfiguration.deliveryCharges || 0;
            costConfiguration.totalAmountWithSecurity += costConfiguration.pickupCharges || 0;
        }

        costConfiguration.costToTheCustomer = costConfiguration.totalAmountWithSecurity;
        return config.Promise.resolve(costConfiguration);
    }

    function findWeekendhrs(startDate, endDate) {
        var start = new Date(startDate),
            finish = new Date(endDate),
            dayMilliseconds = 1000 * 60 * 60 * 24,
            weekendhrs = 0;

        while (start <= finish) {
            var day = start.getDay();
            if (day == 0 || day == 5 || day == 6) {
                weekendhrs += 24;
            }
            if (day == 4) {
                weekendhrs += 6;
            }
            start = new Date(+start + dayMilliseconds);
        }
        return weekendhrs;
    }

    function findWeekdayhrs(startDate, endDate) {
        var start = new Date(startDate),
            finish = new Date(endDate),
            dayMilliseconds = 1000 * 60 * 60 * 24,
            weekdayhrs = 0;

        while (start <= finish) {
            var day = start.getDay();
            if (day == 1 || day == 2 || day == 3) {
                weekdayhrs += 24;
            }
            if (day == 4) {
                weekdayhrs += 18;
            }
            start = new Date(+start + dayMilliseconds);
        }
        return weekdayhrs;
    }

    function findWeekend(dateObj, timeObj) {
        dateObj = new Date(dateObj);
        if (dateObj.getDay() === 4 && timeObj > '18:00') {
            return true;
        }
        return _.indexOf([0, 5, 6], dateObj.getDay()) < 0 ? false : true;
    }

    function calculateHrs(dateObj) {
        var startDateTime = new Date(dateObj.startDate + ' ' + dateObj.startTime);
        var endDateTime = new Date(dateObj.endDate + ' ' + dateObj.endTime);
        return (endDateTime - startDateTime) / 1000 / 60 / 60;
    }

    function checkSameDay(startDate, endDate) {
        return config.moment(startDate).isSame(endDate);
    }

    function findThursday(dateObj) {
        dateObj = new Date(dateObj);
        if (dateObj.getDay() === 4) {
            return true;
        }
        return false;
        // return  _.indexOf([4], dateObj.getDay()) > 0 ? true : false;
    }

};