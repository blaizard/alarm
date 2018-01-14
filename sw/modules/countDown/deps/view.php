<script type="text/javascript">

	{
		var updateFct = function () {
			var ircontainerSelector = "<?php echo $this->getContainerSelector(); ?>";
			var viewSelector = "<?php echo $this->getViewSelector(); ?>";

			// Read the configuration
			var config = $(ircontainerSelector).ircontainer("config");
			var date = new Date(config["date"]);
			var curDate = new Date();
			var diff = Math.abs(date - curDate);

			var nbDays = Math.floor(diff / (24 * 60 * 60 * 1000));
			var nbHours = Math.floor(diff / (60 * 60 * 1000));
			var nbMinutes = Math.floor(diff / (60 * 1000));
			var nbSeconds = Math.floor(diff / (1000));

			var valueText = "";
			var unitText = "Over";
			var updatePeriod = 100000000;
			if (date > curDate) {
				if (nbDays) {
					valueText = nbDays;
					unitText = (nbDays == 1) ? "day" : "days";
					updatePeriod = 30 * 60 * 1000;
				}
				else if (nbHours) {
					valueText = nbHours;
					unitText = (nbHours == 1) ? "hour" : "hours";
					updatePeriod = 60 * 1000;
				}
				else if (nbMinutes) {
					valueText = nbMinutes;
					unitText = "min";
					updatePeriod = 60 * 1000;
				}
				else if (nbSeconds) {
					valueText = nbSeconds;
					unitText = "sec";
					updatePeriod = 1000;
				}
			}

			var value = $("<div/>");
			$(value).text(valueText);

			var unit = $("<div/>", {
				style: "font-size: 0.5em; font-variant: small-caps; margin-top: -0.5em;"
			});
			$(unit).text(unitText);

			var message = $("<div/>", {
				style: "font-size: 0.3em; white-space: nowrap; color: #777;"
			});
			$(message).text(config["message"]);

			$(viewSelector).empty();
			$(viewSelector).append(value);
			$(viewSelector).append(unit);
			$(viewSelector).append(message);
			$(viewSelector).ircontainer("elementFill");

			setTimeout(updateFct, updatePeriod);
		};

		updateFct();
	}

</script>
