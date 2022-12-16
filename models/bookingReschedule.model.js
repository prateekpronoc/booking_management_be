const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("seldrive_booking_reschedulings", {
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
        bookingCode: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'booking_code'
        },
        newVehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'new_vehicle_id'
        },
        oldVehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'old_vehicle_id'
        },

        isSwapped: {
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_swapped'
        },
        newRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'new_rent'
        },
        oldRent: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'old_rent'
        },
        currentStartDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'current_startDate'
        },
        newStartDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'new_startDate'
        },
        currentEndDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'current_endDate'
        },
        newendDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'new_endDate'
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
        paymentType: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'payment_type'
        }
    }, {
        timestamps: false
    });

    return dataModel;
};



















