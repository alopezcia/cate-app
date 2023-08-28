const { request, response } = require('express');
const { validationResult }  = require('express-validator');

const insertarSolicitud = async (req = request, res = response ) => {
    
    const errors  = validationResult( req );
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    res.json({msg: 'ok'});
    // TODO
    
    res.end();
}

module.exports = {
    insertarSolicitud
}