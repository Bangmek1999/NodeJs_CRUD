let mysql = require('mysql');
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs_crud"
})
connection.connect((error) => {
    if (!!error) {
        console.log(error);
    } else {
        console.log("Database is connect");
    }
})
module.exports = connection;