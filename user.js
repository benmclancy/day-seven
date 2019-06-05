var mysqlConn = require("./db");

//Task object constructor
var User = function(user) {
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.email = user.email;
    this.password = user.password;
};


//PUSH NEW USER
User.createUser = function(newUser, result) {
    mysqlConn.query("INSERT INTO users set ?", newUser, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
}


//GET ALL USERS
User.getAllUsers = function(result) {
    mysqlConn.query("Select * from users ", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


//GET USER BY ID
User.getUserById = function(userId, result) {
    mysqlConn.query("Select * from users where id = ? ", userId, function( err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


//GET USER BY EMAIL
User.getUserByEmail = function(userEmail, result) {
    mysqlConn.query("Select * from users where email = ? ", userEmail, function( err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


module.exports = User;