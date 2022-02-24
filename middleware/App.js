const express = require('express'),
      morgan = require('morgan'),
      cors = require('cors');

module.exports = app =>{
    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: true}))
}