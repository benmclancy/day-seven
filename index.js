const express = require("express");
const fs = require("fs");
const User = require("./user");
const Property = require("./property");
const Booking = require("./booking");
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// ADDS USER TO DATABASE
app.post("/api/users", (req, res) => {
    const user = req.body;
    const bodyFisrtname = user.firstname;
    const bodyLastname = user.lastname;
    const bodyEmail = user.email;
    const bodyPassword = user.password;

    var errors = [];
    if (!bodyFisrtname) {
        errors.push({message: "Invalid request: First name expected"})
    }
    if (!bodyLastname) {
        errors.push({message: "Invalid request: Last name expected"})
    }
    if (!bodyEmail) {
        errors.push({message: "Invalid request: E-mail expected"})
    }
    if (!bodyPassword) {
        errors.push({message: "Invalid request: Password expected"})
    }

    if (errors.length > 0) {
        return res.status(400).json({errorMessages: errors});
    }

    User.getAllUsers((err, result) => {
        for (var i = 0; i < result.length; i++) {
            if(result[i].email == bodyEmail) {
                return res.status(400).json({message: "Invalid request: Email already in use."});
            }
        }
    });

    var newUser = {
        first_name: bodyFisrtname,
        last_name: bodyLastname,
        email: bodyEmail,
        password: bodyPassword
    };

    User.createUser(newUser, (err, result) => {
        return res.status(200).json({id: result});
    });
});


//RETURNS THE USER WITH THE GIVEN ID
app.get("/api/users/:id", (req, res) => {
    const userId = req.params.id;

    const numberUserId = parseInt(userId);
    if(isNaN(numberUserId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!userId) {
        return res.status(400).json({message: "Please pass in a user ID"})
    }

    User.getUserById(userId, (err, result) => {
        if (result[0] == null) {
            return res.status(404).json ({message: "User not found"});
        } else {
            return res.status(200).json({user: result[0]});
        }
    });

});


//RETURNS A USER WITH THE GIVEN USERNAME AND PASSWORD
app.post("/api/users/authentication", (req, res) => {
    const user = req.body;
    const bodyEmail = user.email;
    const bodyPassword = user.password;

    var errors = [];
    if (!bodyEmail) {
        errors.push({message: "Invalid request: E-mail expected"})
    }
    if (!bodyPassword) {
        errors.push({message: "Invalid request: Password expected"})
    }

    if (errors.length > 0) {
        return res.status(400).json({errorMessages: errors});
    }


    User.getUserByEmail(bodyEmail, (err, result) => {
        if (result[0] == null) {
            return res.status(404).json ({message: "Invalid E-mail or Password"});
        } else if (result[0].password == bodyPassword) {
            return res.status(200).json({user: result[0]});
        } else {
            return res.status(404).json ({message: "Invalid E-mail or Password"});
        }
    });
});


//ADDS PROPERTY TO DATABASE
app.post("/api/properties", (req, res) => {
    const property = req.body;
    const propertyName = property.name;
    const propertyLocation = property.location;
    const propertyImg = property.img;
    const propertyPrice = property.price;
    const propertyUserId = property.user_id;

    var errors = [];
    if (!propertyName) {
        errors.push({message: "Invalid request: Property name expected"})
    }
    if (!propertyLocation) {
        errors.push({message: "Invalid request: Property location expected"})
    }
    if (!propertyImg) {
        errors.push({message: "Invalid request: Property image expected"})
    }
    if (!propertyPrice) {
        errors.push({message: "Invalid request: Property price expected"})
    }
    if (!propertyUserId) {
        errors.push({message: "Invalid request: Property owner ID expected"})
    }

    if (errors.length > 0) {
        return res.status(400).json({errorMessages: errors});
    }

    var newProperty = {
        name: propertyName,
        location: propertyLocation,
        img: propertyImg,
        price: propertyPrice,
        user_id: propertyUserId
    };

    Property.createProperty(newProperty, (err, result) => {
        return res.status(200).json({id: result});
    });
});


//REMOVE THE PROPERTY WITH THE GIVEN ID
app.delete("/api/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    const numberPropertyId = parseInt(propertyId);
    if(isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!propertyId) {
        return res.status(400).json({message: "Please pass in a property ID"})
    }

    Property.delPropertyById(propertyId, (err, result) => {
        return res.status(200).json({message: "Property Deleted"});
    });
});


//RETURNS THE PROPERTY WITH THE GIVEN ID
app.get("/api/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    const numberPropertyId = parseInt(propertyId);
    if(isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!propertyId) {
        return res.status(400).json({message: "Please pass in a property ID"})
    }

    Property.getPropertyById(propertyId, (err, result) => {
        if (result[0] == null) {
            return res.status(404).json ({message: "Property not found"});
        } else {
            return res.status(200).json({property: result[0]});
        }
    });
});


//RETURNS ALL PROPERTIES
app.get("/api/properties", (req, res) => {

    Property.getAllProperties((err, result) => {
        if (result == null) {
            return res.status(404).json ({message: "Property not found"});
        } else {
            return res.status(200).json({result});
        }
    });
});


//ADDS BOOKING TO DATABASE
app.post("/api/properties/:id/bookings", (req, res) => {
    const bookingPropertyId = req.params.id;

    const numberPropertyId = parseInt(bookingPropertyId);
    if(isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!bookingPropertyId) {
        return res.status(400).json({message: "Please pass in a property ID"})
    }

    const booking = req.body;
    const bookingDateFrom = booking.dateFrom;
    const bookingDateTo = booking.dateTo;
    const bookingUserId = booking.userId;

    var errors = [];
    if (!bookingDateFrom) {
        errors.push({message: "Invalid request: Booking date from expected"})
    }
    if (!bookingDateTo) {
        errors.push({message: "Invalid request: Booking date to expected"})
    }
    if (!bookingUserId) {
        errors.push({message: "Invalid request: Booking user ID expected"})
    }

    if (errors.length > 0) {
        return res.status(400).json({errorMessages: errors});
    }

    var newBooking = {
        date_from: bookingDateFrom,
        date_to: bookingDateTo,
        user_id: parseInt(bookingUserId),
        property_id: parseInt(bookingPropertyId),
        status: "NEW"
    };

    Booking.createBooking(newBooking, (err, result) => {
        return res.status(200).json({id: result});
    });
});


//RETURNS ALL BOOKINGS OF A GIVEN PROPERTY ID
app.get("/api/properties/:id/bookings", (req, res) => {
    const propertyId = req.params.id;

    const numberPropertyId = parseInt(propertyId);
    if(isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!propertyId) {
        return res.status(400).json({message: "Please pass in a property ID"})
    }

    Booking.getBookingByPropertyId(propertyId, (err, result) => {
        if (result[0] == null) {
            return res.status(404).json ({message: "No bookings found for this property"});
        } else {
            return res.status(200).json({user: result});
        }
    });
});

app.listen(3000, () =>{
    console.log("Server is running");
});
