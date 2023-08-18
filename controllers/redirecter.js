const { response } = require('express');

const redirecter = async( req, res = response ) =>{
    const port = process.env.API_HTTPS_PORT;
    const urlRedirect = `https://${req.headers.host}:${port}${req.url}`;
    // console.log( urlRedirect )
    res.redirect( urlRedirect );
}

module.exports = {
    redirecter,
}