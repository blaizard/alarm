<?php
/**
 * To use this file, mopidy must be installed as a service on the linux machine with the followng command:
 * sudo systemctl enable mopidy
 */

function mopidy_is_running()
{
	exec("sudo systemctl status mopidy", $output, $retval);
	return ($retval == 0) ? true : false;
}

function mopidy_run()
{
	exec("sudo systemctl start mopidy", $output, $retval);
	if ($retval != 0) {
		exec("sudo systemctl restart mopidy", $output, $retval);
		return ($retval == 0) ? true : false;
	}
	return true;
}

function mopidy_stop()
{
	exec("sudo systemctl stop mopidy", $output, $retval);
	return ($retval == 0) ? true : false;
}
?>
