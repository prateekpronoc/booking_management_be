const { DataTypes } = require('sequelize');


  module.exports = (sequelize, Sequelize) => {
      const cancellationPolicies = sequelize.define("cancellation_policies", {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: DataTypes.INTEGER
          },
          tenantId: {
              allowNull: true,
              type: DataTypes.BIGINT,
              field: 'tenant_id'
          },
          name: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'name'
          },
          bufferTime: {
              allowNull: true,
              type: DataTypes.INTEGER,
              field: 'time_buffer'
          },
          deductionPercentage: {
              allowNull: true,
              type: DataTypes.INTEGER,
              field: 'deduction_percentage'
          },
         
          onBillValueName: {
              allowNull: true,
              type: DataTypes.STRING,
              field: 'on_bill_value_name'
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
  
      return cancellationPolicies;
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  