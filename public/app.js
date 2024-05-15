const formSelectFileChange = () => {
    const files=document.getElementById("formFileLabel");
    const btn = document.getElementById('uploadBtn');
    if(files.files.length === 1 ) {
      btn.disabled=false;
      btn.hidden=false;
      localStorage.setItem('upload', true );
    } else {
      btn.disabled=true;
      btn.hidden=true;
      localStorage.removeItem('upload');
    }  
}

const submitUpload = (event) => {
    event.preventDefault();
    const files=document.getElementById("formFileLabel");
    if(files.files.length === 1 ) {
      const formData=new FormData();
      formData.append("name", localStorage.getItem("uuid") );
      formData.append("file", files.files[0]);

      fetch("/upload", {
        method: "POST",
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin",
        // headers: {"Content-Type": "multipart/form-data",},
        redirect: "follow", 
        referrerPolicy: "no-referrer",
        body: formData, 
      })
      .then( (res) => localStorage.setItem("upload", true ) )
      .catch( (err) => ("Error occured", err) )
    }
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const resp = await response.json(); // parses JSON response into native JavaScript objects
    return { status: response.status, errors: resp['errors'] }; 
}

async function getPdf(uuid){
    fetch( `/api/getPdf/${uuid}` )
        .then( res=> res.blob() )
        .then( blob =>{
            const filename = `solicitud.pdf`;
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE doesn't allow using a blob object directly as link href.
                // Workaround for "HTML7007: One or more blob URLs were
                // revoked by closing the blob for which they were created.
                // These URLs will no longer resolve as the data backing
                // the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
                return;
            }
            // Other browsers
            // Create a link pointing to the ObjectURL containing the blob
            const blobURL = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', filename);
            // Safari thinks _blank anchor are pop ups. We only want to set _blank
            // target if the browser does not support the HTML5 download attribute.
            // This allows you to download files in desktop safari if pop up blocking
            // is enabled.
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(blobURL);
            }, 100);

        })
        .catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
}


const serializeForm = ( form ) => {
    let obj = {}
  	const formData = new FormData( form );
  	for( let key of formData.keys() ) {
	    obj[key]=formData.get(key);
    }
    // Añadimos las dos imagenes
    obj['firmadoPadre']=document.getElementById('firmadoPadre').src;
    obj['firmadoMadre']=document.getElementById('firmadoMadre').src;
    if( document.getElementById('imagenDigitalNo').checked )
        obj['imagenDigital'] = 'off';
    if( document.getElementById('imagenImpresaNo').checked )
        obj['imagenImpresa'] = 'off';
    if( document.getElementById('comunicacionesNo').checked )
        obj['comunicaciones'] = 'off';
    if( document.getElementById('datosSaludNo').checked )
        obj['datosSalud'] = 'off';
    obj['uuid']=localStorage.getItem("uuid");
    return obj;
}

