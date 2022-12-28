const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const bookingExtensions = sequelize.define("booking_histories", {
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
        action: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'action'
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
        rawData: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'raw_data'
        },
        generatedOn: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'generated_on'
        },
        emailId :{
            allowNull: true,
            type: DataTypes.STRING,
            field: 'email_id'
        }

    }, {
        timestamps: false
    });

    return bookingExtensions;
};