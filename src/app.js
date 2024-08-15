const express = require("express");
const { searchAndFetchRow } = require('./controllers/spreadsheets');
const googleRoutes = require('./routes/google.routes');

require('./controllers/spreadsheets');

const app = express();


//routes 
/* app.use(require("./routes/google.routes")); */

app.use('/sheets', googleRoutes )





module.exports = app;