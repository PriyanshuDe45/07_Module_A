const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/calendar');

//Schema
const Schedule = mongoose.model('Schedule', new mongoose.Schema({
    title: String,
    date: String, 
    
}))