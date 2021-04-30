const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//  Reservation Schema
const ReservationSchema = new Schema ({
  id: {
  type: Number,
  required: true
},
    user: {
        type: String,
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
        required: true
    },
    resourceId: {
        type: Number,
        required: true
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
        type: String,
        default: ""
    },
    grad: {
        type: String,
        ref: "users"
    },
    notes: {
      type: String,
      default: ""
    }
});

module.exports = Task = mongoose.model("reservations", ReservationSchema);
