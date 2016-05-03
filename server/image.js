const r = require('rethinkdb');
const db = require('./db.js');

var submitImage = function(req, res, file) {
    return new Promise(function(resolve, reject) {
        // check image size and reject if necessary
        if(file.size>6000000) {
            reject("BIG");
            return;
        }
        
        console.log("File info: " + JSON.stringify(file));
        
        // create image record pointing to file name
        var img = {
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            date: new Date(),
            status: 0,
            ip: req.ip,
            host: req.hostname
        };
        db.connect().then(function(conn) {
        r.table("Images").insert(img).run(conn)
            .then(function(dbres) {
                //TODO: Check for error
                console.log("Inserted image [" + file.filename + "] at " + img.date);
                resolve("OK");
            });
        });
    });
}

var changeStatus = function(imgid, status) {
    return new Promise(function(resolve, reject) {
        db.connect().then(function(conn) {
            r.table("Images").get(imgid).update({status: status})
                .run(conn)
                .then(function(dbres) {
                   console.log("Changed image status [" + imgid + "] to " + status);
                   resolve("OK"); 
                });
        });
    });
}

var approveImage = function(imgid) {
    return changeStatus(imgid, 1);
}

var rejectImage = function(imgid) {
    return changeStatus(imgid, 2);
}

var processImageChanges = function(state, changes) {
    var imglist = state.get("Images");
    var changed = false;
    if(changes.old_offset || changes.old_offset===0) {
        imglist=imglist.delete(changes.old_offset);
        changed = true;
        console.log("Removing image " + changes.old_offset);
    }
    if(changes.new_offset || changes.new_offset===0) {
        imglist = imglist.insert(changes.new_offset, changes.new_val);
        changed = true;
        console.log("Adding image " + changes.new_offset);
    }
    if(changed) {
        return state.set("Images", imglist);        
    }
    return state;
}


exports.submit = submitImage;
exports.approve = approveImage;
exports.reject = rejectImage;
exports.processImageChanges = processImageChanges;
