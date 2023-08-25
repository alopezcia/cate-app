// Archivo de barril para unificar exportaciones
const Certificado = require('./certificado');
const Qr = require( './qr' );
const Server = require('./server');
const Solicitud = require('./solicitud');

module.exports = {
    Certificado,
    Qr,
    Server, 
    Solicitud,
}