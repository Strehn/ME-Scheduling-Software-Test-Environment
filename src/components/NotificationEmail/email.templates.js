// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: id => ({
    subject: 'ME Machine Shop Reservation Confirmed',
    html: `
        Your reservation for (machine) on (date) was successful!
    `,
    // Possibly add a text component, probably just use HTML for nice format
    // text:
  })

}
