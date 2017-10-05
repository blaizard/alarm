<?php
	// Start the session if it has not been started yet
	if (!isset($_SESSION)) {
		session_start();
	}

	abstract class Module
	{
		protected $m_type;
		protected $m_id;

		public function __construct($type)
		{
			$this->m_type = $type;
			$this->m_id = (isset($_POST["id"])) ? $_POST["id"] : -1;
		}

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
				$module = Module::getInstance($id);

				$infoList[$id] = array(
					"name" => $module->getName(),
					"description" => $module->getDescription()
				);
			}
			return $infoList;
		}

		/**
		 * \brief Get the module object or throw if none exsits
		 */
		public static function getInstance($moduleId)
		{
			// Load the module
			if (is_dir("modules/".$moduleId) && is_file("modules/".$moduleId."/module.php")) {
				include("modules/".$moduleId."/module.php");

				$module = new $moduleClass($moduleId);

				if (!($module instanceof Module)) {
					throw new Exception("The module '".$moduleId."' is not compatible");
				}

				return $module;
			}
			else {
				throw new Exception("The module '".$moduleId."' does not exist");
			}
		}

		/**
		 * Return the name of the module
		 */
		public function getName()
		{
			return get_class($this);
		}

		public function getDescription()
		{
			return "";
		}

		/**
		 * Generate the module view
		 */
		public abstract function view();

		/**
		 * Generate the module configuration view
		 */
		public abstract function config();

		/**
		 * Return the module type
		 */
		public function getType()
		{
			return $this->m_type;
		}

		/**
		 * Return the container Id of the module.
		 * The container Id is the identifier of the container that
		 * holds the module.
		 */
		public function getContainerSelector()
		{
			if ($this->m_id == -1) {
				throw new Exception("No container is defined for this module");
			}
			return ".ircontainer-".($this->m_id).":first";
		}

		/**
		 * Return the view Id of the module. The view Id is the
		 * identifier or the sb container of the view of the module.
		 * it is basically a div inside the container itself.
		 */
		public function getViewSelector()
		{
			if ($this->m_id == -1) {
				throw new Exception("No container is defined for this module");
			}
			return $this->getContainerSelector()." div.view-".($this->m_id).":first";
		}
	}
?>