<app>
  <h1>{ today }</h1>
  <select onchange="{ changeDate }">
    <option value="1">Måndag</option>
    <option value="2">Tisdag</option>
    <option value="3">Onsdag</option>
    <option value="4">Torsdag</option>
    <option value="5">Fredag</option>
    <option value="6">Lördag</option>
    <option value="0">Söndag</option>
  </select>
  <ul>
    <li class="restaurant" each="{ restaurant in restaurants }">
      <h3 onclick="{ parent.toggle }">{ restaurant.hidden && "+" || "-" } { restaurant.name }</h3>
      <ul class="{ hidden: restaurant.hidden }">
        <li if="{ restaurant.items.length === 0 }">Ingen lunch idag</li>
        <li each="{ item in restaurant.items }">
          { item }
        </li>
      </ul>
    </li>
  </ul>
  <div id="footer">
    <p><a href="https://github.com/bipshark/food">Vill du lägga till din restaurang? Laddar inte sidan?</a></p>
  </div>
  <script>
    var dayNames = [
      "Söndag", "Måndag", "Tisdag",
      "Onsdag", "Torsdag", "Fredag",
      "Lördag"
    ]

    var monthNames = [
      "januari", "februari", "mars",
      "april", "maj", "juni", "juli",
      "augusti", "september", "oktober",
      "november", "december"
    ]

    this.today = dayNames[this.opts.date.getDay()] + ", "
      + this.opts.date.getDate() + " "
      + monthNames[this.opts.date.getMonth()]

    var hiddens = localStorage.getItem("hiddens") || []

    this.restaurants = opts.restaurants.map(function (item, index) {
      item.hidden = (hiddens.indexOf(index) !== -1)

      return item
    })

    changeDate (e) {
      window.location.href = "?day=" + e.target.value
    }

    toggle (e) {
      var index = this.restaurants.indexOf(e.item.restaurant)
      this.restaurants[index].hidden = !this.restaurants[index].hidden

      var hiddens = this.restaurants.map(function (item, index) {
        return { hidden: item.hidden, index: index }
      }).filter(function (item) {
        return item.hidden
      }).map(function (item) {
        return item.index
      })

      localStorage.setItem("hiddens", hiddens)
    }

    this.on("mount", function() {
      this.root.querySelector("select").value = this.opts.date.getDay()
    })
  </script>
</app>
