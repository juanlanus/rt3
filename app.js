/** Module dependencies  */
var express = require('express')
  , routes = require('./routes')
  , cors = require('cors')
  , user = require('./routes/user')
// http://stackoverflow.com/questions/16548586/adding-a-new-route-to-node-express
  , http = require('http')
  , path = require('path');


// FILES SERVER ****************************************************************
var appFiles = express();

// all environments
appFiles.set('port', process.env.PORT || 3000);

appFiles.set('views', __dirname + '/views');
appFiles.set('view engine', 'ejs');
appFiles.use(express.favicon());
// appFiles.use(express.logger('short'));
appFiles.use(express.bodyParser());
appFiles.use(express.methodOverride());
appFiles.use(express.cookieParser('your secret here'));
appFiles.use(express.session());
appFiles.use(appFiles.router);
appFiles.use(express.directory('../../doc'))
appFiles.use(express.static(path.join(__dirname, '../../doc')));

// development only
if ('development' == appFiles.get('env')) {
  appFiles.use(express.errorHandler());
}

appFiles.get('/', routes.index);
appFiles.get('/users', user.list);

http.createServer(appFiles).listen(appFiles.get('port'), function(){
  console.log('Express files server listening on port ' + appFiles.get('port'));
});



// DATA SERVER *****************************************************************
var appData = express();

// parse plain text request body
function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function(){
    next();
  });
}

// all environments
appData.set('port', 3333);
appData.use(express.logger('dev'));
// replaced by rawBody(): appData.use(express.bodyParser());
appData.use(rawBody);
appData.use(express.methodOverride());
// appData.use(express.cookieParser('your secret here'));
// appData.use(express.session());
appData.use(cors()); // automatically supports pre-flighting
appData.use(appData.router);
// development only
if ('development' == appData.get('env')) {
  appData.use(express.errorHandler());
}

appData.get('/storeActions', function(req, res, next){
  res.json({msg: 'This is CORS-enabled for all origins!'});
});

appData.put('/storeActions', routes.storeActions);

appData.get('/', function(req, res, next) {
  console.log( 'got the f* CORS thing!' );
});

appData.post('/', cors(), function(req, res, next) {
  console.log( 'posted the f* CORS thing!' );
});

http.createServer(appData).listen(appData.get('port'), function(){
  console.log('Express data server listening on port ' + appData.get('port'));
});
