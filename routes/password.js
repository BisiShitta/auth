const express = require('express');
const router  = express.Router();
const password = require("../controllers/password");
const auth = require('../middlewares/auth');

router.post('/reset-password', auth, password.reset);
router.get('/forgot-password', password.sendMail);
router.get('/change-password', password.getPassword);
router.post('/change-password', password.updatePassword);


module.exports = router;