<?php
	require_once("core/module.php");
	require_once("core/job.php");
	$id = module_unique_id();
	/* Register the job */
	job_register("./modules/git/git_check.sh -j git_check.json -p ../../", JOB_EVERY_DAY);
?>
<div id="<?php echo $id; ?>"></div>
<script type="text/javascript">
	irload_js("modules/git/jquery.irgit.js?" + Math.random());
	irload_css("modules/git/jquery.irgit.css?" + Math.random());
	irload_require("$().irgit", function(ircontainerRef) {
		/* Error handling */
		if (ircontainerRef == false) {
			$("#<?php echo $id; ?>").html("Cannot load the libraries");
			return;
		}
		$("#<?php echo $id; ?>").irgit({
			resize: function() {
				$(this).ircontainer("elementFill");
			}
		});
	}, ircontainerRef);
</script>