const mainFormSubmitted =  (event) => {
    event.preventDefault();
    event.stopPropagation();
  			// console.log( event  );
    const form = event.target;
    const serialized = serializeForm(event.target);

    const uploadFile = localStorage.getItem("upload");
    if( !uploadFile) { 
        Swal.fire({icon: 'error', title: 'Oops...', text: 'Debe anexar fichero justificante de pago', footer: 'Cumplimentar'});
        return;
    }

    // console.log( serialized);

	// Validaciones del formulario 
  	// 1º Aceptar protección de datos
    if( !serialized['aceptaTrat'] ){
        Swal.fire({icon: 'error',title: 'Debe aceptar la protección de datos'});
        return;
    }

    // 2º Chequear datos requeridos
    if (!form.checkValidity()) {
        // event.preventDefault();
        // event.stopPropagation();
        let campoErroneo = '';
        let erroneos=0;
        const campos=[ 
    				'nombre',
    				'apellidos',
    				'fechaNacimiento',
    				'colegio',
    				'direccion',
    				'codpost',
    				'email',
    	];
        campos.forEach(element => {
      	    if( !serialized[element] ){
                Swal.fire({icon: 'error', title: 'Oops...', text: `El campo ${element} es obligatrio`, footer: 'Cumplimentar'});
                erroneos++;
            }
        });

        form.classList.add('was-validated');
        if( erroneos >  0 )
            return;
        }

        // 3º Chequear  progenitores
        if( serialized['firmadoPadre'].length === 0 && serialized['firmadoMadre'].length === 0  ){
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Al menos uno de los progenitores debe firma la solicitud', footer: 'Cumplimentar'});
            return;
        }

        const nombreMadre = serialized['nombreMadre'];
        const nombrePadre = serialized['nombrePadre'];
        if( (!nombrePadre || nombrePadre.length === 0 ) && 
              (!nombreMadre || nombreMadre.length === 0 ) )
        {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Debe consignar el nombre del padre o de la madre', footer: 'Cumplimentar'});
            return;
        }

        const apellidosPadre = serialized['apellidosPadre'];
        const apellidosMadre = serialized['apellidosMadre'];
        if( (!apellidosPadre || apellidosPadre.length === 0) && 
            (!apellidosMadre || apellidosMadre.length === 0))
        {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Debe consignar los apellidos del padre o de la madre', footer: 'Cumplimentar'});
            return;
        }

        const dniPadre = serialized['dniPadre'];
        const dniMadre = serialized['dniMadre'];
        if( (!dniPadre || dniPadre.length === 0) && 
            (!dniMadre || dniMadre.length === 0))
        {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Debe consignar el DNI del padre o de la madre', footer: 'Cumplimentar'});
            return;
     	}

        const telefonoPadre = serialized['telefonoPadre'];
        const telefonoMadre = serialized['telefonoMadre'];
        if( (!telefonoPadre || telefonoPadre.length === 0) && 
             (!telefonoMadre || telefonoMadre.length === 0))
        {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Debe consignar el teléfono del padre o de la madre', footer: 'Cumplimentar'});
            return;
        }

        // Postear los datos
  		postData('/api/post-solicitud', serialized).then((data) => {
            if( data.status >= 400 ){
            Swal.fire({icon: 'error', title: 'Oops...', text: data.errors[0].msg, footer: 'Cumplimentar'});
            } else {
                Swal.fire({
                title: `¿Quieres descargar el fichero ${serialized.uuid}.PDF generado?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Si',
                denyButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                        getPdf(serialized.uuid);
                        Swal.fire('Descargado!', '', 'success')
                    }
                    window.location = "https://www.parroquiasdesanvicente.es/";
                });
            }
        }).catch( (err) => {
          // Swal.fire({icon: 'error', title: 'Oops...', text: `El campo ${element} es obligatrio`, footer: 'Cumplimentar'});
          console.error( err );
        });
}

const logSubmit = (event) => {
    console.log( `Form Submitted! Timestamp: ${event.timeStamp}` );
    event.preventDefault();
}

const resetCanvas = () => {
    const canvas = document.getElementById('canvas');
    canvas.width_line = 1;
    canvas.color = "#000000";
    canvas.sign = false;
    canvas.begin_sign = false;
    canvas.cursorX = 0;
    canvas.cursorY = 0;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// isCanvasBlank - returns true if every pixel's uint32 representation is 0 (or "blank")
const  isCanvasBlank = (canvas) => {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer );
    return !pixelBuffer.some(color => color !== 0);
}

const updateMousePosition = (target, mX, mY) => {
   const rect = target.getBoundingClientRect();
   const scaleX = target.width / rect.width;
   const scaleY = target.height / rect.height;
   target.cursorX = Math.floor( ((mX - rect.left)*scaleX)*100)/100;
   target.cursorY = Math.floor( ((mY - rect.top)*scaleY)*100)/100;
}

const  createSignature = (target) => {
    if( target ){
        const context = target.getContext('2d');
        // console.log( 'context', context );
        if( context ){
            if (!target.begin_sign) {
                context.beginPath();
                context.moveTo(target.cursorX, target.cursorY);
                target.begin_sign = true;
            } else {
                context.lineTo(target.cursorX, target.cursorY);
                context.strokeStyle = target.color;
                context.lineWidth = target.width_line;
                context.stroke();
            }
        }
    }
}

const onMouseDown = ({ target, pageX, pageY, changedTouches }) => {
    target.sign = true;
    // span.innerText = `md   x: ${ target.cursorX} y; ${target.cursorY}`;
    // console.log( 'changedTouches', changedTouches );
    if( changedTouches && changedTouches[0]){
        updateMousePosition(target, changedTouches[0].pageX, changedTouches[0].pageY);
    } else {
        updateMousePosition(target, pageX, pageY);
    }
}

const onMouseUp = ({target}) => {
    target.sign = false;
    target.begin_sign = false;
}

const onMouseMove = ({ target, pageX, pageY, changedTouches }) => {
    if( changedTouches && changedTouches[0]){
        // span.innerText = `mm   x: ${ changedTouches[0].pageX } y; ${ changedTouches[0].pageY }`;
        updateMousePosition(target, changedTouches[0].pageX, changedTouches[0].pageY);
    } else {
        // span.innerText = `mm   x: ${ pageX} y; ${pageY}`;
        updateMousePosition(target, pageX, pageY);
        // spanC.innerText = `sign: ${ target.sign } begin_sign: ${target.begin_sign}  x: ${ target.cursorX} y; ${target.cursorY}`;
    }
    if (target.sign) {
        createSignature(target);
    }
}

const  modalEvents = ()=> {
    $("#bookingmodal").on("hidden.bs.modal", function () {
        // Quitar eventos
        const canvas = document.getElementById('canvas');
        canvas.removeEventListener("mousedown", onMouseDown, false );
        canvas.removeEventListener("mouseup", onMouseUp, false );
        canvas.removeEventListener('mousemove', onMouseMove, false );
        canvas.addEventListener("touchstart", onMouseDown, false );
        canvas.addEventListener("touchend", onMouseUp, false );
        canvas.addEventListener('touchmove', onMouseMove, false );

        let i = document.getElementById('firmadoPadre');
        const progenitor = this['progenitor'];
        if(  progenitor === 'Madre'){
            i = document.getElementById('firmadoMadre');
        }
        if( isCanvasBlank(canvas)){
            i.removeAttribute('src');
        }
        else {
            i.src = canvas.toDataURL();
            resetCanvas();
        }
        canvas.sign = false;
        canvas.begin_sign = false;
        canvas.cursorX = 0;
        canvas.cursorY = 0;
    });

    $("#bookingmodal").on("show.bs.modal", function (event) {
        // Esto es una "ñapa" para que funcione el firmado 
        window.scroll(0,0);

        const canvas = document.getElementById('canvas');
        canvas.width_line = 1;
        canvas.color = "#000000";
        canvas.sign = false;
        canvas.begin_sign = false;
        canvas.cursorX = 0;
        canvas.cursorY = 0;
        const context = canvas.getContext('2d');

        const button = event.relatedTarget;
        let i = document.getElementById('firmadoPadre');
        // En el button hay que añadir un attr. data-bs-p con valor Padre o Madre
        // Para saber que imagen hya que actualziar o de la que hay que dibujar en canvas 
        const progenitor = button.getAttribute('data-bs-p');
        this['progenitor']=progenitor;
        if(  progenitor === 'Madre'){
            i = document.getElementById('firmadoMadre');
        }
        if( i.src ){
            context.drawImage(i, 0, 0);
        }
        // Se establecen los eventos 
        canvas.addEventListener("mousedown", onMouseDown, false );
        canvas.addEventListener("mouseup", onMouseUp, false );
        canvas.addEventListener('mousemove', onMouseMove, false );
        canvas.addEventListener("touchstart", onMouseDown, false );
        canvas.addEventListener("touchend", onMouseUp, false );
        canvas.addEventListener('touchmove', onMouseMove, false );
    });
}

const firmaConCertificado = (quien) => {
    const u = localStorage.getItem('uuid');
console.log(u);
    const host = window.location.host.split(':')[0];
    const url = `https://${host}:8443/api/get-QRCert?`+ new URLSearchParams({uuid: u})
console.log( `Url: ${url}` );
    fetch( url  )
      .then( res => res.text() )
      .then( data =>{  
        let ocultar;
        let img;
        if( quien === 'Padre'){
          ocultar = document.getElementById('certificadoMadre');
          img = document.getElementById('firmadoPadre');
        } 
        else {
          ocultar = document.getElementById('certificadoPadre');
          img = document.getElementById('firmadoMadre');
        }
        ocultar.setAttribute("hidden", "hidden");
        img.src = data;
      });
}
