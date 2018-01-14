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
				array("name" => "date", "caption" => "Date", "type" => "date", "isRunning" => false),
				array("name" => "message", "caption" => "Message", "type" => "input")
			);
		}

		public function getName()
		{
			return "<i class=\"fa fa-tachometer\" aria-hidden=\"true\"></i> Count Down";
		}
	}

	$moduleClass = 'CountDown';
?>
