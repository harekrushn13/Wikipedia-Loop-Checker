const express = require('express');
const router = express.Router();

const wikipediaController = require('../controllers/wikipediaController');

// Define a route for handling POST requests to the '/'
router.post('/', wikipediaController.checkloop);

module.exports = router;