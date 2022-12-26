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
			field: 'name'
		},
		registration_no: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'registration_no'
		},
		engine_no: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'engine_no'
		},
		chassis_no: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'chassis_no'
		},
		seating_capacity: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'seating_capacity'
		},
		vehicle_type: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vehicle_type'
		},
		vehicle_make: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vehicle_make'
		},
		vehicle_variant: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vehicle_variant'
		},
		vehicle_model: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vehicle_model'
		},
		registration_date: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'registration_date'
		},
		on_road_date: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'on_road_date'
		},
		vendor_id: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vendor_id'
		},
		transmission_type: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'transmission_type'
		},
		body_type: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'body_type'
		},
		fuel_type: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'fuel_type'
		},
		vehiclegroup_id: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vehiclegroup_id'
		},
		cityId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'city_id'
		},
		currentStatus: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'current_status'
		},
		hub_id : {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'hub_id'
		},
		tenant_id: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'tenant_id'
		},
		vehicle_status  : {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'vehicle_status'
		},
		onboarding_odometer: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'onboarding_odometer'
		},
		is_deleted : {
			allowNull: true,
			type: DataTypes.TINYINT,
			field: 'is_deleted'
		},
		manufactured_year: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'manufactured_year'
		},
		current_odometer : {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'current_odometer'
		},
		registration_state: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'registration_state'
		},
		profile_photo_url : {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'profile_photo_url'
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

	return customer;
};


