// Import External Modules
const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
// Import Internal Modules
const userRoute = require('./user-route/user-route');
const gameRoute = require('./game-route/game-route');

// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use('/app/user', userRoute);
app.use('/app/game', gameRoute);

// Server start
app.listen(3000, () => console.log('Server ready'));
