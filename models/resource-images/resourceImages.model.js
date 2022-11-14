


const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("resource_images", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuidString: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'uuid_string'
        },
        resourceId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'resource_id'
        },
        resourceType: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'resource_type'
        },
        fileName: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'file_name'
        },
        filePath: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'file_path'
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'description'
        },
        tags: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'tags'
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
        entity.uuidString = crypto.randomBytes(20).toString('hex');
    });

    return dataModel;
};



















