const nodemailer = require('nodemailer')

const sendEmail = async (option)=>{

    //creat a transporter

    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        secure: true, 
        auth :{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        },
         logger: true,  
        debug: true  
    })


    //DEFINE EMAIL OPTION

 const emailOptions = {
   from : `Mumbai Shipping <${process.env.EMAIL_USER}>`,
   to:option.email,
   subject:option.subject,
   text:option.message
 }


 await transporter.sendMail(emailOptions);

}



module.exports= sendEmail;