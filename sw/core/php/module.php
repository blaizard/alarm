<?php
	// Start the session if it has not been started yet
	if (!isset($_SESSION)) {
		session_start();
	}

	abstract class Module
	{
		/**
		 * This is a pseudo unique number generator
		 */
		public static function getUnique()
		{
			if (isset($_SESSION['unique']) && is_int($_SESSION['unique'])) {
				$_SESSION['unique']++;
			}
			else {
				$_SESSION['unique'] = mt_rand();
			}
			return $_SESSION['unique'];
		}

		/**
		 * Generates a unique ID
		 */
		public static function getUniqueId()
		{
			return "module-uniqueid-".Self::getUnique();
		}

		/**
		 * Get the module list
		 */
		public static function getList($modulePath = "modules/")
		{
			// Get the module list
			if (($dh = @opendir($modulePath)) === false) {
				throw new Exception("Cannot open directory `".$modulePath."' for reading");
			}
			$modules = array();
			while (false !== ($filename = readdir($dh))) {
				if (is_dir($modulePath."/".$filename) && !in_array($filename, array(".", ".."))) {
					array_push($modules, $filename);
				}
			}

			// Get the modules detail
			$infoList = array();
			foreach ($modules as $id) {
				$path = $modulePath."/".$id."/info.json";
				$info = array();
				if (is_file($path)) {
					if (($content = @file_get_contents($path)) === false) {
						throw new Exception("Cannot access info.json file for reading");
					}
					if (($config = @json_decode($content, true)) === false) {
						throw new Exception("Cannot decode configuration file");
					}
					$info = array_merge($info, $config);
				}
				$infoList[$id] = $info;
			}
			return $infoList;
		}

		/**
		 *
		 */
		public abstract function view();
	}
?>