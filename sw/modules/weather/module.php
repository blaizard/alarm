<?php
	class Weather extends Module
	{
		public function view()
		{
			include("deps/view.php");
		}

		public function config()
		{
			return array(
				array("name" => "unit", "caption" => "Units", "type" => "select", "list" => array(
					"f" => "Fahrenheit (°F)", "c" => "Celsius (°C)"
				)),
				array("name" => "location", "caption" => "Location", "type" => "select", "list" => array(
					"Concarneau, France",
					"Heidelberg, Germany",
					"Walldorf, Germany",
					"Bucharest, Romania",
					"Trondheim, Norway",
					"Paros, Greece"
				))
			);
		}

		public function getName()
		{
			return "<i class=\"fa fa-cloud\" aria-hidden=\"true\"></i> Weather";
		}
	}

	$moduleClass = 'Weather';
?>
