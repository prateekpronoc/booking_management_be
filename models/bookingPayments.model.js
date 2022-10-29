const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const bookingPayments = sequelize.define("selfdrive_booking_payments", {
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
        paymentUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'payment_uuid'
        },
        amount: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'amount'
        },
       
        transactionalCharges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'transactional_charges'
        },
        paymetMode: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'paymet_mode'
        },
        paymentLink: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'payment_link'
        },
        orderId: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'order_id'
        },
        status: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'status'
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
        transactionId :{
            allowNull: true,
            type: DataTypes.STRING,
            field: 'transaction_id'
        },
        paymentRemark : {
            allowNull : true,
            type : DataTypes.STRING,
            field: 'payment_remark'
        }
    }, {
        timestamps: false
    });

    return bookingPayments;
};



















