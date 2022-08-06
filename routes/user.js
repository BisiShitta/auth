const express = require('express');
const router  = express.Router();
const { check } = require('express-validator');
const user = require("../controllers/users");
const auth = require('../middlewares/auth');


router.post('/login', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Input password').exists(),
], user.auth.login);

router.post('/register', user.auth.signup);

router.post('/admin-signup', user.auth.adminSignup);

router.post('/logout', auth, user.auth.logout);

router.get('/logs', auth, user.auth.loggedIn);

module.exports = router;