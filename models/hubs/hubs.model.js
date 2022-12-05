const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("hubs", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        hubUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'hub_uuid'
        },
        name: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'name'
        },
        address: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'address'
        },
        tenantId: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'tenant_id'
        },
        cityId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'city_id'
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

    dataModel.beforeCreate(async (entity, options) => {
        entity.hubUuid = crypto.randomBytes(20).toString('hex');
    });

    return dataModel;
};



















