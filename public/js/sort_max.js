let express = require('express')
let app = express();
/**
 * public - name of folder
 */
app.use(express.static('public'));

app.set('view engine', 'pug');


let mysql = require('mysql');

let con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'anishop'
});
app.listen(3000, function(){
    console.log('Sort max is activated!')
});

