const express = require("express");
const moment = require("moment");
const router = express.Router();

const Reservation = require("../../models/Reservation");

router.get("/getReservations", (req, res) => {
    Reservation.find()
    .populate("billingCode")
    .populate("machine")
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
    .populate("machine")
    .then(reservations => res.json(reservations));
}
);

//ADMIN
router.get("/getPastRes", (req, res) => {
  var now = moment().format("YYYY-MM-DD HH:mm:ss");
    Reservation.find({ start: { $lt: now } })
    .populate("billingCode")
    .populate("machine")
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
    .populate("machine")
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
    .populate("machine")
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
    //
            newReservation.save().then(reservation => res.json(reservation));
    //     }
    // });
});

router.delete("/delete/:id", (req, res) => {
    Reservation.findById(req.params.id).then(reservation => {
        reservation.remove().then(() => res.json({success: true}));
    });
}
);

module.exports = router;
