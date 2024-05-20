const sqlite3 = require('sqlite3').verbose();

const insertdb = (solicitud) =>{
    const dbName = `./dbCert/inscripciones.db3`;
    const db = new sqlite3.Database(dbName);
    const { parroquia, nivel, apellidos, nombre, bautizo, fechaNacimiento, colegio, curso, profesor, 
            apellidosPadre, nombrePadre, telefonoPadre, dniPadre, apellidosMadre, nombreMadre, telefonoMadre, dniMadre, 
            direccion, codpost, email, alergias, comentarios, imagenDigital, imagenImpresa, comunicaciones, datosSalud, uuid } = solicitud;
            
    const qry = `INSERT INTO inscripciones(parroquia, nivel, apellidosn, nombren, bautizo, nacimiento, 
                    colegio, curso, profesor, apellidosp, nombrep, telefonop, dnip, 
                    apellidosm, nombrem, telefonom, dnim, direccion, codpost, email, 
                    alergias, comentarios, protdatos1, protdatos2, protdatos3, protdatos4 )       
                    VALUES('${parroquia}','${nivel}', '${apellidos}', '${nombre}', '${bautizo}', '${fechaNacimiento}', '${colegio}',
                    '${curso}', '${profesor}', '${apellidosPadre}', '${nombrePadre}', '${telefonoPadre}', '${dniPadre}', 
                    '${apellidosMadre}', '${nombreMadre}', '${telefonoMadre}', '${dniMadre}', 
                    '${direccion}', '${codpost}', '${email}', '${alergias}', '${comentarios}', 
                    '${imagenDigital}', '${imagenImpresa}', '${comunicaciones}', '${datosSalud}')`;
    
    db.run(qry);
    db.close();
}

module.exports = {
    insertdb
}
