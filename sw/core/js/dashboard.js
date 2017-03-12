var Dashboard = function() {
};

Dashboard.config = null;
Dashboard.modules = null;
Dashboard.onLoad = function() {};
Dashboard.onLoadContainer = function() {};
Dashboard.restapi = function() {
	Log.error("Dashboard.restapi needs to be implemented");
};

Dashboard.load = function(container) {

	Dashboard.onLoad.call(this, container);

	// Read the configuration
	Dashboard.configLoad(function() {
		// Load the dashboard layout
		$(container).html(Dashboard.config["layout"]);
		$(container).irdashboard();
		// Load the containers
		$(container).irdashboard("container").each(function(containerId) {
			Dashboard.onLoadContainer.call(this, containerId);
			// Set the content of the container
			if (Dashboard.isValid(containerId)) {
				$(this).ircontainer({
					module: Dashboard.config["containers"][containerId]["module"],
					verticalAlign: Dashboard.config["containers"][containerId]["verticalAlign"],
					horizontalAlign: Dashboard.config["containers"][containerId]["horizontalAlign"],
					config: Dashboard.config["containers"][containerId]
				});
			}
		});
	});
};

/**
 * This function will load the configuration
 */
Dashboard.configLoad = function (callback) {
	if (typeof callback === "undefined") {
		callback = function() {};
	}

	// If already loaded do nothing and call directly the callback
	if (Dashboard.config && Dashboard.modules) {
		callback(Dashboard.config, Dashboard.modules);
		return;
	}
	// Read the configuration
	Dashboard.restapi("get", "json", "/api/config", null, function(isSuccess, data) {
		if (isSuccess) {
			Dashboard.config = data;
			// Load the module info
        	Dashboard.restapi("get", "json", "/api/modules", null, function(isSuccess, data) {
				if (isSuccess) {
					Dashboard.modules = data;
					callback(Dashboard.config, Dashboard.modules);
				}
				else {
					Log.error("A problem occurred while loading the module list, please retry");
				}
			});
		}
		else {
			Log.error("A problem occurred while loading the configuration file, please retry");
		}
	});
}

/**
 * This function will save the current configuration
 */
Dashboard.configSave = function (callback) {
	if (!Dashboard.config) {
		return;
	}
	// Read the configuration
	Dashboard.restapi("put", "json", "/api/config", Dashboard.config, function(is_success, data) {
		if (is_success === true) {
			if (typeof callback === "function") {
				callback();
			}
		}
		else {
			Log.error("A problem occurred while saving the configuration file, please retry.");
		}
	});
}

Dashboard.isValid = function (containerId) {
	return (typeof Dashboard.config["containers"][containerId] === "object"
			&& Dashboard.config["containers"][containerId]
			&& typeof Dashboard.config["containers"][containerId]["module"] !== "undefined"
			&& Dashboard.config["containers"][containerId]["module"] != "empty");
}
