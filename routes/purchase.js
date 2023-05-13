const express = require('express')

const userAunthenticate = require('../middleware/auth');
const purchaseController = require('../controllers/purchase');

const router = express.Router();

router.get('/premium-membership',userAunthenticate.authenticate, purchaseController.purchasePremium)

router.post('/update-transaction-status', userAunthenticate.authenticate, purchaseController.updateTransactionStatus )

module.exports = router;