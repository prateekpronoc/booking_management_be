const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("blocked_vehicles", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        vehicleName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'vehicle_name'
        },
        vehicleId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'vehicle_id'
        },
        registrationNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'registration_no'
        },
        hubId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'hub_id'
        },

        hubName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'hub_name'
        },
        cityId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'city_id'
        },
        cityName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'city_name'
        },
        agentId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'agent_id'
        },
        agentName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'agent_name'
        },
        reason: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'reason'
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
        uuidValue: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'uui_value'
        },
        vehicleUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'vehicle_uuid'
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
        isUnblocked :{
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_unblocked'
        }
    }, {
        timestamps: false
    });

    return dataModel;
};



















