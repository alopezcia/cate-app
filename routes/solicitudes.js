const { Router } = require('express');
const { insertarSolicitud } = require('../controllers/solicitud');

const router = Router();

router.post( '/', insertarSolicitud );

module.exports = router;