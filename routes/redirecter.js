const { Router } = require('express');
const { redirecter } = require('../controllers/redirecter');

const router = Router();

router.get( '/', redirecter );

module.exports = router;