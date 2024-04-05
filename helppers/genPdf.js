const PDFDocument = require('pdfkit');
const fs = require('fs');
const signpdf = require('@signpdf/signpdf').default;
const signer = require('@signpdf/signer-p12').P12Signer;
const path = require('path');
const pdfkitAddPlaceholder = require('@signpdf/placeholder-pdfkit').pdfkitAddPlaceholder;

const genPdf = (solicitud, keystore) =>{
    // Start a PDFKit document
    const pdf = new PDFDocument({
        autoFirstPage: false,
        size: 'A4',
        layout: 'portrait',
        bufferPages: true,
        margins: {
            top: 20,
            bottom: 2,
            left: 20,
            right: 40
            }        
    });
    pdf.info.CreationDate = '';

    // At the end we want to convert the PDFKit to a string/Buffer and store it in a file.
    // Here is how this is going to happen:
    const pdfReady = new Promise(function (resolve) {
        // Collect the ouput PDF
        // and, when done, resolve with it stored in a Buffer
        const pdfChunks = [];
        pdf.on('data', function (data) {
            pdfChunks.push(data);
        });
        pdf.on('end', function () {
            resolve(Buffer.concat(pdfChunks));
        });
    });

    pdf.image('public/hoja.png', 0, 0, {
        fit: [595, 841],
        align: 'center',
        valign: 'center'
    });

    // Parroquia
    pdf
    .font('Helvetica')
    .fontSize(10)
    .text(solicitud.parroquia, 179, 45 );

    // Nivel
    pdf.text(solicitud.nivel, 179, 70);

    // Apellidos niñ@
    pdf.text(solicitud.apellidos, 110, 90);

    // Nombre  niñ@
    pdf.text(solicitud.nombre, 435, 90);

    // parroquia bautizo
    pdf.text(solicitud.bautizo, 143, 116);

    // fecha nacimiento
    pdf.text(solicitud.fechaNacimiento, 488, 116);

    // colegio actual
    pdf.text(solicitud.colegio, 90, 140);

    // curso escolar
    pdf.text(solicitud.curso, 384, 140);

    // nombre del profesor de religión
    pdf.text(solicitud.profesor, 144, 166);

    // apellidos padre
    pdf.text(solicitud.apellidosPadre, 110, 190);

    // nombre padre
    pdf.text(solicitud.nombrePadre, 430, 190);

    // telefono padre 
    pdf.text(solicitud.telefonoPadre, 144, 216);

    // dni padre 
    pdf.text(solicitud.dniPadre, 395, 216);

    // apellidos madre 
    pdf.text(solicitud.apellidosMadre, 115, 242);

    // nombre madre
    pdf.text(solicitud.nombreMadre, 430, 242);

    // telefono madre 
    pdf.text(solicitud.telefonoMadre, 144, 268);

    // dni madre 
    pdf.text(solicitud.dniMadre, 395, 268);

    // dirección
    pdf.text(solicitud.direccion, 76, 294);

    // codigo postal 
    pdf.text(solicitud.codpost, 488, 294);

    // email
    pdf.text(solicitud.email, 76, 318);

    // alergias
    pdf.text(solicitud.alergias, 28, 352);

    // comentiarios
    pdf.text(solicitud.comentarios, 28, 410);

    // si , imagen  
    if(solicitud.imagenDigital === 'on' )
        pdf.text('X', 469, 471);
    else
        // no , imagen  
        pdf.text('X', 520, 471);

    // si , imagen  
    if(solicitud.imagenImpresa === 'on' )
        pdf.text('X', 469, 496);
    else
        // no , imagen  
        pdf.text('X', 520, 496);

    // si , comunicaciones
    if(solicitud.comunicaciones === 'on' )
        pdf.text('X', 469, 520);
    else
        // no , comunicaciones  
        pdf.text('X', 520, 520);

    // si , datosSalud
    if( solicitud.datosSalud === 'on' )
        doc.text('X', 469, 548);
    else
        // no , imagen  
        pdf.text('X', 520, 548);

    // ACEPTO  
        pdf.text('X', 44, 600);


    // Firma Padre  
    if( solicitud.firmadoPadre.length > 0  ){
        pdf.image( solicitud.firmadoPadre, 44, 750, {width: 100, height: 50} );
        pdf.text(`${solicitud.apellidosPadre}, ${solicitud.nombrePadre}`, 63, 820);
    }

    // Firma Madre  
    if( solicitud.firmadoMadre.length > 0 ){
        pdf.image(solicitud.firmadoMadre, 358, 750, {width: 100, height: 50} );
        pdf.text(`${solicitud.apellidosMadre}, ${solicitud.nombreMadre}`, 373, 820);
    }


    pdf.save();

    // Here comes the signing. We need to add the placeholder so that we can later sign.
    const refs = pdfkitAddPlaceholder({
        pdf: pdf,
        pdfBuffer: Buffer.from([pdf]), // FIXME: This shouldn't be needed.
        reason: 'Showing off.',
        contactInfo: 'signpdf@example.com',
        name: 'Sign PDF',
        location: 'The digital world.',
    });
    // `refs` here contains PDFReference objects to signature, form and widget.
    // PDFKit doesn't know much about them, so it won't .end() them. We need to do that for it.
    Object.keys(refs).forEach(function (key) {
        refs[key].end()
    });

    // Once we .end the PDFDocument, the `pdfReady` Promise will resolve with
    // the Buffer of a PDF that has a placeholder for signature that we need.
    // Other that we will also need a certificate
    // certificate.p12 is the certificate that is going to be used to sign
    const certificatePath = path.join(__dirname, keystore );
    const certificateBuffer = fs.readFileSync(certificatePath);
    const signer = new P12Signer(certificateBuffer);
    
    // Once the PDF is ready we need to sign it and eventually store it on disc.
    pdfReady
        .then(function (pdfWithPlaceholder) {
            return signpdf.sign(pdfWithPlaceholder, signer, 'Aguas123');
        })
        .then(function (signedPdf) {
            var targetPath = path.join(__dirname, `./output/${solicitud}.pdf`);
            fs.writeFileSync(targetPath, signedPdf);
        });

    // Finally end the PDFDocument stream.
    pdf.end();
    // This has just triggered the `pdfReady` Promise to be resolved.
}

module.exports = {
    genPdf
}
