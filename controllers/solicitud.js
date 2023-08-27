const { request, response } = require('express');

const insertarSolicitud = async (req = request, res = response ) => {
    console.log( req.body );
    res.json({msg: 'ok'});
    // TODO
    
    res.end();
}

module.exports = {
    insertarSolicitud
}