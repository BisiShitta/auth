const mongoose = require('mongoose');
require('dotenv').config();

const database = process.env.MONGO
// db
mongoose
    .connect(database, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log(`Db connected to ${database}`));
