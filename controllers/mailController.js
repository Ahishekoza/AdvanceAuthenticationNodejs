import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config()


let nodeConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator =  new Mailgen({
    theme: 'default',
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }

})

export const registerMail = async(req,res)=>{
    const {username, userEmail , text,subject}= req.body

    // ---email body --
    var email =  {
        body: {
            name: username,
            intro :  text ||  'Welcome to Oza Ventures , I`m glad to have you on board',
            outro : 'You can ask me your queries via your email address'
        }
    }

    var emailBody = MailGenerator.generate(email)

    let message = { 
        from : process.env.EMAIL,
        to: userEmail,
        subject: "Successfully created",
        html: emailBody
    }


    transporter.sendMail(message).then(() => {
        return res.status(200).send({ msg: "You should receive an email from us."})
    })
    .catch(error => res.status(500).send({ error }))
}