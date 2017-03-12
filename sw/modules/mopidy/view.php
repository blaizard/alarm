<?php
	require_once("core/module.php");
	require_once("modules/mopidy/mopidy.php");
	$id = module_unique_id();
	/* Run mopidy if not running */
	if (!mopidy_is_running()) {
		mopidy_run();
	}
?>
<div id="<?php echo $id; ?>"></div>
<script type="text/javascript">
	var DOMAIN = "10.0.0.4";
	irload_js("http://" + DOMAIN + ":6680/mopidy/mopidy.js");
	irload_js("modules/mopidy/jquery.irmopidy.js");
	irload_css("modules/mopidy/jquery.irmopidy.css");
	$("#<?php echo $id; ?>").html(dashboardLoading());
	irload_require(["Mopidy", "$().irmopidy"], function(ircontainerRef) {
		/* Error handling */
		if (ircontainerRef == false) {
			$("#<?php echo $id; ?>").html("Problem accessing the server");
			return;
		}
		$("#<?php echo $id; ?>").irmopidy({
			webSocketUrl: "ws://" + DOMAIN + ":6680/mopidy/ws/",
			onResize: function() {
				$(this).ircontainer("elementFill");
			},
			onReady: function() {
				/* Set the actions only when the module is ready */
				$(ircontainerRef).ircontainer("actionRegister", "Play", function(callback) {
					$("#<?php echo $id; ?>").irmopidy("play");
					callback();
				});
			}
		});
	}, ircontainerRef);
</script>
