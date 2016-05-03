const r = require('rethinkdb');

var connect = function () {
  return r.connect({
    host: 'localhost', port: 28015, db: "celeb"
  });
}

var getLatestApprovedMessages = function (maxRows) {
  return connect().then(function(conn) {
    return r.table("Messages").orderBy({index: r.desc('statusAndDate')}).filter(r.row("status").eq(1)).limit(maxRows).changes({includeInitial:true,includeTypes:true,includeOffsets:true,squash:false}).run(conn);
  });
}

var getLatestApprovedImages = function (maxRows) {
  return connect().then(function(conn) {
    return r.table("Images").orderBy({index: r.desc('statusAndDate')}).filter(r.row("status").eq(1)).limit(maxRows).changes({includeInitial:true,includeTypes:true,includeOffsets:true,squash:false}).run(conn);
  });
}

var getPendingImages = function(maxRows) {
  return connect().then(function(conn) {
    return r.table("Images").orderBy({index: 'statusAndDate'}).filter(r.row("status").eq(0)).limit(maxRows).changes({includeInitial:true,includeTypes:true,includeOffsets:true,squash:false}).run(conn);
  });
}

var getPendingMessages = function(maxRows) {
  return connect().then(function(conn) {
    return r.table("Messages").orderBy({index: 'statusAndDate'}).filter(r.row("status").eq(0)).limit(maxRows).changes({includeInitial:true,includeTypes:true,includeOffsets:true,squash:false}).run(conn);
  });
}

exports.connect = connect;
exports.getLatestApprovedMessages = getLatestApprovedMessages;
exports.getPendingMessages = getPendingMessages;
exports.getLatestApprovedImages = getLatestApprovedImages;
exports.getPendingImages = getPendingImages;
