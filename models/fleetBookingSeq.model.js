const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const customer = sequelize.define("fleet_booking_seq", {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT
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


  