const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const customer = sequelize.define("daily_rental_inquiries", {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        inquiryUuid: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'inquiry_uuid'
		},
        startDate: {
			allowNull: true,
			type: DataTypes.DATE,
            field : 'start_date'
		},
        endDate: {
			allowNull: true,
			type: DataTypes.DATE,
            field : 'end_date'
		},
        startTime: {
			allowNull: true,
			type: DataTypes.TIME,
            field : 'start_time'
		},
		endTime: {
			allowNull: true,
			type: DataTypes.TIME,
            field : 'end_time'
		},
        vehicleRegistartionNo: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'vehicle_registartion_no'
		},
        customerUuid: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'customer_uuid'
		},
        vehicleName: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'vehicle_name'
		},
        createdBy: {
			allowNull: true,
			type: DataTypes.BIGINT,
            field : 'created_by'
		},
        modifiedBy: {
			allowNull: true,
			type: DataTypes.BIGINT,
            field : 'modified_by'
		},
        modifiedOn: {
			allowNull: true,
			type: `TIMESTAMP`,
            field : 'modified_on'
		},
        createdOn: {
			allowNull: true,
			type: `TIMESTAMP`,
            field : 'created_on'
		}
    },{
        timestamps : false
    });
  
    return customer;
  };


  