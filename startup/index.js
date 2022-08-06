require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const passwordRoute = require("../routes/password");
const userRoute = require("../routes/user");
const rolesRoute = require("../routes/roles");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api',passwordRoute);
app.use('/api',userRoute);
app.use('/api',rolesRoute);




const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

