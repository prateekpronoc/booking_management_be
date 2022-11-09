

const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("user_attendances", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userAttendanceuuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'user_attendanceuuid'
        },
        name: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'name'
        },
        contactNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_no'
        },
        contactEmail: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_email'
        },

        deviceId: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'device_id'
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
        markedDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'marked_date'
        },
        tenantId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'tenant_id'
        },
        userId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'user_id'
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
        const userAttendanceuuid = crypto.randomBytes(20).toString('hex');
        entity.userAttendanceuuid = userAttendanceuuid;
    });
    return dataModel;
};


















