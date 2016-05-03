const r = require("rethinkdb");
const dbname = "celeb";
r.connect({
  host: 'localhost', port: 28015
}, function(err, conn) {
  if(err) throw err;
  console.log("Creating database.");
  r.dbCreate(dbname).run(conn)
  .then(function(res) {
    console.log("Created database.");
    console.log("Creating Messages");
    return r.db(dbname).tableCreate("Messages").run(conn);
  })
  .then(function() {
    return r.db(dbname).table("Messages").indexCreate("statusAndDate", [r.row("status"), r.row("date")]).run(conn);
  })
  .then(function(res) {
    console.log("Creating Announcements");
    return r.db(dbname).tableCreate("Announcements").run(conn);
  })
  .then(function(res) {
    console.log("Creating Images");
    return r.db(dbname).tableCreate("Images").run(conn);
  })
  .then(function() {
    return r.db(dbname).table("Images").indexCreate("statusAndDate", [r.row("status"), r.row("date")]).run(conn);
  })
  .then(function(res) {
    process.exit(0);
  });
});
