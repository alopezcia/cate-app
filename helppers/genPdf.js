const PDFDocument = require('pdfkit');
const fs = require('fs');

const genPdf = (solicitud) =>{
    // Create a document
    const doc = new PDFDocument({
        size: 'A4', 
        margins: {
            top: 20,
            bottom: 2,
            left: 20,
            right: 40
            }});

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream(`./output/solicitud_${solicitud.uuid}.pdf` ));

// Medidas del A4
// doc.polygon([2, 2], [593, 2], [593, 840], [2, 840]);
// doc.stroke();

// Embed a font, set the font size, and render some text
// doc
//   .font('Helvetica-Bold')
//   .fontSize(14)
//   .text('FICHA DE INSCRIPCIÓN CATEQUESIS DE LA COMUNIDAD 2022/2023', {
//     align: 'center'
//    });

// // Add an image, constrain it to a given size, and center it vertically and horizontally
// doc.image('public/iglesia_parroquial_sant_vicent_ferrer.png', 10, 35, {
//   fit: [5, 37],
//   align: 'center',
//   valign: 'center'
//});

    doc.image('public/hoja.png', 0, 0, {
        fit: [595, 841],
        align: 'center',
        valign: 'center'
    });

    // Parroquia
    doc
    .font('Helvetica')
    .fontSize(10)
    .text(solicitud.parroquia, 179, 45 );

    // Nivel
    doc.text(solicitud.nivel, 179, 70);

    // Apellidos niñ@
    doc.text(solicitud.apellidos, 110, 90);

    // Nombre  niñ@
    doc.text(solicitud.nombre, 435, 90);

    // parroquia bautizo
    doc.text(solicitud.bautizo, 143, 116);

    // fecha nacimiento
    doc.text(solicitud.fechaNacimiento, 488, 116);

    // colegio actual
    doc.text(solicitud.colegio, 90, 140);

    // curso escolar
    doc.text(solicitud.curso, 384, 140);

    // nombre del profesor de religión
    doc.text(solicitud.profesor, 144, 166);

    // apellidos padre
    doc.text(solicitud.apellidosPadre, 110, 190);

    // nombre padre
    doc.text(solicitud.nombrePadre, 430, 190);

    // telefono padre 
    doc.text(solicitud.telefonoPadre, 144, 216);

    // dni padre 
    doc.text(solicitud.dniPadre, 395, 216);

    // apellidos madre 
    doc.text(solicitud.apellidosMadre, 115, 242);

    // nombre madre
    doc.text(solicitud.nombreMadre, 430, 242);

    // telefono madre 
    doc.text(solicitud.telefonoMadre, 144, 268);

    // dni madre 
    doc.text(solicitud.dniMadre, 395, 268);

    // dirección
    doc.text(solicitud.direccion, 76, 294);

    // codigo postal 
    doc.text(solicitud.codpost, 488, 294);

    // email
    doc.text(solicitud.email, 76, 318);

    // alergias
    doc.text(solicitud.alergias, 28, 352);

    // comentiarios
    doc.text(solicitud.comentarios, 28, 410);

    // si , imagen  
    if(solicitud.imagenDigital === 'on' )
        doc.text('X', 469, 471);
    else
        // no , imagen  
        doc.text('X', 520, 471);

    // si , imagen  
    if(solicitud.imagenImpresa === 'on' )
        doc.text('X', 469, 496);
    else
        // no , imagen  
        doc.text('X', 520, 496);

    // si , comunicaciones
    if(solicitud.comunicaciones === 'on' )
        doc.text('X', 469, 520);
    else
        // no , comunicaciones  
        doc.text('X', 520, 520);

    // si , datosSalud
    if( solicitud.datosSalud === 'on' )
        doc.text('X', 469, 548);
    else
        // no , imagen  
        doc.text('X', 520, 548);

    // ACEPTO  
    doc.text('X', 44, 600);


    // Firma Padre  
    if( solicitud.firmadoPadre.length > 0  ){
        doc.image( solicitud.firmadoPadre, 44, 750, {width: 100, height: 50} );
        doc.text(`${solicitud.apellidosPadre}, ${solicitud.nombrePadre}`, 63, 820);
    }

    // Firma Madre  
    if( solicitud.firmadoMadre.length > 0 ){
        doc.image(solicitud.firmadoMadre, 358, 750, {width: 100, height: 50} );
        doc.text(`${solicitud.apellidosMadre}, ${solicitud.nombreMadre}`, 373, 820);
    }


    // Finalize PDF file
    doc.end();
}

module.exports = {
    genPdf
}
