var express = require('express')
var app = express();
//var async = require('asyncawait/async');
//var await = require('asyncawait/await');
/**
 * public - name of folder
 */
var zakaz = 1
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json())
const mysql = require('mysql2');
let moment = require('moment');
process.env["NODER_TLS_REJECT_UNAUTHORIZED"] = 0;
const nodemailer = require('nodemailer')
const con = mysql.createConnection({
    host: 'localhost',
    user: 'a0522994_goodboy',
    password: 'jVBQLpmL',
    database: 'a0522994_anishop'
});
app.listen(80);
app.get('/', function (req, res) {
  let cat = new Promise(function (resolve, reject) {
    con.query(
      "SELECT * FROM goods WHERE isindex = 1",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  let catDescription = new Promise(function (resolve, reject) {
    con.query(
      "SELECT * FROM category",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  Promise.all([cat, catDescription]).then(function (value) {
    console.log(value[1]);
    res.render('index', {
      goods: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[1])),
    });
  });
});

  app.get('/cat', function (req, res) {
    console.log(req.query.id);
    let catId = req.query.id;
  
    let cat = new Promise(function (resolve, reject) {
      con.query(
        'SELECT * FROM category WHERE id=' + catId,
        function (error, result) {
          if (error) reject(error);
          resolve(result);
        });
    });
    let goods = new Promise(function (resolve, reject) {
      con.query(
        'SELECT * FROM goods WHERE category_id=' + catId,
        function (error, result) {
          if (error) reject(error);
          resolve(result);
        });
    });
  
    Promise.all([cat, goods]).then(function (value) {
      res.render('cat', {
        cat: JSON.parse(JSON.stringify(value[0])),
        goods: JSON.parse(JSON.stringify(value[1]))
      });
    })
  });

app.get('/shop', function(request, responce){
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
            'SELECT * FROM goods WHERE identification='+shopId+' ORDER BY name',
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });

    Promise.all([shop,goods]).then(function(value){
        responce.render('filter_shop', {
                shop: JSON.parse(JSON.stringify(value[0])),
                goods: JSON.parse(JSON.stringify(value[1]))
            });
    })


});;

app.get('/goods', function (req, res) {
    console.log(req.query.id);
    con.query('SELECT * FROM goods WHERE id=' + req.query.id, function (error, result, fields) {
      if (error) throw error;
      res.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
    });
  });

app.get('/order', function (req, res) {
  res.render('order');
});

app.get('/agreement', function (req, res) {
  res.render('agreement');
});
  
/* APP SEARCH */
app.get('/search', function (request, responce) {
    let namae = '%' + request.query.name + '%'
    let namae_2 = request.query.name
    console.log(namae)
    let goods = new Promise(function(resolve, reject){
        con.query(
            'SELECT * FROM goods WHERE name LIKE "'+namae+'%"'+' ORDER BY RAND()',
            function(error, result){
                if (error) reject(error);
                resolve(result);
            });
    });

    Promise.all([goods]).then(function(value){
        responce.render('search_engine', {
                goods: JSON.parse(JSON.stringify(value[0]))
            });
    }) 
 });
/* END */
app.post('/get-category-list', function (request, responce) {
   con.query('SELECT * FROM category', function(error, result, fields){
       if (error) throw error;
       console.log(result)
       responce.json(result);
   });  
});

app.post('/get-shop-list', function (request, responce) {
    con.query('SELECT * FROM shop', function(error, result, fields){
        if (error) throw error;
        console.log(result)
        responce.json(result);
    });  
 });

 app.post('/get-goods-info', function (req, res) {
  if (req.body.key.length !=0){
    con.query('SELECT id,name,cost, shop_id, ref_link FROM goods WHERE id IN ('+req.body.key.join(',')+')', function (error, result, fields) {
      if (error) throw error;
      console.log(result);
      let goods = {};
      for (let i = 0; i < result.length; i++){
        goods[result[i]['id']] = result[i];
      }
      res.json(goods);
    });
  }
  else{
    res.send('0');
  }
});

app.post('/finish-order', function(req, res){
  if (req.body.key.length != 0){
    let key = Object.keys(req.body.key);
    con.query('SELECT id,name,cost, shop_id, ref_link FROM goods WHERE id IN ('+ key.join(',')+')', function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    sendMail(req.body, result).catch(console.error);
    saveOrder(req.body, result);
    res.send('1');
    });
  }
  else{
    res.send('0');
  }
});

function saveOrder(data, result) {
  let sql;
    sql = "INSERT INTO user_info (user_name, user_surname,user_phone, user_email,address) VALUES ('" + data.username + "', '" + data.surname + "','" + data.phone + "', '" + data.email + "','" + data.address + "')";
  con.query(sql, function (error, result) {
    if (error) throw error;
  });

  var date = moment().format('MMMM Do YYYY, h:mm:ss a');
  for (let i = 0; i < result.length; i++) {
    sql = "INSERT INTO shop_order (user_id, goods_id, goods_cost, goods_amount, total, date, link) VALUES (" + 45 + ", " + result[i]['id'] + ", " + result[i]['cost'] + "," + data.key[result[i]['id']] + "," + data.key[result[i]['id']] * result[i]['cost'] + ", '" + date + "', '" + result[i]['ref_link'] + "')";
    con.query(sql, function (error, result) {
      if (error) throw error;
    });
  }
}

async function sendMail(data, result){
  let res = '<h2> Заказ из Anishopu </h2>';
  let total = 0;
  for (let i = 0; i < result.length; i++){
    res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost']*data.key[result[i]['id']]} ₽ </p>`;
    total+=result[i]['cost'] * data.key[result[i]['id']];
  }
  console.log(res);
  res +='<hr>';
  res+=`Итого ${total} ₽`;
  res += `<hr> Имя: ${data.username}`;
  res += `<hr> Фамилия: ${data.surname}`;
  res += `<hr> Телефон: ${data.phone}`;
  res += `<hr> Электронная почта: ${data.email}`;
  res += `<hr> Адрес: ${data.address}`;
  res += '<p><span style="font-family:Comic Sans MS,cursive"> В случае проблем пишите на '
  res += '<a href="mailto:support:anishopu.ru">support:anishopu.ru</a></p>'

let transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "robot@anishopu.ru", // generated ethereal user
    pass: "ZzGMc4uEBHRc4tD" // generated ethereal password
  }
});
let info = await transporter.sendMail({
  from : '<robot@anishopu.ru',
  to : data.email,
  subject: "Заказ принят",
  text: 'Здравствуйте',
  html : res 
});
  let manager = '<h1 style="text-align:center"><span style="font-family:Verdana,Geneva,sans-serif">Специально для менеджера</span></h1> ';
  var date = moment().format('MMMM Do YYYY, h:mm:ss a');
  let total_2 = 0
  manager+='<p><span style="font-family:Comic Sans MS,cursive">Клиент сделал заказ №'
  manager+=zakaz
  manager+=' '
  manager+=date
  manager+='</span></p>'
  manager+='<p><span style="font-family:Comic Sans MS, cursive">Состав заказа:</span></p><ul>'
  for (let i = 0; i < result.length; i++){
    manager += `<li><span style="font-family:Comic Sans MS, cursive">${result[i]['name']} в количестве ${data.key[result[i]['id']]} на общую сумму ${result[i]['cost']*data.key[result[i]['id']]} ₽ (ссылка &ndash;&nbsp;${result[i]['ref_link']})</span></li>`;
    total_2+=result[i]['cost'] * data.key[result[i]['id']];
  }
  manager+='</ul>'
  manager+='<p><span style="font-family:Comic Sans MS,cursive">Просьба обеспечить своевременную связь с клиентом для уточнения правильности данных.</span></p><p><span style="font-family:Comic Sans MS, cursive">Данные для связи:</span></p>'
  manager+='<ul>'
	manager+=`<li><span style="font-family:Comic Sans MS,cursive">Имя &ndash; ${data.username}</span></li>`
    manager+=`<li><span style="font-family:Comic Sans MS,cursive">Фамилия &ndash; ${data.surname}</span></li>`
	manager+=`<li><span style="font-family:Comic Sans MS, cursive">Телефон &ndash;&nbsp;${data.phone}</span></li>`
	manager+=`<li><span style="font-family:Comic Sans MS, cursive">Адрес электронной почты &ndash;&nbsp;${data.email}</span></li>`
	manager+=`<li><span style="font-family:Comic Sans MS,cursive">Адрес проживания &ndash; ${data.address}</span></li>`
  manager+='</ul><p><span style="color:#e74c3c"><span style="font-family:Comic Sans MS,cursive">Напоминаю, что в соответствии правилам внутреннего распорядка за уклонение от работы, сотруднику грозить штраф в размере половины заработной платы, а за повторное &ndash; увольнение!</span></span></p><p style="text-align:right">С уважением,</p><p style="text-align:right">Инспектор Робот!</p>'
  let inspector = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "inspector@anishopu.ru", // generated ethereal user
      pass: "letmespeakfrommyheart" // generated ethereal password
    }
  });
  let alert = await inspector.sendMail({
    from : '<inspector@anishopu.ru',
    to : 'kamalovantoshka2018@gmail.com',
    subject: "НОВЫЙ ЗАКАЗ №"+zakaz,
    text: 'Активируй html для прочтения',
    html : manager 
  });
  zakaz+=1;
console.log("MessageSent: %s", info.messageId);
module.exports = app;
return true;
}