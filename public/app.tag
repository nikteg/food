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
    <li each="{ restaurant in restaurants }">
      <h3>{ restaurant.name }</h3>
      <ul>
        <li if="{ restaurant.items.length === 0 }">Ingen lunch idag</li>
        <li each="{ item in restaurant.items }">
          { item }
        </li>
      </ul>
    </li>
  </ul>
  <div id="footer">
    Powered by <img src="http://riotjs.com/img/logo/riot60x.png" alt="RIOT.js" />
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
      + this.opts.date.getDay() + " "
      + monthNames[this.opts.date.getMonth()]

    this.restaurants = opts.restaurants

    changeDate (e) {
      window.location.href = "?day=" + e.target.value
    }

    this.on("mount", function() {
      console.log(this.opts.date.getDay())
      this.root.querySelector("select").value = this.opts.date.getDay()
    })
  </script>
</app>
