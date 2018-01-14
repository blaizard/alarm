<?php
	class NewsModule extends Module
	{
		public function view()
		{
		}

		public function config()
		{
		}

		public function getName()
		{
			return "<i class=\"fa fa-newspaper-o\" aria-hidden=\"true\"></i> News";
		}

		public function getDescription()
		{
			return "News";
		}
	}

	$moduleClass = 'NewsModule';
?>
