var mysqlConn = require("./db");

//Task object constructor
var Booking = function(booking) {
    this.date_from = booking.dateFrom;
    this.date_to = booking.dateTo;
    this.user_id = booking.userId;
    this.property_id = booking.propertyId;
};


//PUSH NEW BOOKING
Booking.createBooking = function(newBooking, result) {
    mysqlConn.query("INSERT INTO bookings set ?", newBooking, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
}


//GET ALL BOOKINGS FROM A GIVEN PROPERTY ID
Booking.getBookingByPropertyId = function(propertyId, result) {
    mysqlConn.query("Select * from bookings where property_id = ? ", propertyId, function( err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


module.exports = Booking;