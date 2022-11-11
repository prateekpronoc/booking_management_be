const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("vehicle_groups", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        groupUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'group_uuid'
        },
        name: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'name'
        },
        groupType: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'group_type'
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
        fuelType: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'fuel_type'
        },
        bodyType: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'body_type'
        },
        seatingCapacity :{
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'seating_capacity'
        },
        vehicleModel: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'vehicle_model'
        },
        profilePhotoUrl: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'profile_photo_url'
        },
        displayText: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'display_text'
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
        }
    }, {
        timestamps: false
    });

    dataModel.beforeCreate(async (entity, options) => {
        entity.groupUuid = crypto.randomBytes(20).toString('hex');
    });

    return dataModel;
};



















