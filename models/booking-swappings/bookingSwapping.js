
const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const fleetBookingSwappings = sequelize.define("fleet_booking_swappings", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        rowUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'row_uuid'
        },
        bookingId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'booking_id'
        },
        bookingCode: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'booking_code'
        },
        previousVehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'previous_vehicle_id'
        },
        previousVehicleRegistrationNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'previous_vehicle_registration_no'
        },
        previousVehicleName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'previous_vehicle_name'
        },
        vehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'vehicle_id'
        },
        vehicleRegistrationNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'vehicle_registration_no'
        },
        vehicleName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'vehicle_name'
        },
        reasonForSwapping: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'reason_for_swapping'
        },
        requestedBy: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'requested_by'
        },
        previousRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'previous_rent'
        },
        newRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'new_rent'
        },
        previousPackageId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'previous_package_id'
        },
        previousPackageName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'previous_package_name'
        },
        newPackageId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'new_package_id'
        },
        newPackageName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'new_package_name'
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
        },
        paymentType :{
            allowNull: true,
            type: DataTypes.STRING,
            field: 'payment_type'
        }
    }, {
        timestamps: false
    });

    return fleetBookingSwappings;
};



















