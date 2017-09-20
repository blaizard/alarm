<?php
	class CountDown extends Module
	{
		public function view()
		{
			include("deps/view.php");
		}

		public function config()
		{
			return array(
				array("name" => "date", "caption" => "Date", "type" => "date", "isRunning" => false)
			);
		}

		public function getName()
		{
			return "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> Count Down";
		}
	}

	$moduleClass = 'CountDown';
?>
