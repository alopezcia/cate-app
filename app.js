const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const admzip = require('adm-zip');
require('dotenv').config();
const Server = require('./models/server');

const initializeSQLite = () =>{
    const dbName = `./dbCert/inscripciones.db3`;
    
    if( !fs.existsSync(dbName)){
        fs.open( dbName, 'w', (err, file ) =>{
//            if (err) throw err;
            console.log(`File ${dbName} is opened in write mode.`);
            const db = new sqlite3.Database(dbName);
            const createTable = 
                'CREATE TABLE IF NOT EXISTS inscripciones('+
                    'id  INTEGER PRIMARY KEY AUTOINCREMENT,'
//                    'uuid varchar(36) PRIMARY KEY, '+
                    'registro DATETIME DEFAULT CURRENT_TIMESTAMP, '+
                    'parroquia text NOT NULL, '+
                    'nivel text NOT NULL, '+
                    'apellidosn text NOT NULL, '+
                    'nombren text NOT NULL, '+
                    'bautizo text NOT NULL, '+
                    'nacimiento DATETIME NOT NULL, '+
                    'colegio text NOT NULL, '+
                    'curso text NOT NULL, '+
                    'profesor text NOT NULL, '+
                    'apellidosp text, '+
                    'nombrep text, '+
                    'telefonop text, '+
                    'dnip text, '+
                    'apellidosm text, '+
                    'nombrem text, '+
                    'telefonom text, '+
                    'dnim text, '+
                    'direccion text NOT NULL, '+
                    'codpost text NOT NULL, '+
                    'email text NOT NULL, '+
                    'alergias text, '+
                    'comentarios text, '+
                    'protdatos1 char(3), '+
                    'protdatos2 char(3), '+
                    'protdatos3 char(3), '+
                    'protdatos4 char(3))';
            db.run(createTable);
            db.close();
console.log( createTable );
        });
    }
    return dbName;
}

const server = new Server(initializeSQLite());

server.listen();

