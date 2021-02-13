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
    console.log('node is working! Hooray!')
});
app.get('/', function(request, responce){
    con.query(
        'SELECT * FROM category',
        function(error, result){
            if (error) throw error;
            //console.log(result);
            let goods = {}
            for (let i = 0; i < result.length; i++){
                goods[result[i]['id']] = result[i];
            }
            //console.log(goods);
            console.log(JSON.parse(JSON.stringify(goods)));
            responce.render('main', {
                foo: 'HEY LOSER',
                bar: 7,
                goods : JSON.parse(JSON.stringify(goods))
            });
        });
});



app.get('/cat', function(request, responce){
    console.log(request.query.id)
    let catId = request.query.id;

    // responce.render('cat', {});
    // con.query(
    //     'SELECT * FROM cSategory WHERE id='+catId,
    //     function(error, result){
    //         if (error) throw err;
    //         console.log(JSON.parse(JSON.stringify(result)));
    //         responce.render('main', {
    //             foo: 'HEY LOSER',
    //             bar: 7,
    //             goods : JSON.parse(JSON.stringify(goods))
    //         });
    //     });

    let cat = new Promise(function(resolve, reject){
        con.query(
            'SELECT * FROM category WHERE id='+catId,
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });


    let goods = new Promise(function(resolve, reject){
        con.query(
            'SELECT * FROM goods WHERE category_id='+catId+ ' ORDER BY RAND()',
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });

    Promise.all([cat,goods]).then(function(value){
        console.log(value[0]);
        responce.render('cat', {
                cat: JSON.parse(JSON.stringify(value[0])),
                goods: JSON.parse(JSON.stringify(value[1]))
            });
    })


});;

app.get('/shop', function(request, responce){
    console.log(request.query.id)
    let shopId = request.query.id;

    let shop = new Promise(function(resolve, reject){
        con.query(
            'SELECT * FROM shop WHERE id='+shopId,
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });


    let goods = new Promise(function(resolve, reject){
        con.query(
            'SELECT * FROM goods WHERE identification='+shopId,
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });

    Promise.all([shop,goods]).then(function(value){
        console.log(value[1]);
        responce.render('filter_shop', {
                shop: JSON.parse(JSON.stringify(value[0])),
                goods: JSON.parse(JSON.stringify(value[1]))
            });
    })


});;

app.get('/goods', function(request, responce){
    console.log(request.query.id);
    con.query('SELECT * FROM goods WHERE id='+request.query.id, function(error, result, fields){
        if (error) throw error;
        responce.render('goods',{ goods: JSON.parse(JSON.stringify(result)) });
    });
});
/* APP SEARCH */
app.get('/search', function (request, responce) {
    let namae = '%' + request.query.name + '%'
    console.log(namae)
    let goods = new Promise(function(resolve, reject){
        con.query(
            'SELECT * FROM goods WHERE name LIKE "'+namae+'%";',
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });

    Promise.all([goods]).then(function(value){
        console.log(value[0]);
        responce.render('search_engine', {
                goods: JSON.parse(JSON.stringify(value[0]))
            });
    }) 
 });
/* END */
app.post('/get-category-list', function (request, responce) {
   console.log('111');
   con.query('SELECT * FROM category', function(error, result, fields){
       if (error) throw error;
       console.log(result)
       responce.json(result);
   });  
});

app.post('/get-shop-list', function (request, responce) {
    console.log('222');
    con.query('SELECT * FROM shop', function(error, result, fields){
        if (error) throw error;
        console.log(result)
        responce.json(result);
    });  
 });






// const http = require('http');
// const fs = require('fs');
// http.createServer().listen(3000);
// http.createServer(function(request, responce){
//     responce.setHeader("Content-Type", "text/html; charset=utf-8;")
//     if (request.url == '/'){
//         responce.end('Основная страница <h2> OF MY LIFE </h2> Что я вообще вытворяю?');
    
//     } else if (request.url == '/cat'){
//         responce.end('Category');
//     } else if (request.url == '/database'){
//         let myFile = fs.readFileSync('picture.html');;
//         console.log(myFile);
//         responce.end(myFile);
//     } else if (request.url == '/secret'){
//         let FIL = fs.readFileSync('1.html');
//         console.log(FIL);
//         responce.end(FIL);
//     }
//     responce.end('Hello! <b> This </b> is your lucky day!');
// }).listen(3000);S


//app.get('/cat', function(request, responce){
//    responce.end('cat');
//});

