const { request, response } = require('express');
const { genPdf } = require('../helppers/genPdf');

const insertarSolicitud = async (req = request, res = response ) => {
    const solicitud = req.body;
    console.log(solicitud);
    genPdf( solicitud );
    res.download('./output.pdf', (err) => {
        res.status(404).send(err);
    });
    // res.json({msg: 'ok'});
    // res.end();
}

module.exports = {
    insertarSolicitud
}