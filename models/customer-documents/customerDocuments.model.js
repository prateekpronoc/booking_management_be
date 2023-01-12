
const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("customer_documents", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        customerId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'customer_id'
        },
        documentType: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'document_type'
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'description'
        },
        validFrom: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'valid_from'
        },
        validTo: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'valid_to'
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
        documentId: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'document_id'
        },
        isApproved: {
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_approved'
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

    return dataModel;
};



















