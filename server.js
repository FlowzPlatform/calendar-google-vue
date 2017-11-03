const express = require('express')
var request = require("request");

const bodyParser = require('body-parser')
const webpack = require('webpack')
const config = require('./build/webpack.dev.conf')


const app = express()
const compiler = webpack(config)
const jsonParser = bodyParser.json()

// google client Id and clien secret
const clientId = 'Write google client id here'
const clientSecret = 'Write google client secret here'

var http = require('http').Server(app);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}))

// enable hot-reload and state-preserving
// compilation error display
app.use(require('webpack-hot-middleware')(compiler))

app.post('/getAccessToken', jsonParser, (req, res) => {
 console.log('req.body: ', req.body)
  var options = { method: 'POST',
  url: 'https://accounts.google.com/o/oauth2/token',
  headers: 
   { 
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { code: req.body.code,
     client_id: clientId,
     client_secret: clientSecret,
     redirect_uri: 'http://localhost:8080/oauthCallback',
     grant_type: 'authorization_code' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // console.log(body);
    res.send(body)
  });
})

app.post('/getTokenFromRefreshToken', jsonParser, (req, res) => {
  var options = { method: 'POST',
  url: 'https://www.googleapis.com/oauth2/v4/token',
  headers: 
   { 'content-type': 'application/x-www-form-urlencoded',
     'cache-control': 'no-cache' },
  form: 
   { client_id: clientId,
     client_secret: clientSecret,
     refresh_token: req.body.refresh_token,
     grant_type: 'refresh_token' } };

  request(options, function (error, response, body) {
    console.log('err:', error)
    if (error) throw new Error(error);

    res.send(body)
  });
})

//172.16.230.127
app.listen(8080, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:8080')
})
