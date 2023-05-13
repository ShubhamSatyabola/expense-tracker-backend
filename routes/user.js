const express = require('express');

const userController = require('../controllers/user');


const router = express.Router();

//router.get('/sign-up', userController.getSignUp);

router.post('/sign-up', userController.postSignUp);

router.post('/log-in', userController.postLogIn);



module.exports = router;