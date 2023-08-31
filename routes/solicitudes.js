const { Router } = require('express');
const { check } = require('express-validator');
const { insertarSolicitud } = require('../controllers/solicitud');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { esFecha } = require('../helppers/esFecha');

const router = Router();

router.post( '/', [
    check( 'email', 'El correo no es válido').isEmail(),
    check('fechaNacimiento', 'La fecha de nacimiento no es correcta').custom( esFecha ),
    fieldsValidator
],
insertarSolicitud );

module.exports = router;