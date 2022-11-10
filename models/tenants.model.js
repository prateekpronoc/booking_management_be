const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize,database) => {
    const dataModel = sequelize.define("tenants", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'name'
        },
        alias: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'alias'
        },
        tenantType: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'tenant_type'
        },
        cityId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'city_id'
        },
        contactPerson: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_person'
        },
        contact_number: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_number'
        },
        contactEmail: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_email'
        },
        address: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'address'
        },
        status: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'status'
        },
        emailDomains: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'email_domains'
        },
        tenantUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'tenant_uuid'
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
        entity.tenantUuid = crypto.randomBytes(20).toString('hex');
    });

    database.tenants = dataModel;
    // return dataModel;
};



















