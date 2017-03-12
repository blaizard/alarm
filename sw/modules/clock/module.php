<?php
	class Clock extends Module
	{
		public function view()
		{
			$id = $this->getUniqueId();
			include("view.php");
		}
	}
?>