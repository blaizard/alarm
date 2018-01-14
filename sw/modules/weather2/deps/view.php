<script type="text/javascript">

	irRequire.map["$.simpleWeather"] = ["modules/weather2/deps/weather.css", "modules/weather2/deps/jquery.simpleWeather.min.js"];

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

				console.log(weather);

				var iconContent = "unkown";

				switch (parseInt(weather.code)) {

				//thunder-storm
				case 0: //tornado
				case 1: //tropical storm
				case 2: //hurricane
				case 3: //severe thunderstorms
				case 4: //thunderstorms
				case 37: //isolated thunderstorms
				case 38: //scattered thunderstorms
				case 39: //scattered thunderstorms
				case 45: //thundershowers
				case 47: //isolated thundershowers
					iconContent = "<div class=\"icon thunder-storm\">";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "<div class=\"lightning\">";
					iconContent += "<div class=\"bolt\"></div>";
					iconContent += "<div class=\"bolt\"></div>";
					iconContent += "</div>";
					iconContent += "</div>";
					break;

				//snow
				case 5: //mixed rain and snow
				case 13: //snow flurries
				case 14: //light snow showers
				case 15: //blowing snow
				case 16: //snow
				case 17: //hail
				case 18: //sleet
				case 25: //cold
				case 41: //heavy snow
				case 42: //scattered snow showers
				case 43: //heavy snow
				case 46: //snow showers
					iconContent = "<div class=\"icon flurries\">";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "<div class=\"snow\">";
					iconContent += "<div class=\"flake\"></div>";
					iconContent += "<div class=\"flake\"></div>";
					iconContent += "</div>";
					iconContent += "</div>";
					break;

				//rain
				case 6: //mixed rain and sleet
				case 7: //mixed snow and sleet
				case 8: //freezing drizzle
				case 9: //drizzle
				case 10: //freezing rain
				case 11: //showers
				case 12: //showers
				case 35: //mixed rain and hail
				case 40: //scattered showers
					iconContent = "<div class=\"icon rainy\">";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "<div class=\"rain\"></div>";
					iconContent += "</div>";
					break;

				//cloud
				case 19: //dust
				case 20: //foggy
				case 21: //haze
				case 22: //smoky
				case 23: //blustery
				case 24: //windy
				case 26: //cloudy
				case 27: //mostly cloudy (night)
				case 28: //mostly cloudy (day)
				case 29: //partly cloudy (night)
				case 30: //partly cloudy (day)
					iconContent = "<div class=\"icon cloudy\">";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "</div>";
					break;

				//sun
				case 31: //clear (night)
				case 32: //sunny
				case 33: //fair (night)
				case 34: //fair (day)
				case 36: //hot
					iconContent = "<div class=\"icon sunny\">";
					iconContent += "<div class=\"sun\">";
					iconContent += "<div class=\"rays\"></div>";
					iconContent += "</div>";
					iconContent += "</div>";
					break;



				case 44: //partly cloudy
					iconContent = "<div class=\"icon cloudy\">";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "<div class=\"cloud\"></div>";
					iconContent += "</div>";
					break;
				};

				$(elt).html("<div class=\"weather-icon\">" + iconContent + "</div>");

				var eltTemp = document.createElement("div");
				$(eltTemp).addClass("weather-temperature");
				$(eltTemp).html("<div class=\"weather-main-temperature\">" + weather.temp + "&deg;" + weather.units.temp + "</div>");

				{
					var eltHiLow = document.createElement("div");
					$(eltHiLow).addClass("weather-hilow");
					$(eltHiLow).append("<div class=\"weather-hi\"><i class=\"fa fa-long-arrow-up\" aria-hidden=\"true\"></i> " + weather.high + "&deg;" + weather.units.temp + "</div>");
					$(eltHiLow).append("<div class=\"weather-low\"><i class=\"fa fa-long-arrow-down\" aria-hidden=\"true\"></i> " + weather.low + "&deg;" + weather.units.temp + "</div>");
					$(eltTemp).append(eltHiLow);
				}
				$(elt).append(eltTemp);
				$(viewSelector).append(elt);

				$(viewSelector).ircontainer("elementFill");
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
