var express = require("express")
var hbs = require("hbs")
var harp = require("harp")
var path = require("path")
var cors = require("cors")
var find = require("lodash").find
var app = express()
app.set("view engine", "hbs")
app.set("port", (process.env.PORT || 5000))
app.use(express.static(__dirname + "/public"))
app.use(harp.mount(__dirname + "/public"))
hbs.registerPartials(__dirname + "/views/partials")
hbs.registerHelper("equal", require("handlebars-helper-equal"))

// Fetch all the content, and convert Base64-encoded
// content back to regular strings
var content = require(path.resolve(__dirname, "content.json"))
content.pages = content.pages.map(function(page) {
  page.content = (new Buffer(page.content, "base64")).toString()
  return page
})

app.get("/content.json", cors(), function(req, res) {
  res.json(content)
})

app.get("/*", function(req, res) {
  var page = find(content.pages, function(page) {
    return page.href === req.path
  })

  console.log(content)
  res.render("page", {
    page: page,
    content: content
  })
})

app.listen(app.get("port"), function() {
  console.log("Running at localhost:" + app.get("port"))
})