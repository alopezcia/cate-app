require('dotenv').config();
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.HOST_SMTP,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.USER_SMTP,
    pass: process.env.PASS_SMTP,
  },
  debug: true
});

const isFile = fileName => {
  return fs.lstatSync(fileName).isFile();
};

const solFolder = path.join(__dirname, '/output/');
const upFolder = path.join(__dirname, '/uploads/');

const solicitudes = fs.readdirSync(solFolder)
  .map(fileName => {
    return path.join(solFolder, fileName);
  })
  .filter(isFile);
const uploads = fs.readdirSync(upFolder)
  .map(fileName => {
    return path.join(upFolder, fileName);
  })
  .filter(isFile);

// console.log( solicitudes, uploads );

// async..await is not allowed in global scope, must use a wrapper
async function main( mail, solicitud, resguardo ) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Parroquias de San Vicente ⛪" <informacion@parroquiasdesanvicente-inscripcion.es>', // sender address
    to: mail, // list of receivers
    subject: "Resguardo Catequésis ✔", // Subject line
    text: `Hola madre o padre del catecúmeno/a ________________, te hemos enviado tu resguardo ya que no pudimos en otro momento`, // plain text body
    html: "<b>Hola, te hemos enviado tu resguardo</b>", // html body
    attachments:[
        {
            filename: 'solictud.pdf',
            path: solicitud
        },
        {
          filename: 'resguardo.pdf',
          path: resguardo
        },
    ]
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// Buscar de cada solicitud, su upload para emparejarlo
solicitudes.forEach( (fichero) => {
  const posSol = fichero.search( 'solicitud' );
  const posPdf = fichero.search( '.pdf' );

  if( (posSol !== -1) && (posPdf !== -1) ){
    const nombre = fichero.substring(posSol+10, posPdf );
    const found = uploads.find( (upload)=> {  
      const ff = upload.search(nombre); 
      return ff != -1;
    });
    if( found ) {
      // console.log(nombre, fichero, found );
      main( 'parrambr@hotmail.com', fichero, found ).catch(console.error);

    }
  }
  
});


// main().catch(console.error);