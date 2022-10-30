const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const bookingSeq = sequelize.define("booking_sequences", {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT
		},
        createdOn: {
			allowNull: true,
			type: `TIMESTAMP`,
            field : 'created_on'
		}
    },{
        timestamps : false
    });
  
    return bookingSeq;
  };


  