const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const fleetBookings = sequelize.define("fleet_bookings", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        startDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'start_date'
        },
        endDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'end_date'
        },
        actualStartDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'actual_start_date'
        },
        actualEndDate: {
            allowNull: true,
            type: DataTypes.TIME,
            field: 'actual_end_date'
        },
       
        vehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'vehicle_id'
        },
        vehicleName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'vehicle_name'
        },
        registrationNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'registration_no'
        },
        vehicleGroupId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'vehicle_group_id'
        },
        customerId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'customer_id'
        },
        packageId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'package_id'
        },

        generatedBy: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'generated_by'
        },
        destination: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'destination'
        },
        bookingUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'booking_uuid'
        },
        bookingType: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'booking_type'
        },
        bookingCode: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'booking_code'
        },
        inquiryCode: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'inquiry_code'
        },
        // -------------------------------------------
        deliveryCharges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'delivery_charges'
        },

        deliveryAddress: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'delivery_address'
        },

        pickupCharges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'pickup_charges'
        },

        pickupAddress: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'pickup_address'
        },

        //----------------------------------------- 
        extraFreeKm: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'extra_free_km'
        },
        overallFreeKm: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'overall_free_km'
        },
        weekdayHrs: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'weekday_hrs'
        },
        weekendHrs: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'weekend_hrs'
        },
        extraHrCharges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'extra_hr_charges'
        },
        extraKmCharges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'extra_km_charges'
        },
        refundableAmount: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'refundable_amount'
        },
        extraKmTariff: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'extra_km_tariff'
        },
        taxAmount: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'tax_amount'
        },
        //-------------------------------------
        discountPercentage: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'discount_percentage'
        },
        discountAmount: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'discount_amount'
        },
        weekdayRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'weekday_rent'
        },
        weekendRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'weekend_rent'
        },
        securityDeposit: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'security_deposit'
        },
        totalRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'total_rent'
        },
        status: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'status'
        },
        customerName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'customer_name'
        },
        customerContactNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'customer_contact_no'
        },

        createdBy: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'created_by'
        },
        modifiedBy: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'modified_by'
        },
        modifiedOn: {
            allowNull: true,
            type: `TIMESTAMP`,
            field: 'modified_on'
        },
        createdOn: {
            allowNull: true,
            type: `TIMESTAMP`,
            field: 'created_on'
        }
    }, {
        timestamps: false
    });

    return fleetBookings;
};



















