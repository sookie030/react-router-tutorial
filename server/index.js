// express
const express = require('express');
const app = express();

// router
const router = require('./router')(app);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));