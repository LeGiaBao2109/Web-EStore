const session = require('express-session');
const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const database = require('./src/config/database');
const userMiddleware = require('./src/middlewares/client/user.middleware');

const clientRoutes = require('./src/routes/client/index.route');
const adminRoutes = require('./src/routes/admin/index.route');
const clientApi = require('./src/api/client/index.api');
const adminApi = require('./src/api/admin/index.api');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database.connect();

app.use(session({
    secret: 'ESTORE_SECRET_KEY',
    resave: false,
    saveUninitialized: true
}));

app.use(userMiddleware.infoUser);

app.use(express.static(path.join(__dirname, 'src/public')));

app.use("/", clientRoutes);
app.use("/admin", adminRoutes);
app.use("/api/admin", adminApi);
app.use("/api", clientApi);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})