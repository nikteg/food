var express = require("express")
var request = require("request")

var restaurants = require("./restaurants.json")

var app = express()

app.use(express.static('public'))

app.get('/restaurant/:restaurant', function (req, res) {
  var restaurant = restaurants[req.params.restaurant]

  if (!restaurant) return console.error(restaurant)

  request(restaurant.url, function (err, resp, body) {
    if (err) return console.error(url, err)
    if (resp.statusCode !== 200) return console.error(url, resp.statusCode)

    res.header("Content-Type", restaurant.format)
    res.send(body)
  })
})

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log("App listening on port 3000!");
})