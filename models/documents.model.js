
const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const documents = sequelize.define("documents", {
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
        docUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'doc_uuid'
        },
        resourceId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'resource_id'
        },
        resourceType: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'resource_type'
        },
        documentType: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'document_type'
        },

        doucumnetTypeText: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'doucumnet_type_text'
        },
        identificationNo: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'identification_no'
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'description'
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
       
        // `is_archived` tinyint(1) DEFAULT '0',
        isExpired: {
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_expired'
        },
        // `is_file_removed` tinyint(1) DEFAULT '0',
       
        // `vendor_id` bigint(20) DEFAULT '0',
       
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

    return documents;
};



















