const { DataTypes } = require('sequelize');


  module.exports = (sequelize, Sequelize) => {
      const bookingRefund = sequelize.define("fleet_booking_refunds", {
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
          refundStatus: {
              allowNull: true,
              type: DataTypes.TINYINT,
              field: 'refund_status'
          },
          refundableAmount: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'refundable_amount'
          },
         
          transactionCode: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'transaction_code'
          },
          transactionMode: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'transaction_mode'
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
  
      return bookingRefund;
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  