const { Router } = require('express');
const { redirecter } = require('../controllers');

const router = Router();

router.get( '/', redirecter );

module.exports = router;