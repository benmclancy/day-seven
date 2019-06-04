const express = require("express")
const app = express();

const fs = require("fs");

// IMPORT/EXPORT EXAMPLE
// const constants = require("./constants");
// console.log(constants);

// const ValidationService = require("./validation-service");
// const valServ = new ValidationService();
// console.log(valServ);
// console.log(ValidationService);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var users = new Array();
var properties = new Array();
var bookings = new Array();

app.post("/read/file", (req, res) => {
    fs.readFile("./data/file.json", function(err, data) {
        if (err) {
            return res.status(500).json({message: "Unable to open file"});
        }

        var jsonFromString = JSON.parse(data);

        jsonFromString.users.push({id: 1});

        fs.writeFile("./data/file.json", JSON.stringify(jsonFromString), function(err) {
            if (err) {
                return res.status(500).json({message: "Unable to open file"});
            } 

            return res.status(200).json(jsonFromString);
        });

        // return res.status(200).json(jsonFromString);
    });
});


// PUT USER INFO INTO ARRAY, RETURN USER INFO
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

    let foundUser = null;
    users.forEach((eachUser) => {
        if(eachUser.email === bodyEmail) {
            foundUser = eachUser;
        }
    });
    if (foundUser != null) {
        return res.status(400).json({message: "Invalid request: Email already in use."});
    }

    var newUser = {
        id: users.length + 1,
        firstname: bodyFisrtname,
        lastname: bodyLastname,
        email: bodyEmail,
        password: bodyPassword
    };

    users.push(newUser);
    res.json(newUser);
});


//RETURNS THE USER WITH THE ID AT THE END OF THE ADDRESS
app.get("/api/users/:id", (req, res) => {
    const userId = req.params.id;

    const numberUserId = parseInt(userId);
    if(isNaN(numberUserId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!userId) {
        return res.status(400).json({message: "Please pass in a user ID"})
    }

    for (var k = 0; k < users.length; k++) {
        const aUser = users[k];
        if (aUser.id == userId) {
            return res.status(200).json(aUser);
        }
    }

    return res.status(404).json ({message: "User not found"});
});


//RETURNS A USER WITH A GIVEN ID
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

    let foundUser = null;
    users.forEach((eachUser) => {
        if(eachUser.email === bodyEmail) {
            if(eachUser.password === bodyPassword) {
                foundUser = eachUser;
            }
        }
    });
    if(foundUser == null) {
        return res.status(404).json ({message: "Invalid E-mail or Password"});
    }
    
    res.json(foundUser);
});


//PUT PROPERTY INFO INTO ARRAY, RETURN PROPERTY INFO
app.post("/api/properties", (req, res) => {
    const property = req.body;
    const propertyName = property.name;
    const propertyLocation = property.location;
    const propertyImg = property.img;
    const propertyPrice = property.price;

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

    if (errors.length > 0) {
        return res.status(400).json({errorMessages: errors});
    }

    var newProperty = {
        id: properties.length + 1,
        name: propertyName,
        location: propertyLocation,
        img: propertyImg,
        price: propertyPrice
    };

    properties.push(newProperty);
    res.json(newProperty);
});


//REMOVE A PROPERTY WITH A GIVEN ID
app.delete("/api/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    const numberPropertyId = parseInt(propertyId);
    if(isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!propertyId) {
        return res.status(400).json({message: "Please pass in a property ID"})
    }

    for (var k = 0; k < properties.length; k++) {
        if (properties[k].id == propertyId) {
            properties.splice(k, 1);
            return res.status(200).json({message: "ID deleted"});
        }
    }

    return res.status(400).json({message: "Invalid ID"});
});


//RETURNS A PROPERTY WITH A GIVEN ID
app.get("/api/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    const numberPropertyId = parseInt(propertyId);
    if(isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Integer Expected"});
    }

    if (!propertyId) {
        return res.status(400).json({message: "Please pass in a property ID"})
    }

    for (var k = 0; k < properties.length; k++) {
        const aProperty = properties[k];
        if (aProperty.id == propertyId) {
            return res.status(200).json(aProperty);
        }
    }

    return res.status(404).json ({message: "Property not found"});
});


//PUT BOOKING INFO INTO ARRAY, RETURN BOOKING INFO
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
        id: bookings.length + 1,
        dateFrom: bookingDateFrom,
        dateTo: bookingDateTo,
        userId: parseInt(bookingUserId),
        propertyId: parseInt(bookingPropertyId),
        status: "NEW"
    };

    bookings.push(newBooking);
    res.json(newBooking);
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

    var validBookings = new Array();

    for (var k = 0; k < bookings.length; k++) {
        const aBooking = bookings[k];
        if (aBooking.propertyId == propertyId) {
            validBookings.push(aBooking);
        }
    }

    if (validBookings.length < 1) {
        return res.status(200).json({message: "No Bookings found for this property ID"})
    }

    res.json(validBookings);
});

const PropertyRouter = express.Router();
PropertyRouter.post("/api/properties", (req, res) => {
    res. send("POST Properties api");
});
app.use("/parent", PropertyRouter);

app.listen(3000, () =>{
    console.log("Server is running");
});
