<?php
	// Buffer the output in order to send the headers at the end
	ob_start();

	function formatError($errorDescriptor)
	{
		$errorDescriptor = array_merge(array(
			"type" => E_CORE_ERROR,
			"message" => "unknown error",
			"file" => "unknown file",
			"line" => 0
		), $errorDescriptor);
		return $errorDescriptor["type"].": ".$errorDescriptor["message"]." on ".$errorDescriptor["file"]." (line: ".$errorDescriptor["line"].")";
	}

	function throwError($e)
	{
		http_response_code(500);
		echo formatError(array(
			"type" => "Error",
			"message" => $e->getMessage(),
			"file" => $e->getFile(),
			"line" => $e->getLine()
		));
		die();
	}

	// Handle fatal errors
	register_shutdown_function("fatal_handler");
	function fatal_handler() {
		$errorDescriptor = array();
		$error = error_get_last();

		if ($error !== NULL) {
			$errorDescriptor = array(
				"type" => $error["type"],
				"message" => $error["message"],
				"file" => $error["file"],
				"line" => $error["line"]
			);
		}

		http_response_code(500);
		echo formatError($errorDescriptor);
		die();
	}


	// Declared after exception handling to make sure exception use the custom handler
	require_once("core/php/routing.php");
	require_once("core/php/config.php");
	require_once("core/php/module.php");

	$app = new Routing();

	/**
	 * api/modules
	 * Get the module list and capabilities
	 */
	$app->route("get", "/api/modules", function($vars) {
		header('Content-type: application/json');
		echo json_encode(Module::getList());
	});

	/**
	 * api/config
	 * Get the configuration of the module, the container or the application
	 */
	$app->route("get", "/api/config", function($vars) {
		header('Content-type: application/json');
		echo json_encode(config_read());
	});
	$app->route("put", "/api/config", function($vars) {
		if (($content = file_get_contents("php://input")) === false) {
			throw new Exception('Unable to retrieve configuration');
		}
		if (($config = json_decode($content, true)) === null) {
			throw new Exception('Cannot decode configuration');
		}
		config_write($config);
	});

	$app->route("get", "/api/config/{id:[0-9]+}", function($vars) {
		// Container ID
		$container_id = intval($vars["id"]);
		$globalconfig = config_read();
		// Return the container config if it exists
		$config = array();
		if (isset($globalconfig["containers"][$container_id])) {
			$config = $globalconfig["containers"][$container_id];
		}
		header('Content-type: application/json');
		echo json_encode($config);
	});

	$app->route("get", "/api/config/{module}", function($vars) {
		$module_id = $vars["module"];
		// Check if the module exists
		header('Content-type: text/html');
		if (is_dir("modules/".$module_id) && is_file("modules/".$module_id."/config.php")) {
			header('Content-type: text/html');
			include("modules/".$module_id."/config.php");
		}
	});

	/**
	 * api/view
	 * Get the view
	 */
	$app->route("post", "/api/view/{module}", function($vars) {
		$module_id = $vars["module"];
		// Check if the module exists
		header('Content-type: text/html');
		if (is_dir("modules/".$module_id) && is_file("modules/".$module_id."/view.php")) {
			include("modules/".$module_id."/view.php");
		}
		else {
			throw "This module has no viewer";
		}
	});

	try {
		$app->dispatch($_SERVER['REQUEST_URI']);
	}
	catch (Exception $e) {
		throwError($e);
	}

	// Output the content and end the connection
	$content = ob_get_contents();
	ob_end_clean();
	$content_length = strlen($content);
	header("Connection: close");
	header("Content-Length: $content_length");
	echo $content;
	ob_flush();
	die();

?>
