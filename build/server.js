"use strict";

var _store = require("./store.js");

var _store2 = _interopRequireDefault(_store);

var _socketing = require("./socketing.js");

var _socketing2 = _interopRequireDefault(_socketing);

var _adminsocketing = require("./adminsocketing.js");

var _adminsocketing2 = _interopRequireDefault(_adminsocketing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-console: 0 */

var express = require("express");
var path = require("path");
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../webpack.config.js');
var bodyParser = require("body-parser");
var message = require('./message.js');
var image = require('./image.js');
var db = require("./db.js");


var store = (0, _store2.default)();
store.dispatch({ type: "INIT" });
(0, _socketing2.default)(store);

var adminStore = (0, _store2.default)();
adminStore.dispatch({ type: "INIT" });
(0, _adminsocketing2.default)(adminStore);

var PARENT_DIR = path.join(__dirname, '..');

var isDeveloping = (process.env.NODE_ENV || "").trim() !== "production";
var port = isDeveloping ? 3001 : process.env.PORT;
var app = express();

var multer = require('multer'); // v1.0.5
var upload = multer({
  storage: multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, path.join(PARENT_DIR, 'public', 'images'));
    },
    filename: function filename(req, file, cb) {
      var ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    }
  }),
  limits: { fieldSize: 6000000, files: 1 }
}); // for parsing multipart/form-data

console.log("process.env.NODE_ENV=[" + process.env.NODE_ENV + "]");
console.log("isDeveloping=" + isDeveloping);

app.use(bodyParser.urlencoded({ extended: false }));

if (isDeveloping) {
  (function () {
    console.log("Development mode");
    var compiler = webpack(config);
    var middleware = webpackMiddleware(compiler, {
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
    app.use('/subimage', express.static("C:\\dev\\celebkiosk\\public\\images"));
    app.get('/', function response(req, res) {
      res.write(middleware.fileSystem.readFileSync(path.join(PARENT_DIR, 'dist/index.html')));
      res.end();
    });
    app.get('/admin', function response(req, res) {
      res.write(middleware.fileSystem.readFileSync(path.join(PARENT_DIR, 'dist/admin.html')));
      res.end();
    });
  })();
} else {
  app.use(express.static(PARENT_DIR + '/dist'));
  app.use(express.static(PARENT_DIR + '/public'));
  app.use('/subimage', express.static("C:\\dev\\celebkiosk\\public\\images"));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(PARENT_DIR, "dist/index.html"));
  });
  app.get('/admin', function response(req, res) {
    res.sendFile(path.join(PARENT_DIR, "dist/admin.html"));
  });
}

app.post("/kiosk/message", function (req, res) {
  var msg = req.body.message || "";
  msg = msg.trim();
  if (msg.length == 0 || msg.length > 140) {
    res.send("OK");
    res.end();
    return;
  }

  message.submit(req, res, msg).then(function () {
    res.send("OK");
    res.end();
  });
});

app.post("/api/message", function (req, res) {
  var id = req.body.message || "";
  var status = req.body.status || 0;
  if (id && status) {
    if (+status === 1) {
      message.approve(id).then(function () {
        res.send("OK");
        res.end();
      });
    } else if (+status === 2) {
      message.reject(id).then(function () {
        res.send("OK");
        res.end();
      });
    }
  } else {
    res.send("NOTOK");
    res.end();
  }
});

app.post("/api/image", function (req, res) {
  var id = req.body.image || "";
  var status = req.body.status || 0;
  if (id && status) {
    if (+status === 1) {
      image.approve(id).then(function () {
        res.send("OK");
        res.end();
      });
    } else if (+status === 2) {
      image.reject(id).then(function () {
        res.send("OK");
        res.end();
      });
    }
  } else {
    res.send("NOTOK");
    res.end();
  }
});

app.post("/kiosk/image", upload.single("image"), function (req, res) {
  if (req.file) {
    image.submit(req, res, req.file).then(function () {
      console.log("Got file");
      res.send("OK");
      res.end();
    });
  } else {
    console.log("no file!");
    res.send("NOT OK");
  }
});

app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info("Server running on port " + port + " public path " + config.output.publicPath);
});

db.getLatestApprovedMessages(10).then(function (cursor) {
  cursor.each(function (err, row) {
    console.log(row);
    store.dispatch({ type: "MESSAGE_CHANGES", changes: row });
  });
});

db.getLatestApprovedImages(5).then(function (cursor) {
  cursor.each(function (err, row) {
    console.log(row);
    store.dispatch({ type: "IMAGE_CHANGES", changes: row });
  });
});

db.getPendingMessages(50).then(function (cursor) {
  cursor.each(function (err, row) {
    console.log(row);
    adminStore.dispatch({ type: "MESSAGE_CHANGES", changes: row });
  });
});

db.getPendingImages(30).then(function (cursor) {
  cursor.each(function (err, row) {
    console.log(row);
    adminStore.dispatch({ type: "IMAGE_CHANGES", changes: row });
  });
});
//# sourceMappingURL=server.js.map