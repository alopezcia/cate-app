const { request, response } = require('express');
const { genPdf } = require('../helppers/genPdf');

const insertarSolicitud = async (req = request, res = response ) => {
    const solicitud = req.body;
    genPdf( solicitud, process.env.P12_PATH );
    res.json({msg: 'ok'});
    res.end();
}

module.exports = {
    insertarSolicitud
}