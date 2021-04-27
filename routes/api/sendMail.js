const express = require('express')
const sendMail = express.Router()
const nodemailer = require('nodemailer')
const mailConfig = require("../../src/components/NotificationEmail/mail.json");


const transport = {
  //all of the configuration for making a site send an email.

  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: mailConfig.MAIL_USER || 'csmeteam@gmail.com', // TODO: your gmail account
    pass: mailConfig.MAIL_PASS
  }
};

const transporter = nodemailer.createTransport(transport);
  transporter.verify((error, success) => {
    if(error) {
      //if error happened code ends here
      console.error(error)
    } else {
      //this means success
      console.log('Mailing Ready')
    }
  });

sendMail.post('/', (req,res, next) => {
  //make mailable object
  const mail = {
    from: mailConfig.MAIL_USER,
    to: req.body.user,
    subject: "ME Machine Shop Reservation Reminder",
    text: `You have an upcoming reservation at the machine shop from ${req.body.start} to ${req.body.end}`
  }
  transporter.sendMail(mail, (err,data) => {
        if(err) {
          res.json({
            status: 'fail'
          })
        } else {
          res.json({
            status: 'success'
          })
        }
      })
});

module.exports = sendMail
