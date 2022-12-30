const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
   const dataModel = sequelize.define('tracking_links', {
        // The following specification of the 'id' attribute could be omitted
        // since it is the default.
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        bookingCode: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `booking_code`
        },
        is_active: {
            allowNull: true,
            type: DataTypes.STRING
        },
        startingAddress: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `starting_address`
        },
        destinationAddress: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `destination_address`
        },

        driverMobileNumber: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `driver_mobile_number`
        },
        vehicleRegistrationNo: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `vehicle_registration_no`
        },
        driverName: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `driver_name`
        },
        generated_url: {
            allowNull: true,
            type: DataTypes.STRING
        },
        customerName: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'customer_name'
        },
        customerMobileNo: {
            allowNull: false,
            type: DataTypes.STRING,
            field: `customer_mobile_no`
        },
        customerEmail: {
            allowNull: true,
            type: DataTypes.STRING,
            field: `customer_email`
        },
        created_by: {
            allowNull: true,
            type: DataTypes.STRING
        },
        modified_by: {
            allowNull: true,
            type: DataTypes.STRING
        },
        created_on: {
            type: 'TIMESTAMP',
            // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        modified_on: {
            type: 'TIMESTAMP',
            // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        }

    }, {
        timestamps: false
    });

    return dataModel;
};  
