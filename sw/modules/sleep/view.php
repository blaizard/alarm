<script type="text/javascript">

	irRequire.map["$().irCircle"] = ["modules/sleep/jquery.ircircle.css", "modules/sleep/jquery.ircircle.js", "modules/sleep/sleep.css"];

	irRequire(["$().irCircle"], function() {
		var ircontainerSelector = "<?php echo $this->getContainerSelector(); ?>";
		var viewSelector = "<?php echo $this->getViewSelector(); ?>";

		var metricList = [
			["Sleep score", "87%", 87],
		//	["Fall asleep", "21min", 13],
			["Deep sleep", "2h37", 41],
		//	["Awake", "42min", 26]
		];

		var container = $("<div/>", {
			class: "sleep"
		});
		$(viewSelector).html(container);

		for (var i in metricList) {

			var metrics = $("<div/>", {
				class: "metrics"
			});
			var metricsCircle = $("<div/>", {
				class: "circle"
			});
			var metricsText = $("<div/>", {
				class: "text"
			});
			$(metricsText).text(metricList[i][0]);
			$(metrics).append(metricsCircle).append(metricsText);

			$(metricsCircle).irCircle({
				text: metricList[i][1],
				percent: metricList[i][2]
			});

			$(container).append(metrics);
		}

		$(viewSelector).ircontainer("elementFill", container);
		$(container).find(".circle").irCircle("resize");

		// Read the configuration
		//var config = $(ircontainerSelector).ircontainer("config");
	});
</script>
