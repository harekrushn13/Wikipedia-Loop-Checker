const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const wikipediaRoute = require('./routes/wikipediaRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// Use the 'wikipediaRoute' for requests to the '/checkloop'
app.use('/checkloop', wikipediaRoute);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});