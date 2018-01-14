<?php
	class MusicModule extends Module
	{
		public function view()
		{
		}

		public function config()
		{
		}

		public function getName()
		{
			return "<i class=\"fa fa-music\" aria-hidden=\"true\"></i> Music Player";
		}

		public function getDescription()
		{
			return "Music player";
		}
	}

	$moduleClass = 'MusicModule';
?>
