const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("peak_seasons", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        peakSeasonuuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'peak_seasonuuid'
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
        peakRentalCharges: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'peak_rental_charges'
        },

        isActive: {
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_active'
        },
        cityId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'city_id'
        },
        tenantId: {
            allowNull: true,
            type: DataTypes.DOUBLE,
            field: 'tenant_id'
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
        entity.peakSeasonuuid = crypto.randomBytes(20).toString('hex');
    });

    return dataModel;
};



















