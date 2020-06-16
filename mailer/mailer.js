const config = require('config');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

class Mailer {
    
    static async main(recipient) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(smtpTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get('dbConfig.email'),
            pass: config.get('dbConfig.email-password')
          }
        }));

        const sendUrl = `http://${config.get('dbConfig.domain')}:${config.get('dbConfig.port')}/app/user/auth/?email=${recipient.user_email}&key=${recipient.secret_key}`
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: config.get('dbConfig.email'), // sender address
          to: recipient.user_email, // list of receivers
          subject: "Sharp-E Email Verification ✔", // Subject line
          text: "Confirm Email", // plain text body
          html: `To activate your account please click the link below <br><a href=${sendUrl}>Activate Now !</a>` // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      }
      
}

module.exports = Mailer;