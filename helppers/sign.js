const fs = require('fs');
const path= require('path');
const plainAddPlaceholder = require('@signpdf/placeholder-plain').plainAddPlaceholder;
const signpdf = require('@signpdf/signpdf').default;
const P12Signer = require('@signpdf/signer-p12').P12Signer;

const sign = (uuid, certificatePath ) => {
    const pdfFile = `./output/solicitud_${uuid}.pdf`;
    const pdfBuffer = fs.readFileSync(pdfFile);
    const certificateBuffer = fs.readFileSync(certificatePath);


    // const signer = new P12Signer(certificateBuffer, { pass: 'Aguas123'} );
    const signer = new P12Signer(certificateBuffer);

    // The PDF needs to have a placeholder for a signature to be signed.
    const pdfWithPlaceholder = plainAddPlaceholder({
        pdfBuffer: pdfBuffer,
        reason: 'Parroquias de San Vicente',
        contactInfo: 'inscripcionsanviceneferrer@gmail.com',
        name: 'Padre Miguel Angel',
        location: 'San Vicente del Raspeig, Alicante',
    });

    // pdfWithPlaceholder is now a modified buffer that is ready to be signed.
    signpdf
        .sign(pdfWithPlaceholder, signer)
        .then(function (signedPdf) {
            // signedPdf is a Buffer of an electronically signed PDF. Store it.
            const targetPath = `./pdfSigneds/solicitud_${uuid}.pdf`; 
            fs.writeFileSync(targetPath, signedPdf);
        })
}

module.exports = {
    sign
}
