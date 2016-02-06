var DOM_array = function (DOM) {
  return Array.prototype.slice.call(DOM, 0)
}

var getRestaurants = function (date) {

  var restaurants = [

    // Kårresturangen
    new Promise(function (resolve, reject) {
      var fetch_url = "/restaurant/karrestaurangen"

      fetch(fetch_url).then(function (res) {
        return res.text()
      }).then(function (body) {

        var p = new DOMParser()
        var DOM = p.parseFromString(body, "text/xml")

        var DOM_items = DOM.querySelectorAll("item")

        var getItemDate = function (DOM_item) {
          var title = DOM_item.querySelector("title").textContent

          dateStr = title.replace("Meny Kårrestaurangen - ", "")

          return new Date(dateStr)
        }

        var DOM_item_today = DOM_array(DOM_items).filter(function (DOM_item) {
          return getItemDate(DOM_item).getDay() === date.getDay()
        })[0]

        var items = []

        if (DOM_item_today) {
          var DOM_foods = DOM_item_today.querySelectorAll("tr")

          items = DOM_array(DOM_foods).map(function (DOM_food) {
            var name = DOM_food.querySelector("b").textContent
            var food = DOM_food.querySelectorAll("td")[1].textContent

            return name + " – " + food
          })
        }

        var restaurant = {
          name: "Kårrestaurangen",
          items: items
        }

        resolve(restaurant)
      })
    }),

    // Einstein
    new Promise(function (resolve, reject) {
      var fetch_url = "/restaurant/einstein"

      var daysSwe = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]

      fetch(fetch_url).then(function (res) {
        return res.text()
      }).then(function (body) {
        var p = new DOMParser()
        var DOM = p.parseFromString(body, "text/html")

        var DOM_items = DOM.querySelectorAll(".node-lunchmeny .content .field-day")

        var DOM_item_today = DOM_array(DOM_items).filter(function (DOM_item) {
          var daySwe = DOM_item.querySelector("h3").textContent
          var day = daysSwe.indexOf(daySwe)

          return day === date.getDay()
        })[0]

        var items = []

        if (DOM_item_today) {
          var DOM_foods = DOM_item_today.querySelectorAll("p")

          items = DOM_array(DOM_foods).map(function (DOM_food) {
            return DOM_food.textContent.trim()
          }).filter(function (item) {
            return item !== ""
          })
        }

        var restaurant = {
          name: "Einstein",
          items: items
        }

        resolve(restaurant)
      })
    })
  ]

  return Promise.all(restaurants)
}