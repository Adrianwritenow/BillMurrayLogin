const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

//configure mustache
app.engine('mustache', mustacheExpress());
app.set ('views', './views');
app.set('view engine', 'mustache');

//configurebody parser
app.use(bodyParser.urlencoded({extended:false}));

//configure public to be staticlly served
app.use(express.static('public'));

app.use(session({
  secret: "2C44-4D44-WppQ38S",
  resave: false,
  saveUninitialized:true
}));

let randomImage =function(){
  var images = ["http://www.fillmurray.com/200/300","https://images-na.ssl-images-amazon.com/images/I/41oq%2BCg32iL._SY300_.jpg"];
  let randomIndex = (Math.random() > 0.5) ? 1:0;
  return images[randomIndex];
};

let captcha = {
  "http://www.fillmurray.com/200/300": 'billmurray',
  "https://images-na.ssl-images-amazon.com/images/I/41oq%2BCg32iL._SY300_.jpg":'notbillmurray'

}

//redirect to either restricted content or login page depending on login status
app.get('/', function(req,res){
  if (req.session && req.session.admin){
    res.redirect('/content');
  }else{
    res.redirect('/login');
  }
});
app.get('/login',function(req,res){
    res.render('login', {random: randomImage});

});

app.post('/login', function(req,res){
  console.log(req.body.guess);
console.log(req.body.displayedImg);
  let correctAnswer = captcha[req.body.displayedImg];
  if (req.body.guess === correctAnswer){
    req.session.admin = true;
    console.log(req.body.guess);
    res.redirect('/content');
  }
});

let auth = function(req,res,next){
  if (req.session && req.session.admin){
    return next();
  }else{
    return res.sendStatus(401);
  }
}

app.get('/content', auth, function(req,res){
  res.render('secret-murray');

});

app.post('/logout', function(req,res){
  req.session.desroy();
  res.render('logout');
})
app.listen(3000, function(){
  console.log('server farted');

});
