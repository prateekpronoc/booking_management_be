const { DataTypes } = require('sequelize');


module.exports = (sequelize, Sequelize) => {
    const customer = sequelize.define("customers", {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
            field : 'name'
		}
    },{
        timestamps : false
    });
  
    return customer;
  };

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
// module.exports = (sequelize) => {
//  	sequelize.define('customers', {
// 		// The following specification of the 'id' attribute could be omitted
// 		// since it is the default.
// 		id: {
// 			allowNull: false,
// 			autoIncrement: true,
// 			primaryKey: true,
// 			type: DataTypes.INTEGER
// 		},
// 		name: {
// 			allowNull: false,
// 			type: DataTypes.STRING,
//             field : 'name'
// 		},
//         contact_email :{
//             allowNull:false,
//             type: DataTypes.STRING
//         },
//         contact_no :{
//             allowNull:false,
//             type: DataTypes.STRING
//         },
//         customer_uuid :{
//             allowNull:false,
//             type: DataTypes.STRING
//         },
//         created_at: {
//             type: 'TIMESTAMP',
//             // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
//             allowNull: true
//           },
//           updated_at: {
//             type: 'TIMESTAMP',
//             // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
//             allowNull: true
//           }
        
// 	},{
//         timestamps: false
//     });
// };



