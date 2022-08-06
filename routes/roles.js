const express = require('express');
const router  = express.Router();
const roles = require("../controllers/roles");
const auth = require('../middlewares/auth');


router.get('/staff', auth, roles.staff);
router.get('/manager', auth, roles.manager);
router.get('/user', auth, roles.user);
router.post('/assign', auth, roles.assign);
router.get('/find-user', auth, roles.specificUser);

module.exports = router;