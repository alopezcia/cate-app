const { request, response } = require('express');

const insertarSolicitud = async (req = request, res = response ) => {
    res.send('SOLICITUD');
    // TODO
    res.end();
}

module.exports = {
    insertarSolicitud
}