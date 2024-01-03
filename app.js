const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const admzip = require('adm-zip');
require('dotenv').config();
const Server = require('./models/server');

const initializeSQLite = () =>{
    const fecha = new Date().toJSON().slice(0,10).replaceAll('-', '').replaceAll('/','');
    const dbName = `./dbCert/${fecha}_cert.db3`;
    const allDbZip = './dbCert/allDbCertZip.zip';
    
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
        // console.log(`Creado fichero comprimido ${allDbZip}`);    
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
    return dbName;
}

const server = new Server(initializeSQLite());

server.listen();

