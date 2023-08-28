const { Router } = require('express');
const { check } = require('express-validator');
const { insertarSolicitud } = require('../controllers/solicitud');

const router = Router();

router.post( '/', [
    check( 'email', 'El correo no es válido').isEmail(),
    check('fechaNacimiento', 'La fecha de nacimiento no es correcta').isDate(),
],
insertarSolicitud );
/* 
{
  parroquia: 'San Vicente Ferrer',
  nivel: 'Despertar Religioso: 2º PRIMARIA',
  apellidos: 'apellidos el niño',
  nombre: 'nombre del niño',
  bautizo: 'San Vicente Ferrer',
  fechaNacimiento: '23/12/1999',
  colegio: 'asdsad',
  curso: '4º PRIMARIA',
  apellidosPadre: '23232323',
  nombrePadre: '232323',
  dniPadre: '23232e',
  telefonoPadre: 'wswswsws',
  apellidosMadre: 'swwsws',
  nombreMadre: 'wswswsws',
  dniMadre: 'swswswsws',
  telefonMadre: 'wswswswsw',
  direccion: 'dsldksdslkd wldkw',
  codpost: 'ewe3ewew',
  email: '',
  alergias: '',
  comentarios: '',
  imagenDigital: 'on',
  imagenImpresa: 'on',
  comunicaciones: 'on',
  datosSalud: 'on',
  aceptaTrat: 'on'
}*/
module.exports = router;