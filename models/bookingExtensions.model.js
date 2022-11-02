
const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const bookingExtensions = sequelize.define("daily_rental_extensions", {
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

        weekDayHrs: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'week_day_hrs'
        },
        weekEndHrs: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'week_end_hrs'
        },
        totalFreeKms: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'total_free_kms'
        },
        totalHrs: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'total_hrs'
        },
        taxAmount: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'tax_amount'
        },
        totalRentWithTax: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'total_rent_with_tax'
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
    }, {
        timestamps: false
    });

    return bookingExtensions;
};



















