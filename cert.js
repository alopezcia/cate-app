const express = require('express');
const https   = require('https');
const helmet  = require('helmet');
var compression = require('compression');
const cors = require('cors');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const admzip = require('adm-zip');
const qr = require("qrcode");

const fecha = new Date().toJSON().slice(0,10).replaceAll('-', '').replaceAll('/','');
const dbName = `./dbCert/${fecha}_cert.db3`;
const allDbZip = './dbCert/allDbCertZip.zip';


const httpsServerOptions = {
    key:  fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    requestCert: true,
    rejectUnauthorized: true
};

// Borrar el zip de todas las db para volver a crearlo
if( fs.existsSync(allDbZip) ){ 
    try{
        fs.unlinkSync(allDbZip);
    }catch( err ){
        console.log(err);
    }
}
// Crear el zip de todas las db3 
try {
    const zip = new admzip();
    zip.addLocalFolder('./dbCert');
    zip.writeZip( allDbZip )
    console.log(`Creado fichero comprimido ${allDbZip}`);    
} catch( err ){
    console.log(err);
}

if( !fs.existsSync(dbName)){
    fs.open( dbName, 'w', (err, file ) =>{
        if (err) throw err;
        console.log(`File ${dbName} is opened in write mode.`);
        const db = new sqlite3.Database(dbName);
        const createTable = 
            'CREATE TABLE IF NOT EXISTS certs('+
                'uuid varchar(36) PRIMARY KEY, '+
                'cert text NOT NULL, '+
                'registro DATETIME DEFAULT CURRENT_TIMESTAMP)';
        db.run(createTable);
        db.close();
    });
}

const app = express();

app.use( helmet({contentSecurityPolicy: false} ));
// app.use( helmet());
app.use(compression());
app.use(cors());

// Middleware to check user certificate
const checkCertificate = (req, res, next) => {
    if (req.client.authorized) {
        // Certificate is valid
        next();
      } else {
        // Certificate is invalid or not provided
        res.status(403).send('Access forbidden. Invalid or missing certificate.');
      }  
};
// Use the middleware to check certificate on every request
app.use(checkCertificate);

const serverHttps = https.createServer(httpsServerOptions, app);

serverHttps.listen( process.env.API_HTTPS_PORT, process.env.IP );

// app.use( (req, res, next ) => {
//     if( req.client.authorized ) 
//         next();
//     else {
//         res.status(401).send('Unauthorized');
//     }
// });


app.get('/api/get-cert', async (req, res) => { 
    const cert = req.socket.getPeerCertificate(true);
    const b64  = cert.raw.toString('base64');
    // const db = new sqlite3.Database(dbName);
    // const qry = `INSERT INTO certs(cert) VALUES('${b64}')`;
    // db.run(qry);
    // db.close();
    res.send( `Hola ${cert.subject.CN}, tu certificado te fue concedido por ${cert.issuer.CN}!` );
});

app.get('/api/get-QRCert/:uuid', async (req, res) => { 
    const uuid = req.params.uuid;
    const cert = req.socket.getPeerCertificate(true);
    const {subject, issuer, valid_to, serialNumber } = cert;
    const toQR = { subject, issuer, valid_to, serialNumber };
    const b64  = cert.raw.toString('base64');
    const db = new sqlite3.Database(dbName);
    const qry = `INSERT INTO certs(uuid, cert) VALUES('${uuid}','${b64}')`;
    db.run(qry);
    db.close();
    qr.toDataURL(JSON.stringify(toQR), (err, src) => {
        if (err) res.send("Error occured");
      
        // Let us return the QR code image as our response and set it to be the source used in the webpage
        res.send( src );
    });
});


app.get('/api/downloadDb', (req, res) => { 
    console.log(`Solicitada descarga del fichero ${dbName}`);
    if( fs.existsSync(dbName)){
        res.download(dbName, (err)=>{
            res.status(404).send(err);
        });
    } else 
        res.status(404).send(`Error 404 - ${dbName} no encontrado`);
});

app.get('/api/downloadAll', (req, res) => { 
    console.log(`Solicitada descarga del fichero ${allDbZip}`);
    if( fs.existsSync(allDbZip)){
        res.download(allDbZip, (err)=>{
            res.status(404).send(err);
        });
    } else 
        res.status(404).send(`Error 404 - ${allDbZip} no encontrado`);
});


app.get('*', (req, res) => { 
    res.status(404).send('Error 404 - Recurso no encontrado');
});

console.log(`Servidor arrancado en puerto ${process.env.API_HTTPS_PORT}` );
