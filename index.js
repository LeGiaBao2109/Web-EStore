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

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Database
database.connect();

app.use(session({
    secret: 'ESTORE_SECRET_KEY',
    resave: false,
    saveUninitialized: true
}));

// Sử dụng middleware ngay sau session
app.use(userMiddleware.infoUser);

// Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, 'src/public')));

// Thiết lập đường dẫn
app.use("/", clientRoutes);
app.use("/admin", adminRoutes);
app.use("/api", clientApi);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})