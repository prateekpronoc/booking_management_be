const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const rentalPackage = sequelize.define("rental_packages", {
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
        cost_per_km: {
			allowNull: true,
			type: DataTypes.DOUBLE,
            field : 'cost_per_km'
		},
        extra_km_cost: {
			allowNull: true,
			type: DataTypes.DOUBLE,
            field : 'extra_km_cost'
		},
        cost_per_hr: {
			allowNull: true,
			type: DataTypes.DOUBLE,
            field : 'cost_per_hr'
		},
		extra_hr_cost: {
			allowNull: true,
			type: DataTypes.DOUBLE,
            field : 'extra_hr_cost'
		},
        weekend_cost: {
			allowNull: true,
			type: DataTypes.DOUBLE,
            field : 'weekend_cost'
		},
        km_per_hr: {
			allowNull: true,
			type: DataTypes.STRING,
            field : 'km_per_hr'
		},
		vehiclegroup_id: {
			allowNull: true,
			type: DataTypes.INTEGER,
            field : 'vehiclegroup_id'
		},
      
    },{
        timestamps : false
    });
  
    return rentalPackage;
  };


  