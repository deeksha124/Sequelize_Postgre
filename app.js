const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const userRoutes = require('./routes/userRoutes');

global.basedir = __dirname +"/" ;


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/users', userRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => console.log(error));
