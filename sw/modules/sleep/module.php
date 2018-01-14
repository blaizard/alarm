<?php
	class SleepModule extends Module
	{
		public function view()
		{
			include("view.php");
		}

		public function config()
		{
			return array(
				array("name" => "display", "caption" => "Display", "type" => "select", "list" => array("metrics" => "Metrics", "graphs" => "Graphs"), "onchange" => array(
					"graphs" => array(array("name" => "period", "caption" => "Period", "type" => "select", "list" => array(
						"1day" => "1 day", "2days" => "2 days", "3days" => "3 days", "1week" => "1 week", "2weeks" => "2 weeks", "1month" => "1 month"
					)))
				)),
				array("name" => "list", "caption" => "Add", "type" => "array", "template" => array(
					array("name" => "item", "type" => "select", "list" => array("score" => "Score", "fallAsleep" => "Fall asleep time", "deepSleep" => "Deep sleep time", "awake" => "awakeTime"))
				))
			);
		}

		public function getName()
		{
			return "<i class=\"fa fa-bed\" aria-hidden=\"true\"></i> Sleep Tracker";
		}

		public function getDescription()
		{
			return "Sleep tracker";
		}
	}

	$moduleClass = 'SleepModule';
?>
