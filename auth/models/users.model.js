// CREATE TABLE `mobility_core`.`users` (
//     `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
//     `user_uuid` VARCHAR(245) NULL,
//     `name` VARCHAR(45) NOT NULL,
//     `username` VARCHAR(45) NOT NULL,
//     `password` VARCHAR(245) NULL,
//     `contact_email` VARCHAR(45) NULL,
//     `contact_mobile` VARCHAR(45) NULL,
//     `hub_id` BIGINT(20) NULL DEFAULT 0,
//     `city_id` BIGINT(20) NULL DEFAULT 0,
//     `is_archived` TINYINT(1) NULL DEFAULT 0,
//     `tenant_id` BIGINT(20) NULL DEFAULT 0,
//     `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//     `modified_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//     `created_by` BIGINT(20) NULL DEFAULT 0,
//     `modified_by` BIGINT(20) NULL DEFAULT 0,
//     `is_logged_in` TINYINT(1) NULL DEFAULT 0,
//     PRIMARY KEY (`id`),
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);



const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize, database) => {
    const dataModel = sequelize.define("users", {
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
        username: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'username'
        },
        password: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'password'
        },
        contactMobile: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_mobile'
        },
        contactEmail: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'contact_email'
        },
        hubId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'hub_id'
        },
        cityId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'city_id'
        },
        isArchived: {
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_archived'
        },
        tenantId: {
            allowNull: true,
            type: DataTypes.BIGINT,
            field: 'tenant_id'
        },
        userUuid: {
            allowNull: true,
            type: DataTypes.STRING,
            field: 'user_uuid'
        },
        isLogged_in: {
            allowNull: true,
            type: DataTypes.TINYINT,
            field: 'is_logged_in'
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
    },
        // {
        //     hooks: {
        //      beforeCreate: async (user) => {
        //     entity.userUuid = crypto.randomBytes(20).toString('hex');
        //       if (user.password) {
        //        const salt = await bcrypt.genSaltSync(10, 'a');
        //        user.password = bcrypt.hashSync(user.password, salt);
        //       }
        //      },
        //      beforeUpdate:async (user) => {
        //       if (user.password) {
        //        const salt = await bcrypt.genSaltSync(10, 'a');
        //        user.password = bcrypt.hashSync(user.password, salt);
        //       }
        //      }
        //     },
        //     instanceMethods: {
        //      validPassword: (password) => {
        //       return bcrypt.compareSync(password, this.password);
        //      }
        //     }
        //    },
        {
            timestamps: false
        });

    dataModel.beforeCreate(async (user, options) => {
        user.userUuid = crypto.randomBytes(20).toString('hex');
        if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(user.password, salt);
        }
    });

    dataModel.beforeUpdate(async (user, options) => {
        if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(user.password, salt);
        }
    });

    // dataModel.instanceMethods(async(user,options)=>{
    //     validPassword : (password) => {
    //         return bcrypt.compareSync(password, this.password);
    //     }
    // });

    dataModel.prototype.validPassword = function(password) {
        console.log(password)
        return bcrypt.compareSync(password, this.password);
  };
    database.users = dataModel;
    // return dataModel;
};



















