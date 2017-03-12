<?php
	require_once("core/module.php");
	$id = module_unique_id();
?>

<div id="<?php echo $id; ?>"></div>

<script type="text/javascript">
	$("#<?php echo $id; ?>").append(formHelperSelect("unit", "Units", [["c", "Celsius (&deg;C)"], ["f", "Fahrenheit (&deg;F)"]]));
	$("#<?php echo $id; ?>").append(formHelperLocation("location", "Location"));
</script>
