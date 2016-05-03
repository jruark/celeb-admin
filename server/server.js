/* eslint no-console: 0 */

const express = require("express");
const path = require("path");
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const bodyParser = require("body-parser");
const message = require('./message.js');
const image = require('./image.js');
const db = require("./db.js");
import makeStore from "./store.js";
import startServer from './socketing.js';
import startAdminServer from './adminsocketing.js';

const store = makeStore();
store.dispatch({type:"INIT"});
startServer(store);

const adminStore = makeStore();
adminStore.dispatch({type:"INIT"});
startAdminServer(adminStore);

const PARENT_DIR = path.join(__dirname, '..');

const isDeveloping = (process.env.NODE_ENV || "").trim() !== "production";
const port = isDeveloping ? 3001 : process.env.PORT;
const app = express();

const IMAGE_PATH = process.env.CELEB_IMAGE_PATH;

const multer = require('multer'); // v1.0.5
var upload = multer(
  {
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(PARENT_DIR, 'public', 'images'));
      },
      filename: function(req, file, cb) {
        var ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
      }
    }),
    limits: { fieldSize: 6000000, files: 1 }
  }
); // for parsing multipart/form-data

console.log("process.env.NODE_ENV=[" + process.env.NODE_ENV + "]");
console.log("isDeveloping=" + isDeveloping);

app.use(bodyParser.urlencoded({extended:false}));

if( isDeveloping) {
  console.log("Development mode");
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'app',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(PARENT_DIR + '/public'));
  app.use('/subimage', express.static(IMAGE_PATH));
  app.get('/', function response(req,res) {
    res.write(middleware.fileSystem.readFileSync(path.join(PARENT_DIR, 'dist/index.html')));
    res.end();
  });
  app.get('/admin', function response(req,res) {
    res.write(middleware.fileSystem.readFileSync(path.join(PARENT_DIR, 'dist/admin.html')));
    res.end();
  });
}
else {
  app.use(express.static(PARENT_DIR + '/dist'));
  app.use(express.static(PARENT_DIR + '/public'));
  app.use('/subimage', express.static("C:\\dev\\celebkiosk\\public\\images"));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(PARENT_DIR, "dist/index.html"));
  });
  app.get('/admin', function response(req,res) {
    res.sendFile(path.join(PARENT_DIR, "dist/admin.html"));
  });
}


app.post("/kiosk/message", function(req,res) {
  var msg = req.body.message || "";
  msg = msg.trim();
  if(msg.length==0 || msg.length>140) {
    res.send("OK");
    res.end();
    return;
  }

  message.submit(req, res, msg).then(function() {
      res.send("OK");
      res.end();
  });
});

app.post("/api/message", function(req,res) {
  var id = req.body.message || "";
  var status = req.body.status || 0;
  if(id && status) {
    if(+status===1) {
      message.approve(id).then(function() {
        res.send("OK");
        res.end();
      });
    }
    else if(+status===2) {
      message.reject(id).then(function() {
        res.send("OK");
        res.end();
      });
    }
  }
  else {
    res.send("NOTOK");
    res.end();
  } 
});

app.post("/api/image", function(req,res) {
  var id = req.body.image || "";
  var status = req.body.status || 0;
  if(id && status) {
    if(+status===1) {
      image.approve(id).then(function() {
        res.send("OK");
        res.end();
      });
    }
    else if(+status===2) {
      image.reject(id).then(function() {
        res.send("OK");
        res.end();
      });
    }
  }
  else {
    res.send("NOTOK");
    res.end();
  } 
});

app.post("/kiosk/image", upload.single("image"), function(req,res) {
  if(req.file) {
    image.submit(req, res, req.file).then(function() {
      console.log("Got file");
      res.send("OK");
      res.end();
    });
  }
  else {
    console.log("no file!");
    res.send("NOT OK");
  }
});

app.listen(port, function onStart(err) {
  if(err) {
    console.log(err);
  }
	console.info("Server running on port " + port + " public path " + config.output.publicPath);
});

db.getLatestApprovedMessages(10).then(function(cursor) {
  cursor.each(function(err, row) {
    console.log(row);
    store.dispatch({type:"MESSAGE_CHANGES", changes:row});    
  });
});

db.getLatestApprovedImages(5).then(function(cursor) {
  cursor.each(function(err, row) {
    console.log(row);
    store.dispatch({type:"IMAGE_CHANGES", changes:row});    
  });
});

db.getPendingMessages(50).then(function(cursor) {
  cursor.each(function(err, row) {
    console.log(row);
    adminStore.dispatch({type:"MESSAGE_CHANGES", changes:row});    
  });
});

db.getPendingImages(30).then(function(cursor) {
  cursor.each(function(err, row) {
    console.log(row);
    adminStore.dispatch({type:"IMAGE_CHANGES", changes:row});    
  });
});
