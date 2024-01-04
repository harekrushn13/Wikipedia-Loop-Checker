const express = require('express');
const router = express.Router();

const wikipediaController = require('../controllers/wikipediaController');

router.post('/', wikipediaController.checkloop);

module.exports = router;