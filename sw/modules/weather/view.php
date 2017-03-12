<?php
	require_once("core/php/module.php");
	$id = module_unique_id();
?>
<div id="<?php echo $id; ?>"></div>
<script type="text/javascript">

	/*$("#content").css({
		backgroundImage: "url(modules/weather/imgs/snow.gif)",
		backgroundSize: "cover"
	});*/


	Core.loading("#<?php echo $id; ?>");
	irRequire.map["$.simpleWeather"] = ["modules/weather/weather.css", "modules/weather/jquery.simpleWeather.min.js"];
	irRequire("$.simpleWeather", function(ircontainerRef) {
		/* Error handling */
		if (ircontainerRef == false) {
			$("#<?php echo $id; ?>").html("Cannot load the libraries");
			return;
		}
		$("#<?php echo $id; ?>").addClass("weather");
		var config = $(ircontainerRef).ircontainer("config");
		$.simpleWeather({
			location: config["location"],
			unit: config["unit"],
			success: function(weather) {
				var selector = "#<?php echo $id; ?>";
				$(selector).empty();
				var elt = document.createElement("div");
				$(elt).addClass("weather-main");
				$(elt).html("<i class=\"icon-" + weather.code + "\"></i> " + weather.temp + "&deg;" + weather.units.temp);
				$(selector).append(elt);
				/* Create the forecast view */
				var elt = document.createElement("div");
				$(elt).addClass("weather-forecast");
				var date = new Date;
				var day = date.getDay();
				var day_list = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
				for (var i=0; i<4; i++) {
					$(elt).append("<div class=\"weather-forecast-item\"><i class=\"icon-" + weather.forecast[i].code + "\"></i> " + weather.forecast[i].high + "&deg;" + weather.units.temp + "<div class=\"weather-forecast-item-day\">" + day_list[(day + i + 1) % 7] + "</div></div>");
				}
				$(selector).append(elt);
				/* Resize */
				$(selector).ircontainer("elementFill");
			},
			error: function(error) {
				$("#<?php echo $id; ?>").html(error);
			}
		});
	}, ircontainerRef);
</script>
