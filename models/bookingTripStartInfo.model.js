
const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const bookingTripStartInfo = sequelize.define("booking_trip_start_details", {
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
        deliveryAgentName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'delivery_agent_name'
        },
        odometerReading: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'odometer_reading'
        },
        deliveryAgentId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'delivery_agent_id'
        },
        tripStartDateAndTime: {
            allowNull: true,
            type: `TIMESTAMP`,
            field: 'trip_start_date_and_time'
        },
        fuelPoint: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'fuel_point'
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

    return bookingTripStartInfo;
};



















