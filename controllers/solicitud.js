
const { request, response } = require('express');
const fs = require('fs');
const { genPdf } = require('../helppers/genPdf');
const { sign } = require('../helppers/sign');

const insertarSolicitud = async (req = request, res = response ) => {
    const solicitud = req.body;
    genPdf( solicitud );
    res.json({msg: 'ok'});
    res.end();
    setTimeout( function() { 
        const pdf = `./output/solicitud_${solicitud.uuid}.pdf`;
        if( fs.existsSync(pdf)){
            sign(solicitud.uuid, process.env.P12_PATH);
        }       
    }, 1000 );
}

module.exports = {
    insertarSolicitud
}