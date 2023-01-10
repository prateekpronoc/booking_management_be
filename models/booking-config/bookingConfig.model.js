const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const dataModel = sequelize.define('selfdrive_booking_configs', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        tenantId :{
            allowNull: true,
			type: DataTypes.INTEGER,
            field : 'tenant_id'
        },
        minBookingHr :{
            allowNull : true,
            type : DataTypes.DOUBLE,
            field : 'min_booking_hr'
        },
        bookingBufferMin :{
            allowNull : true,
            type : DataTypes.DOUBLE,
            field : 'booking_buffer_min'
        },
        cancellationLeadTime :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field:'cancellation_lead_time'
        },
        minDeliveryCharges :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field :'min_delivery_charges'
        },
        minPickupCharges :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field :'min_pickup_charges'
        },
        airportDeliveryCharges:{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field:'airport_delivery_charges'
        },
        airportPickupCharges :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field:'airport_pickup_charges'
        },
        minExtensionHrs :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field :'min_extension_hrs'
        },
        maxExtensionHrs :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field :'max_extension_hrs'
        },
        extensionCount :{
            allowNull : true,
            type :DataTypes.DOUBLE,
            field :'extension_count'
        },
        created_on :{
            type: 'TIMESTAMP',
            // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        created_by :{
            allowNull : true,
            type : DataTypes.INTEGER
        },
        modified_on :{
            type: 'TIMESTAMP',
            // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true

        },
        modified_by :{
            allowNull : true,
            type : DataTypes.INTEGER
        }
    },{
        timestamps: false
    });

    return dataModel;
};



  