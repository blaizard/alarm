<?php
	/* To display the error */
    ini_set('display_errors', 1);
	chdir("..");
	/* Script used to replace the .htaccess not supported by the built-in webserver */
	if (preg_match('_^/api(/.*)?$_', $_SERVER["REQUEST_URI"])) {
		include("api.php");
	}
	else {
		return false;
	}
?>
