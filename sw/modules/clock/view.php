<?php
	require_once("core/php/module.php");
	$id = Module::getUniqueId();
?>
<div id="<?php echo $id; ?>"></div>
<script type="text/javascript">
	irRequire.map["$().irclock"] = ["modules/clock/irclock.css", "modules/clock/jquery.irclock.js"];
	irRequire.map["ProgressBar"] = ["modules/clock/progressbar.min.js"];
	irRequire(["$().irclock", "ProgressBar"], function(ircontainerRef) {
		/* Error handling */
		if (ircontainerRef == false) {
			$("#<?php echo $id; ?>").html("Cannot load the libraries");
			return;
		}
		var config = $(ircontainerRef).ircontainer("config");
		$("#<?php echo $id; ?>").irclock({
			offset: config["offset"],
			alarmList: [{
				timestamp: config["alarm"],
				action: function() {
					actionsRun(config["actions"]);
				}
			}]
		});
		/* Set the text callback */
		$(ircontainerRef).ircontainer("actionRegister", "Say Current Time", function(callback) {
			var date = $("#<?php echo $id; ?>").irclock("value");
			var text = "It is " + date.getHours() + " " + date.getMinutes();
			tts(text, callback);
		});
		/* Set the text callback */
		$(ircontainerRef).ircontainer("actionRegister", "test", function(callback) {
		});
	}, ircontainerRef);
</script>
