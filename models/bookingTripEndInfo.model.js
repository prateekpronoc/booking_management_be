const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const bookingTripEndInfo = sequelize.define("booking_trip_end_details", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        bookingId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'booking_id'
        },
        images: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'images'
        },
        pickupAgentName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'pickup_agent_name'
        },
        odometerReading: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'odometer_reading'
        },
        pickupAgentId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'pickup_agent_id'
        },
        tripEndDateAndTime: {
            allowNull: true,
            type: `TIMESTAMP`,
            field: 'trip_end_date_and_time'
        },
        fuelPoint: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'fuel_point'
        },
        fuelReturned: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'fuel_returned'
        },
        extraHrs: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'extra_hrs'
        },
        extraKm: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'extra_km'
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

    return bookingTripEndInfo;
};



















