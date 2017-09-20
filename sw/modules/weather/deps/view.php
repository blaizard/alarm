<script type="text/javascript">

	irRequire.map["$.simpleWeather"] = ["modules/weather/deps/weather.css", "modules/weather/deps/jquery.simpleWeather.min.js"];

/*	$("#content").css({
		backgroundImage: "url(modules/weather/deps/imgs/snow.gif)",
		backgroundSize: "cover"
	});
*/
	var weatherDraw = function () {
		var ircontainerSelector = "<?php echo $this->getContainerSelector(); ?>";
		var viewSelector = "<?php echo $this->getViewSelector(); ?>";

		// Read the configuration
		var config = $(ircontainerSelector).ircontainer("config");

		// Set the view
		$.simpleWeather({
			location: config["location"],
			unit: config["unit"],
			success: function(weather) {
				$(viewSelector).empty();
				$(viewSelector).addClass("weather");
				var elt = document.createElement("div");
				$(elt).addClass("weather-main");
				$(elt).html("<i class=\"icon-" + weather.code + "\"></i> " + weather.temp + "&deg;" + weather.units.temp);
				$(viewSelector).append(elt);
				// Create the forecast view 
				var elt = document.createElement("div");
				$(elt).addClass("weather-forecast");
				var date = new Date;
				var day = date.getDay();
				var day_list = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
				for (var i=0; i<4; i++) {
					$(elt).append("<div class=\"weather-forecast-item\"><i class=\"icon-" + weather.forecast[i].code + "\"></i> " + weather.forecast[i].high + "&deg;" + weather.units.temp + "<div class=\"weather-forecast-item-day\">" + day_list[(day + i + 1) % 7] + "</div></div>");
				}
				$(viewSelector).append(elt);
				// Resize (do this asynchronously to give the time to the font to load)
				setTimeout(function() {
					$(viewSelector).ircontainer("elementFill");
				}, 10);
			},
			error: function(error) {
				$(viewSelector).html(error);
			}
		});

		// Refresh every 15 minutes
		setTimeout(weatherDraw, 15 * 60 * 1000);
	};

	irRequire("$.simpleWeather", weatherDraw);
</script>
