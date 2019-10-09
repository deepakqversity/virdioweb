var nodemailer = require("nodemailer");
class SendMail{

	emailInput(to,subject,text){
     
		try{
            let transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                auth: {
                    user: "lalit3485@gmail.com",
                    pass: "Munmun81"
                }
              });

              let mailOptions={
                from: 'lalit3485@gmail.com',
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