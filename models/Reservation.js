const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//  Reservation Schema
const ReservationSchema = new Schema ({
    user: {
        type: String,
        required: true
    },
    date: {
        format: 'MM-DD-YYYY',
        type: Date,
        required: true
    },
    start: {
        type: String,  //format: 'YYYY-MM-DD HH:MM:SS'
        //type: Date,
        required: true
    },
    end: {
        type: String,
        //type: Date,
        required: true
    },
    machine: {
        type: String,
        ref: "machines",
        //required: true
    },
    title: {
        type: String,
        default: 'Busy'
    },
    bgColor: {
        type: String,
        default: '#c41d1d'
    },
    billingCode: {
        type: Schema.Types.ObjectId,
        ref: "billingcodes",
        required: true
    },
    grad: {
        type: String,
        ref: "users"
    },
});

module.exports = Task = mongoose.model("reservations", ReservationSchema);
