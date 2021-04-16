import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const BookingDialog = props => {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="booking-dialog"
        >
            <DialogTitle id="booking-dialog">New Booking</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to create a new booking?
        </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Cancel
        </Button>
                <Button onClick={props.onClose} color="primary">
                    Book
        </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingDialog;
