const { DataTypes } = require('sequelize');


  module.exports = (sequelize, Sequelize) => {
      const bookingLineItems = sequelize.define("fleet_booking_line_items", {
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
          comments: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'comments'
          },
          amount: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'amount'
          },
         
          lineItemSubType: {
              allowNull: true,
              type: DataTypes.BIGINT,
              field: 'line_item_sub_type'
          },
          lineItemSubTypeText: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'line_item_sub_type_text'
          },
          lineItemType: {
              allowNull: true,
              type: DataTypes.BIGINT,
              field: 'line_item_type'
          },
          lineIemText: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'line_item_text'
          },
          unitValue: {
              allowNull: true,
              type: DataTypes.DOUBLE,
              field: 'unit_value'
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
  
      return bookingLineItems;
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  