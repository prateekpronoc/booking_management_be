'use strict';

let Promise = require('bluebird'), config = {}, sequelize, database;
const express = require("express");
module.exports = () => {
    let _ = require('./startup/load-lodash')(), cfg = require('config'),
        path = require('path');

    return Promise.try(() => {
        return require('./startup/load-config')(cfg, {}, _);
        
    }).then((configInst)=>{
        config = _.merge(_.clone(cfg), configInst);
        console.log(configInst);
        return Promise.resolve(configInst);
    })
}
