const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("user_audit_logs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuidLogs: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'uuid_logs'
        },
        userName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'user_name'
        },
        userId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'user_id'
        },
        moduleName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'module_name'
        },
        actionName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'action_name'
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'description'
        },
        appName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'chapp_namearges'
        },
        generatedOn: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'generated_on'
        }

    }, {
        timestamps: false
    });

    dataModel.beforeCreate(async (entity, options) => {
        entity.uuidLogs = crypto.randomBytes(20).toString('hex');
    });
    return dataModel;
};



















