
const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const dataModel = sequelize.define("booking_comments", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuidComment: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'uuid_comment'
        },
        comment: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'comment'
        },
        attachmentUrl: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'attachment_url'
        },
        commentedBy: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'commented_by'
        },
       
        bookingId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'booking_id'
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
        entity.uuidComment = crypto.randomBytes(20).toString('hex');
    });

    return dataModel;
};



















