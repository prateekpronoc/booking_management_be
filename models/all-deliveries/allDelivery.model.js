const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("all_deliveries", {
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
        deliveryAddress: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'delivery_address'
        },
        agentName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'agent_name'
        },

        agentId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'agent_id'
        },
        amountPaid: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'amount_paid'
        },
        generatedOn: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'generated_on'
        },
        agentEmail: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'agent_email'
        },
        status: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'status'
        },
        bookingStartDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'booking_start_date'
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
        cityId : {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'city_id'
        },
        cityName : {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'city_name'
        },
        hubId : {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'hub_id'
        },
        hubName : {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'hub_name'
        },
        startingOdometer :{
            allowNull: true,
            type: DataTypes.STRING,
            field: 'starting_odometer'
        }
    }, {
        timestamps: false
    });

    return dataModel;
};