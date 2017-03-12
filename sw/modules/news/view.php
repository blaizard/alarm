<script type="text/javascript">
	irload_css("modules/news/style.css?" + Math.random());

	function news_click(container)
	{
		var content = document.createElement("div");
		$(content).addClass("news-content fullscreen");
		$(content).html($(container).html());
		/* Clean-up */
		$(content).find(".news-description").each(function() {
			$(this).html($(this).text());
		});
		createScreen(content);
	}
</script>
<?php

	function get_image_from_html($html)
	{
		if ($html) {
			$doc = new DOMDocument();
			/* Remove warnings */
            $internalErrors = libxml_use_internal_errors(true);
			$doc->loadHTML($html);
            libxml_use_internal_errors($internalErrors);
			$imageTags = $doc->getElementsByTagName('img');
			foreach($imageTags as $tag) {
				return $tag->getAttribute('src');
			}
		}
		return null;
	}

	function html_2_text($html)
	{
		return trim(strip_tags($html));
	}

	function print_feed($feed, $nb_entries, $options = array())
	{
		for ($i = 0; $i < $nb_entries; $i++) {
			$item = $feed[$i];
			echo "<div class=\"news-item\">";

			/* Find the first image */
			$image = get_image_from_html($item['desc']);

			echo "<div class=\"news-image\"><img src=\"".$image."\" onerror=\"javascript:this.parentElement.style.display='none';\" /></div>";
			echo "<div class=\"news-title\">".html_2_text($item['title'])."</div>";
			echo "<div class=\"news-description\">".html_2_text($item['desc'])."</div>";
			echo "</div>";
		}
	}

	$rss = new DOMDocument();
	$rss->load((isset($_POST["rss"])) ? $_POST["rss"] : "");

	$feed = array();
	foreach ($rss->getElementsByTagName('item') as $node) {
		$item = array (
			'title' => $node->getElementsByTagName('title')->item(0)->nodeValue,
			'desc' => $node->getElementsByTagName('description')->item(0)->nodeValue,
			'link' => $node->getElementsByTagName('link')->item(0)->nodeValue,
//			'date' => $node->getElementsByTagName('pubDate')->item(0)->nodeValue,
		);
		array_push($feed, $item);
	}

	echo "<div class=\"news-content\" onclick=\"javascript:news_click(this);\">";

	/* Calculate the number of feeds to be shown */
	$nb_entries = (isset($_POST["nb_entries"]) && is_numeric($_POST["nb_entries"])) ? intval($_POST["nb_entries"]) : count($feed);

	echo "<div class=\"news-content fullscreen-only\">";
	print_feed($feed, count($feed));
	echo "</div>";

	echo "<div class=\"news-content widget-only\">";
	print_feed($feed, $nb_entries);
	echo "</div>";

	echo "</div>";
?>
