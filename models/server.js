const express = require('express');
const cors = require('cors');
const helmet  = require('helmet');
const compression = require('compression');
const http   = require('http');
const https   = require('https');
const fs = require('fs');
const upload = require('../middlewares/upload');

// const { dbConnection } = require('../database/config');
const httpsServerOptions = {
    key:  fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH)
};

class Server {

    constructor( dbName ) {
        this.dbName = dbName;
        this.app  = express();
        this.port = process.env.HTTP_PORT;
        this.httpsPort = process.env.HTTPS_PORT;
        
        this.serverHttp = http.createServer(this.app);
        this.serverHttps = https.createServer(httpsServerOptions, this.app);

        this.paths = {
            cert:       '/api/get-cert',
            qr:         '/api/get-QRCert',
            solicitud:  '/api/post-solicitud',
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
        
        this.app.use( (req, res, next ) => {
            if( req.secure || process.env.NODE_ENV === 'development') 
                next();
            else {
                res.redirect(`https://${req.headers.host}${req.url}`);
            } 
        });

        // Directorio Público
        this.app.use( express.static('public') );

    }
    

    routes() {
        this.app.use( this.paths.cert, require('../routes/redirecter'));
        this.app.use( this.paths.qr, require('../routes/redirecter'))
        this.app.use( this.paths.solicitud, require('../routes/solicitudes') ); 
        this.app.get( '/api/getPdf/:uuid', 
            ( req = express.request, res = express.response)=>{
                const uuid = req.params.uuid;

                const pdf = `./pdfSigneds/solicitud_${uuid}.pdf`;
                if( fs.existsSync(pdf)){
                    res.download(pdf, (err)=>{
                        res.status(404).send(err);
                    }); 
                } else 
                    res.status(404).send(`Error 404 - ${pdf} no encontrado`); });
        this.app.post('/upload', upload.single('file'), (req, res) => {
            const name = req.body["name"];
            const file = req["file"];
            const ext = file.mimetype.substring( 6 );
            const newName = 'uploads/' + `${name}.${ext}`;
            fs.rename(file.path, newName, (err) => { if( err) console.error(err) } );
            // TODO - renombrar el fichero 
            res.json({ message: 'File uploaded successfully!' });
        });
                
    }

    listen() {
        this.serverHttps.listen( this.httpsPort, process.env.IP  );
        this.serverHttp.listen( this.port, process.env.IP );
        console.log(`Servidor corriendo en puertos ${this.port}, ${this.httpsPort} registrando en ${this.dbName}` );
    }
}

module.exports = Server;
