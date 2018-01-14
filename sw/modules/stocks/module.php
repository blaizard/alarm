<?php
	class StocksModule extends Module
	{
		public function view()
		{
		}

		public function config()
		{
		}

		public function getName()
		{
			return "<i class=\"fa fa-line-chart\" aria-hidden=\"true\"></i> Stocks";
		}

		public function getDescription()
		{
			return "Stocks";
		}
	}

	$moduleClass = 'StocksModule';
?>
