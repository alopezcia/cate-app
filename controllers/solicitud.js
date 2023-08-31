const { request, response } = require('express');
const { genPdf } = require('../helppers/genPdf');

const insertarSolicitud = async (req = request, res = response ) => {
    const solicitud = req.body;
    genPdf( solicitud );
    res.json({msg: 'ok'});
    res.end();
}

module.exports = {
    insertarSolicitud
}