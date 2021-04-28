const express = require("express");
const moment = require("moment");
const router = express.Router();
const nodemailer = require('nodemailer')
const mailConfig = require("../../src/components/NotificationEmail/mail.json");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const Reservation = require("../../models/Reservation");

const oauth2Client = new OAuth2(
     mailConfig.ClientID, // ClientID
     mailConfig.ClientSecret, // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: mailConfig.RefreshToken
});
const accessToken = oauth2Client.getAccessToken()

let transporter = nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 465,
         secure: true,
         auth: {
             type: 'OAuth2',
             user: mailConfig.MAIL_USER,
             accessToken: accessToken,
             clientId: mailConfig.ClientID,
            clientSecret: mailConfig.ClientSecret,
            refreshToken: mailConfig.RefreshToken,
         },
     tls: {
         rejectUnauthorized: false
     }
});

router.get("/getReservations", (req, res) => {
    Reservation.find()
    .populate("billingCode")
    .then(reservations => res.json(reservations));
}
);


// @route GET api/reservations/getUpcomingRes
// @desc Get all reservations
// @access at the moment - public
//ADMIN
router.get("/getUpcomingRes", (req, res) => {
  var now = moment().format("YYYY-MM-DD HH:mm:ss");
    Reservation.find({ start: { $gte: now } })
    .populate("billingCode")
    .then(reservations => res.json(reservations));
}
);

//ADMIN
router.get("/getPastRes", (req, res) => {
  var now = moment().format("YYYY-MM-DD HH:mm:ss");
    Reservation.find({ start: { $lt: now } })
    .populate("billingCode")
    .then(reservations => res.json(reservations));
}
);

//get for upcoming reservations all students
router.get("/upcoming/:id", (req, res) => {
    let id = req.params.id;
    var now = moment().format("YYYY-MM-DD HH:mm:ss");

    Reservation.find({
        user: id,
        start: { $gte: now }
    })
    .populate("billingCode")
    .then(reservation => res.json(reservation));
});

router.get("/past/:id", (req, res) => {
    let id = req.params.id;
    var now = moment().format("YYYY-MM-DD HH:mm:ss");

    Reservation.find({
        user: id,
        start: { $lt: now }
    })
    .populate("billingCode")
    .then(reservation => res.json(reservation));
});

router.post("/newReservation", (req, res) => {
    // Check for conflicts here??
    // Reservation.findOne({ id: req.body.id }).then(reservation => {
    //     if(reservation) {
    //         return res.status(400).json({ id: "Reservation id already exists" });
    //     } else {

    //Generate a random number as the ID for the reservation. No real purpose but adheres to previous team schema
    var newid = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))

            const newReservation = new Reservation({
                id: newid,
                user: req.body.user,
                start: req.body.start,
                end: req.body.end,
                machine: req.body.machine,
                resourceId: req.body.resourceId,
                billingCode: req.body.billingCode,
                grad: req.body.grad
            });

            newReservation.save()
            .then(reservation => res.json(reservation));
});

router.post('/sendMail', (req,res) => {
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

router.delete("/delete/:id", (req, res) => {
    Reservation.findById(req.params.id).then(reservation => {
        reservation.remove().then(() => res.json({success: true}));
    });
}
);

module.exports = router;
