const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL, PASS } = process.env;


const mail = {
    user: EMAIL,
    pass: PASS
}

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // port: 2525, // defaults to 465 if secure is true
    tls: {
        rejectUnauthorized: false
    },
    secure: true, // true for 465, false for other ports (gmail requires 465)
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
});

const sendEmail = async (email, subject, html) => {
    try {    
        await transporter.sendMail({
            from: `Librería Henry <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            // text: '¡Bienvenido/a a Librería Henry!', // plain text body
            html, // html body
        });

    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
}

const getTemplate = (name) => {
    return `
        <img src='https://i.ibb.co/MN512MH/logo-Hen-Ry-Library.jpg' alt='HenryLibraryLogo'>
        <h2>Hola, ${ name || 'Usuario' }</h2>
        <p>Gracias por preferirnos.</p>
        <p>Ahora que estás regitrado/a, te contamos lo que puedes hacer:</p>
        <ul>
            <li>Buscar los libros que quieras.</li>
            <li>Agregarlos a tus favoritos.</li>
            <li>Dejarlos en tu carrito para luego comprarlos.</li>
            <li>¡Pagar todo con tu cuenta MercadoPago!</li>
        </ul>
        <p>Librería Henry. Tu librería de confianza.</p>
        `;
}

module.exports = {
    sendEmail,
    getTemplate
}