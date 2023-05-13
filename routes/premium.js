const express = require('express');

const userAunthenticate = require('../middleware/auth');
const premiumController = require('../controllers/premium')

const router = express.Router()

router.get('/leaderboard', userAunthenticate.authenticate, premiumController.getPremium)




module.exports = router;