<?php
	class EmptyModule extends Module
	{
		public function view()
		{
		}

		public function config()
		{
		}

		public function getName()
		{
			return "-";
		}

		public function getDescription()
		{
			return "Empty space (no module selected)";
		}
	}

	$moduleClass = 'EmptyModule';
?>
