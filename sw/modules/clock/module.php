<?php
	class Clock extends Module
	{
		public function view()
		{
			include("deps/view.php");
		}

		public function config()
		{
			return array(
				array("name" => "date", "caption" => "Date", "type" => "date", "isDelta" => true),
				array("name" => "display", "caption" => "Display", "type" => "select", "list" => array("analog" => "Analog", "digital" => "Digital")),
				array("name" => "alarm", "caption" => "Alarm", "type" => "array", "template" => [
					array("name" => "time", "caption" => "Time", "type" => "date", "isDate" => false, "isSeconds" => false, "isRunning" => false),
					array("name" => "action", "caption" => "Action", "type" => "array", "template" => array(
						array("name" => "type", "width" => "110px", "type" => "select", "list" => array(
								"lighton" => "<i class=\"fa fa-lightbulb-o\" aria-hidden=\"true\"></i> Light on",
								"lightoff" => "<i class=\"fa fa-lightbulb-o\" aria-hidden=\"true\"></i> Light off",
								"talk" => "<i class=\"fa fa-volume-up\" aria-hidden=\"true\"></i> Talk",
								"module" => "<i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Module",
								"delay" => "<i class=\"fa fa-hourglass-start\" aria-hidden=\"true\"></i> Delay"
							), "onchange" => array(
								"talk" => array(array("name" => "text", "width" => "220px", "placeholder" => "Type text to be spoken", "type" => "input")),
								"lighton" => array(array("name" => "time", "width" => "220px", "type" => "select", "list" => array(0 => "instant", 10 => "10s", 30 => "30s", 60 => "1min", 300 => "5min", 600 => "10min", 1200 => "20min", 1800 => "30min", 3600 => "1h"))),
								"lightoff" => array(array("name" => "time", "width" => "220px", "type" => "select", "list" => array(0 => "instant", 10 => "10s", 30 => "30s", 60 => "1min", 300 => "5min", 600 => "10min", 1200 => "20min", 1800 => "30min", 3600 => "1h"))),
								"delay" => array(array("name" => "time", "width" => "220px", "type" => "select", "list" => array(5 => "5s", 10 => "10s", 30 => "30s", 60 => "1min", 300 => "5min", 600 => "10min", 1200 => "20min", 1800 => "30min", 3600 => "1h")))
						)),
					), "irformOptions" => array(
						"caption" => false
					)),
					array("name" => "repeat", "caption" => "Repeat", "type" => "switch",  "onchange" => array(
						"selected" => array(array("name" => "week", "caption" => "Week"
							, "list" => array("monday" => "M", "tuesday" => "T", "wednesday" => "W", "thursday" => "T", "friday" => "F", "saturday" => "S", "sunday" => "S")
							, "type" => "checkbox", "inline" => true))
					))
				]),
			);
		}

		public function getName()
		{
			return "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> Clock";
		}
	}

	$moduleClass = 'Clock';
?>
