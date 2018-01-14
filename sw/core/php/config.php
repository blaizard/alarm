<?php
	define("CONFIG_PATH", "config.json");

	function config_read()
	{
		$default = array(
			"layout" => "<div class=\"irdashboard-column-2\"><div class=\"irdashboard-container\"></div><div class=\"irdashboard-container\"></div></div><div class=\"irdashboard-column\"><div class=\"irdashboard-container-2\"></div><div class=\"irdashboard-container\"></div></div><div class=\"irdashboard-column\"><div class=\"irdashboard-container\"></div><div class=\"irdashboard-container\"></div><div class=\"irdashboard-container\"></div></div>",
			"containers" => array(
				array("module" => "clock"), array("module" => "weather")
			)
		);
		$config = array();
		if (is_file(CONFIG_PATH)) {
			if (($content = file_get_contents(CONFIG_PATH)) === false) {
				throw new Exception('Cannot read configuration file');
			}
			if (($config = json_decode($content, true)) === false) {
				throw new Exception('Cannot decode configuration file');
			}
			if (!is_array($config)) {
				throw new Exception('Invalid configuration');
			}
		}
		return array_merge($default, $config);
	}

	/**
	 * Write the configuration to the file
	 */
	function config_write($config)
	{
		if (!is_array($config)) {
			throw new Exception('The configuration format is wrong');
		}
		if (($string = json_encode($config)) === false) {
			throw new Exception('Cannot create json object out of the configuration');
		}
		if (file_put_contents(CONFIG_PATH, $string) === false) {
			throw new Exception('Cannot write configuration file');
		}
	}
?>
