const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');
const userAunthenticate = require('../middleware/auth')

const router = express.Router();

router.get('/get-expense', userAunthenticate.authenticate, expenseController.getExpense)

router.post('/post-expense', userAunthenticate.authenticate, expenseController.postExpense)

router.delete('/delete-expense/:expenseId', userAunthenticate.authenticate, expenseController.deleteExpense)

router.get('/download-report', userAunthenticate.authenticate, expenseController.downloadReport)


module.exports = router;