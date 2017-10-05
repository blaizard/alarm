<script type="text/javascript">

	irRequire.map["$().irclock"] = ["modules/clock/deps/irclock.css", "modules/clock/deps/jquery.irclock.js"];
	irRequire.map["ProgressBar"] = ["modules/clock/deps/progressbar.min.js"];

	irRequire(["$().irclock", "ProgressBar"], function() {
		var ircontainerSelector = "<?php echo $this->getContainerSelector(); ?>";
		var viewSelector = "<?php echo $this->getViewSelector(); ?>";

		// Read the configuration
		var config = $(ircontainerSelector).ircontainer("config");
		$(viewSelector).irclock({
			offset: config["date"],
			alarmList: [{
				timestamp: config["alarm"],
				action: function() {
					actionsRun(config["actions"]);
				}
			}],
			resize: function() {
				$(viewSelector).ircontainer("elementFill");
			}
		});

		// Set the current time callback
		$(ircontainerSelector).ircontainer("actionRegister", "Say Current Time", function(callback) {
			var date = $(viewSelector).irclock("value");
			var text = "It is " + date.getHours() + " " + date.getMinutes();
			tts(text, callback);
		});
	});
</script>
