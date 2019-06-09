var mysqlConn = require("./db");

//Task object constructor
var Property = function(property) {
    this.name = property.name;
    this.location = property.location;
    this.img = property.img;
    this.price = property.price;
    this.user_id = property.user_id;
};


//PUSH NEW PROPERTY
Property.createProperty = function(newProperty, result) {
    mysqlConn.query("INSERT INTO properties set ?", newProperty, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
}


//DELETE PROPERTY BY ID
Property.delPropertyById = function(propertyId, result) {
    mysqlConn.query("Delete from properties where id = ? ", propertyId, function( err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


//GET ALL PROPERTY
Property.getAllProperties = function(result) {
    mysqlConn.query("Select * from properties", function( err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res)
        }
    });
};


//GET PROPERTY BY ID
Property.getPropertyById = function(propertyId, result) {
    mysqlConn.query("Select * from properties where id = ? ", propertyId, function( err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Property;