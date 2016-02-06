var express = require("express")
var request = require("request")

var restaurants = require("./restaurants.json")

var app = express()

app.use(express.static('public'))

app.get('/restaurant/:restaurant', function (req, res, next) {
  var restaurant = restaurants[req.params.restaurant]

  if (!restaurant) return next(new Error("Invalid restaurant"))

  request(restaurant.url, function (err, resp, body) {
    if (err) return next(new Error("Request error"))
    if (resp.statusCode !== 200) return next(new Error("Request not 200"))

    res.header("Content-Type", restaurant.format)
    res.send(body)
  })
})

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log("App listening on port", port);
})