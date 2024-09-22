const mongoose = require('mongoose');
const debug = require('debug')('development:mongoose'); 
const config = require('config');
require('dotenv').config();  // Load environment variables, if needed

// Get MongoDB URL from config
const mongodbUrl = config.get('MONGODB_URL');
console.log("MongoDB URL from config:", mongodbUrl);  // Debug log

const connect = mongoose.connect(`${mongodbUrl}/filo`, {
   
})
.then(() => {
    
    console.log('Connected to MongoDB');
})
.catch(err => {
    
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose.connection;
