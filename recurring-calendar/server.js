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
    isRecurring: Boolean,
    type: String,
    cycle: Number,
    endDate: Date
}));

//Recurrence
function getOccurences(s,year,month){
    const results = [];
    const start = new Date(s.taskDate);
    const mStart = new Date(year, month,1 );
    const mEnd = new  Date(year, month +1,0);

    if(!s.isRecurring){
        if(is)
    }
}