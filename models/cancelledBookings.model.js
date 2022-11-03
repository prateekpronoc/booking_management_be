const { DataTypes } = require('sequelize');


  module.exports = (sequelize, Sequelize) => {
      const dataModel = sequelize.define("self_drive_cancelled_bookings", {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: DataTypes.INTEGER
          },
          bookingId: {
              allowNull: true,
              type: DataTypes.BIGINT,
              field: 'booking_id'
          },
          bookingCode: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'booking_code'
          },
          policyId: {
              allowNull: true,
              type: DataTypes.BIGINT,
              field: 'policy_id'
          },
          amountRefunded: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'amount_refunded'
          },
         
          totalRefundableAmount: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'total_refundable_amount'
          },
          amountToBeDeducted: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'amount_to_be_deducted'
          },
          baseRent: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'base_rent'
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
  
      return dataModel;
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  