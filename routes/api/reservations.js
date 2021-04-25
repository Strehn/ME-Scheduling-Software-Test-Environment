const express = require("express");
const moment = require("moment");
const router = express.Router();

const Reservation = require("../../models/Reservation");

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
    var now = moment().format("MM-DD-YYYY");
    Reservation.find({date : { $gte : now }})
    .populate("billingCode")
    .then(reservations => res.json(reservations));
}
);

//ADMIN
router.get("/getPastRes", (req, res) => {
    var now = moment().format("MM-DD-YYYY");
    Reservation.find({date : { $lt : now }})
    .populate("billingCode")
    .then(reservations => res.json(reservations));
}
);

//get for upcoming reservations all students
router.get("/upcoming/:id", (req, res) => {
    let id = req.params.id;
    var now = moment().format("MM-DD-YYYY");

    Reservation.find({
        user: id,
        start : { $gte : now }
    })
    .populate("billingCode")
    .then(reservation => res.json(reservation));
});

router.get("/past/:id", (req, res) => {
    let id = req.params.id;
    var now = moment().format("MM-DD-YYYY");

    Reservation.find({
        user: id,
        start : { $lt : now }
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
            const newReservation = new Reservation({
                user: req.body.user,
                date: req.body.date,
                // id: req.body.id,
                start: req.body.start,
                end: req.body.end,
                // resourceId: req.body.resourceId,
                machine: req.body.machine,
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
