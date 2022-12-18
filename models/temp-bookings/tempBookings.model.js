const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("temp_bookings", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        vehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'vehicle_id'
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
        bookingStatus: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'booking_status'
        },
        vehicleUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'vehicle_uuid'
        },
        bookingId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'booking_id'
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
       
    }, {
        timestamps: false
    });

    

    return dataModel;
};



















