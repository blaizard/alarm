<?php
	require_once("core/module.php");
	$id = module_unique_id();
?>

<div id="<?php echo $id; ?>"></div>

<script type="text/javascript">

	$("#<?php echo $id; ?>").append(formHelperEditableSelect("rss", "RSS", [
		["http://rss.news.yahoo.com/rss/topstories", "Yahoo! Top Stories"],
		["http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", "New York Times"],
		["http://blog.japan.cnet.com/lessig/index.rdf", "CNET Japan"],
	]));

	$("#<?php echo $id; ?>").append(formHelperSelect("nb_entries", "Number of entries", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ["all", "All"]]));

</script>
