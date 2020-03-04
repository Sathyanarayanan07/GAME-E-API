// Import External Modules
const express = require('express');
const app = express();
// Import Internal Modules
const userRoute = require('./user-route/user-route');

// Middlewares
app.use(express.json());

// Routes
app.use('/app/user', userRoute);

// Server start
app.listen(3000, () => console.log('Server ready'));
