var DOM_array = function (DOM) {
  return Array.prototype.slice.call(DOM, 0)
}

var handleErrors = function (response) {
    if (!response.ok) {
        throw Error(response.statusText)
    }

    return response
}

var responseText = function (response) {
  return response.text()
}

var createRestaurant = function (name, items_promise) {
  return {
    name: name,
    promise: items_promise,
    error: false,
    hidden: false
  }
}

var getRestaurants = function (date) {

  var restaurants = []

  // Kårresturangen
  restaurants.push(createRestaurant("Kårrestaurangen", fetch("/restaurant/karrestaurangen")
    .then(handleErrors)
    .then(responseText)
    .then(function (body) {
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
    })))

  // Einstein
  restaurants.push(createRestaurant("Einstein", fetch("/restaurant/einstein")
    .then(handleErrors)
    .then(responseText)
    .then(function (body) {
      var daysSwe = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
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
    })))

  // Linsen
  restaurants.push(createRestaurant("Linsen", fetch("/restaurant/linsen")
    .then(handleErrors)
    .then(responseText)
    .then(function (body) {
      var p = new DOMParser()
      var DOM = p.parseFromString(body, "text/xml")

      var DOM_items = DOM.querySelectorAll("item")

      var getItemDate = function (DOM_item) {
        var title = DOM_item.querySelector("title").textContent

        dateStr = title.replace("Meny Linsen - ", "")

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

        return food
      })
    })
    .then(function (items) {
      if (items.length === 0) return []

      items.push("Stående – Wokade nudlar med kyckling och grönsaker smaksatt med ingefära och chili. Alt. med tofu")
      items.push("Stående – Caesarsallad med kyckling, bacon, romansallad och krutonger samt dressing")

      return items
    })))

  // Tre Indier
  restaurants.push(createRestaurant("Tre Indier", new Promise(function (resolve, reject) {

    var menu = [
      null, // Sunday
      [
        "Kyckling tillredd i kryddstark masala-sky.",
        "Lamm marinerat i vitlök, ingefära och mandel. Serveras med lök, mandel, rostad koriandersås."
      ],
      [
        "Kycklinggryta med koriander och saffran.",
        "Lamm med spenat, ingefära och grön chilli."
      ],
      [
        "Kycklingbröst med pistage och tomatgräddsås",
        "Lammfärsbiffar med klyftpotatis samt kall myntayoghurt-sås. Mediumstark."
      ],
      [
        "Stark kycklingrätt med en doft av färska curryblad, brässerad i vinäger, farinsocker, nejlikor och svartpeppar.",
        "Fisk marinerad i citron, grön chilli och den heliga basilikan med senap/mango-sås."
      ],
      [
        "Kycklingrätt med sås på malabar, svartpeppar och cocos.",
        "Fläskfilé med rödvin/masalasås"
      ],
      null // Saturday
    ]

    var todays_menu = menu[date.getDay()]
    var standing = [
      "Stående – Vegetarisk tallrik med linser, tillagad färskost och grönsaksrätt samt raita. 69 kr",
      "Stående – Grillad kyckling som marinerats i lime, yoghurt samt tandori krydd-masala. Serveras med makhani-smör och tomatgräddsås. 79 kr",
      "Stående – Grillat kycklingbröst, marinerat med citron och yoghurt bräserad i cocos, grädde och spiskummin. 85 kr",
      "Stående – Senapskryddade räkor i het grön masala och cocossås. 99 kr"
    ]

    resolve(todays_menu && todays_menu.concat(standing) || [])
  })))

  // Indian Barbeque
  restaurants.push(createRestaurant("Indian Barbeque", new Promise(function (resolve, reject) {

    var menu = [
      null, // Sunday
      [
        "Tandoori Chicken Tikka: (mild) Grillad kycklingfilé serveras med en mild tandoori sås",
        "Tawa Gosht: (mellan stark) Grillad fläsk med indiska kryddor I en syrlig tomatsås"
      ],
      [
        "Makhni Murgh: (mild) Yoghurt och kumminmarinerad kycklingfilé serveras med mild tikka sås.",
        "TulsiMaachi: (mellan stark) Laxfilé marinerad i basilika, koriander och senap. Serveras i rostad vitlöksås"
      ],
      [
        "Chicken Rajwada: (mild) Kyckling tillagad i krämig tomatsås, kardemumma, bockhornsklöver, och cashewnötter.",
        "Lamm Mirch Gost: (mellan stark) Lamm tillagad i en peppar- löksås och salanmirch"
      ],
      [
        "Malwani Murgh: (mellan stark) Kyckling tillagad med en speciell malwanimasala, tamarind och kokos.",
        "Bengali Ghost: (mellan stark) Grillad fläsk serveras i en syrlig tomat och rödvin sås med gul senap."
      ],
      [
        "DumkiHandi: (mild) Kyckling tillagad i tomat, fänkål och kummin sås.",
        "Kashmiri Lamm Kofta: (mellan stark) Lammfärs bullar med smakrika kryddor I en  krämig tomatsås."
      ],
      null // Saturday
    ]

    var todays_menu = menu[date.getDay()]
    var standing = [
      "Stående – Subzi Thaali: Vegetarisk tallrik med tre rätter.",
      "Stående – Tulsi Maachi: (mellan stark) Laxfilé marinerad i basilika, koriander och senap. Serveras i rostad vitlöksås. 99 kr",
      "Stående – Jhinga Balchao: räkor med tomat,chilli,rödvin och basilika. 109 kr",
      "Stående – Lamm korma: En mild lammrätt tillagade med kokosgrädde och kardemumma. 109 kr",
    ]

    resolve(todays_menu && todays_menu.concat(standing) || [])
  })))

  // Express
  restaurants.push(createRestaurant("Express", fetch("/restaurant/express")
    .then(handleErrors)
    .then(responseText)
    .then(function (body) {
      var daysSwe = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
      var p = new DOMParser()
      var DOM = p.parseFromString(body, "text/html")

      var DOM_items = DOM.querySelectorAll(".swedish-menu .week-day")

      var DOM_item_today = DOM_array(DOM_items).filter(function (DOM_item) {
        var daySwe = DOM_item.querySelector("h2").textContent
        var day = daysSwe.indexOf(daySwe)

        return day === date.getDay()
      })[0]

      if (!DOM_item_today) return []

      var DOM_foods = DOM_item_today.querySelectorAll(".dish .dish-name")

      return DOM_array(DOM_foods).map(function (DOM_food) {
        var type = DOM_food.previousElementSibling.textContent

        if (DOM_food.previousElementSibling.textContent !== "Express") {
          return "Vegetarisk – " + DOM_food.textContent
        }

        return DOM_food.textContent
      })
    })))

  return restaurants
}