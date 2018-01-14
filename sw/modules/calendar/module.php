<?php
	class CalendarMModule extends Module
	{
		public function view()
		{
		}

		public function config()
		{
		}

		public function getName()
		{
			return "<i class=\"fa fa-calendar\" aria-hidden=\"true\"></i> Calendar";
		}

		public function getDescription()
		{
			return "Calendar";
		}
	}

	$moduleClass = 'CalendarMModule';
?>
