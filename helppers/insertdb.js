const sqlite3 = require('sqlite3').verbose();

const insertdb = (solicitud) =>{
    const dbName = `./dbCert/inscripciones.db3`;
    const db = new sqlite3.Database(dbName);
    const { parroquia, nivel, apellidos, nombre, bautizo, fechaNacimiento, colegio, curso, profesor, 
            apellidosPadre, nombrePadre, telefonoPadre, dniPadre, apellidosMadre, nombreMadre, telefonoMadre, dniMadre, 
            direccion, codpost, email, alergias, comentarios, imagenDigital, imagenImpresa, comunicaciones, datosSalud, uuid } = solicitud;
    
    const direc = direccion.replace('\'', '^');
    const coment = comentarios.replace('\'', '^');
    const prof = profesor.replace('\'', '^');
    const apePad = apellidosPadre.replace('\'', '^');
    const nomPad = nombrePadre.replace('\'', '^');
    const apeMad = apellidosMadre.replace('\'', '^');
    const nomMad = nombreMadre.replace('\'', '^');
    const ape = apellidos.replace('\'', '^');
    const nom = nombre.replace('\'', '^');
    const cole = colegio.replace('\'', '^');
    const bau = bautizo.replace('\'', '^');


    const qry = `INSERT INTO inscripciones(parroquia, nivel, apellidosn, nombren, bautizo, nacimiento, 
                    colegio, curso, profesor, apellidosp, nombrep, telefonop, dnip, 
                    apellidosm, nombrem, telefonom, dnim, direccion, codpost, email, 
                    alergias, comentarios, protdatos1, protdatos2, protdatos3, protdatos4 )       
                    VALUES('${parroquia}','${nivel}', '${ape}', '${nom}', '${bau}', '${fechaNacimiento}', '${cole}',
                    '${curso}', '${prof}', '${apePad}', '${nomPad}', '${telefonoPadre}', '${dniPadre}', 
                    '${apeMad}', '${nomMad}', '${telefonoMadre}', '${dniMadre}', 
                    '${direc}', '${codpost}', '${email}', '${alergias}', '${coment}', 
                    '${imagenDigital}', '${imagenImpresa}', '${comunicaciones}', '${datosSalud}')`;
console.log( qry );
    db.run(qry);
    db.close();
}

module.exports = {
    insertdb
}
