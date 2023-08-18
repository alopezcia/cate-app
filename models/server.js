const express = require('express');
const cors = require('cors');
const helmet  = require('helmet');
const compression = require('compression');

// const fileUpload = require('express-fileupload');

// const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.HTTP_PORT;

        this.paths = {
            cert:       '/api/get-cert',
            qr:         '/api/get-QRCert',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        // await dbConnection();
    }


    middlewares() {

        this.app.use( helmet({contentSecurityPolicy: false} ));
        this.app.use(compression());

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        // this.app.use( fileUpload({
        //     useTempFiles : true,
        //     tempFileDir : '/tmp/',
        //     createParentPath: true
        // }));

    }

    

    routes() {
        this.app.use( this.paths.cert, ( req, res = response ) =>{
            const port = process.env.API_HTTPS_PORT;
            const urlRedirect = `https://${req.headers.host}:${port}${req.url}`;
            // console.log( urlRedirect )
            res.redirect( urlRedirect );
        });
        
        // this.app.use( this.paths.cert, require('../routes/redirecter'));
        // this.app.use( this.paths.qr, require('../routes/redirecter'));

        this.app.use( this.paths.qr, ( req, res = response ) =>{
            const port = process.env.API_HTTPS_PORT;
            const urlRedirect = `https://${req.headers.host}:${port}${req.url}`;
            // console.log( urlRedirect )
            res.redirect( urlRedirect );
        });


        // this.app.use( this.paths.categorias, require('../routes/categorias'));
        // this.app.use( this.paths.productos, require('../routes/productos'));
        // this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        // this.app.use( this.paths.uploads, require('../routes/uploads'));
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
