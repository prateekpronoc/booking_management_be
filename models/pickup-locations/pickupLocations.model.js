const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("pickup_locations", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuidDelivery: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'uuid_delivery'
        },
        name: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'name'
        },
        locationAddress: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'location_address'
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
        cityName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'city_name'
        },
        longitude: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'longitude'
        },
        latitude: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'latitude'
        },
        charges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'charges'
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
        entity.uuidDelivery = crypto.randomBytes(20).toString('hex');
    });

    return dataModel;
};



















