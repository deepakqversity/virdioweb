var nodemailer = require("nodemailer");
class SendMail{

	emailInput(to,subject,text){
     
		try{
            let transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PWD
                }
              });

              let mailOptions={
                from: process.env.SMTP_EMAI,
                to :to,
                subject :subject,
                html: text
            }
            console.log('---------mailOptions-------------',mailOptions);
   
            transporter.sendMail(mailOptions, function(error, info){
                let result;
                if (error) {
                  console.log('---------error--------',error);
                
                 
                } else {
                  console.log('----------Email sent:--------- ' + info.response);

                 result=info.response;                 
                }

                return result;
                             
              });
             
		} catch(err){
			console.log(err)
		}
    }
    


}

module.exports = new SendMail();