const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const customer = sequelize.define("vehicles", {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        name: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'name'
		},
        registration_no: {
			allowNull: true,
			type: DataTypes.DATE,
            field : 'registration_no'
		},
        seating_capacity: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'seating_capacity'
		},
        vehicle_make: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'vehicle_make'
		},
		vehicle_variant: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'vehicle_variant'
		},
        vehicle_model: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'vehicle_model'
		},
        transmission_type: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'transmission_type'
		},
        body_type: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'body_type'
		},
        fuel_type: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'fuel_type'
		},
        vehiclegroup_id: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'vehiclegroup_id'
		},
    },{
        timestamps : false
    });
  
    return customer;
  };


  