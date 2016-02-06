var DOM_array = function (DOM) {
  return Array.prototype.slice.call(DOM, 0)
}

var getRestaurants = function (date) {

  var restaurants = []

  // Kårresturangen
  restaurants.push(new Promise(function (resolve, reject) {
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

      if (!DOM_item_today) return []

      var DOM_foods = DOM_item_today.querySelectorAll("tr")

      return DOM_array(DOM_foods).map(function (DOM_food) {
        var name = DOM_food.querySelector("b").textContent
        var food = DOM_food.querySelectorAll("td")[1].textContent

        return name + " – " + food
      })
    }).catch(function (err) {
      console.error("Could not fetch and/or parse", fetch_url)

      return []
    }).then(function (items) {
      resolve({
        name: "Kårrestaurangen",
        items: items
      })
    })
  }))

  // Einstein
  restaurants.push(new Promise(function (resolve, reject) {
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

      if (!DOM_item_today) return []

      var DOM_foods = DOM_item_today.querySelectorAll("p")

      return DOM_array(DOM_foods).map(function (DOM_food) {
        return DOM_food.textContent.trim()
      }).filter(function (item) {
        return item !== ""
      })
    }).catch(function (err) {
      console.error("Could not fetch and/or parse", fetch_url)

      return []
    }).then(function (items) {
      resolve({
        name: "Einstein",
        items: items
      })
    })
  }))

  // Tre Indier
  restaurants.push(new Promise(function (resolve, reject) {
    var fetch_url = "/restaurant/treindier"

    var daysSwe = ["Sondag", "Mandag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lordag"]

    fetch(fetch_url).then(function (res) {

      return res.arrayBuffer()
    }).then(function (body) {

      return PDFJS.getDocument(body)
    }).then(function(pdf) {

      return pdf.getPage(1)
    }).then(function(page) {

      return page.getTextContent()
    }).then(function(text_content) {
      var PDF_items = text_content.items

      var items = []

      for (var index = 0; index < PDF_items.length; index++) {
        var PDF_item = PDF_items[index]

        if (daysSwe.indexOf(PDF_item.str) === date.getDay()) {
          Array.prototype.push.apply(items, [
            PDF_items[index + 2].str,
            PDF_items[index + 4].str
          ])
        } else if (PDF_item.str === "Staende Alternativ") {
          Array.prototype.push.apply(items, [
            PDF_items[index + 2].str,
            PDF_items[index + 4].str,
            PDF_items[index + 6].str,
            PDF_items[index + 8].str
          ])
        }
      }

      return items
    }).catch(function (err) {
      console.log(err)
      console.error("Could not fetch and/or parse", fetch_url)

      return []
    }).then(function (items) {
      resolve({
        name: "Tre Indier",
        items: items
      })
    })
  }))

  return Promise.all(restaurants)
}