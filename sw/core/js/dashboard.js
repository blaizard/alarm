var Dashboard = function() {
};

Dashboard.container = null;
Dashboard.config = null;
Dashboard.modules = null;
Dashboard.onLoad = function() {};
Dashboard.onLoadContainer = function (containerId) {};
Dashboard.restapi = function() {
	Log.error("Dashboard.restapi needs to be implemented");
};

Dashboard.init = function(container) {
	if (Dashboard.container) {
		throw "Dashboard.init(...) can only be called once";
	}

	Dashboard.container = container;
}

Dashboard.load = function() {

	if (!Dashboard.container) {
		throw "Dashboard.init(...) must be called first";
	}

	var container = Dashboard.container;
	Dashboard.onLoad.call(this, Dashboard.container);

	// Read the configuration
	Dashboard.configLoad(function() {
		// Load the dashboard layout
		$(container).html(Dashboard.config["layout"]);

		// Fix the sizes
		$(container).find(".container").each(function(containerId) {
			$(this).css({
				width: $(this).width(),
				height: $(this).height()
			});
		});

		// Load the containers
		$(container).find(".container").each(function(containerId) {
			Dashboard.onLoadContainer.call(this, containerId);
			// Set the content of the container
			if (Dashboard.isValid(containerId)) {
				$(this).ircontainer({
					module: Dashboard.getModuleType(containerId),
					verticalAlign: Dashboard.config["containers"][containerId]["verticalAlign"],
					horizontalAlign: Dashboard.config["containers"][containerId]["horizontalAlign"],
					config: Dashboard.config["containers"][containerId]
				});
			}
		});
	});
};

Dashboard.getModuleType = function (containerId) {
	if (!Dashboard.config) {
		throw "Dashboard.config must be loaded before calling this function";
	}
	if (!Dashboard.isValid(containerId)) {
		throw "The container id (" + containerId + ") is not valid";
	}
	return Dashboard.config["containers"][containerId]["module"];
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
		throw "Dashboard.config must be loaded before calling this function";
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

Dashboard.configAttributeLoad = function (attribute) {
	if (!Dashboard.config) {
		throw "Dashboard.config must be loaded before calling this function";
	}
	return Dashboard.config[attribute];
};

Dashboard.configAttributeSave = function (attribute, value, callback) {
	if (!Dashboard.config) {
		throw "Dashboard.config must be loaded before calling this function";
	}
	Dashboard.config[attribute] = value;
	Dashboard.configSave(callback);
};

Dashboard.configModuleSave = function (containerId, config, callback) {
	if (!Dashboard.config) {
		throw "Dashboard.config must be loaded before calling this function";
	}
	Dashboard.config["containers"][containerId] = config;
	Dashboard.configSave(callback);
};

Dashboard.configModuleLoad = function (containerId) {
	if (!Dashboard.config) {
		throw "Dashboard.config must be loaded before calling this function";
	}
	return Dashboard.config["containers"][containerId];
};

/**
 * Automatically resize the given module
 */
Dashboard.moduleResize = function (containerId) {
	if (!Dashboard.isValid(containerId)) {
		throw "Resize function can only be called on valid containers (id=" + containerId + ")";
	}
	alert("Resizing " + containerId);
};

Dashboard.isValid = function (containerId) {
	return (typeof Dashboard.config["containers"][containerId] === "object"
			&& Dashboard.config["containers"][containerId]
			&& typeof Dashboard.config["containers"][containerId]["module"] !== "undefined"
			&& Dashboard.config["containers"][containerId]["module"] != "empty"
			&& typeof Dashboard.modules[Dashboard.config["containers"][containerId]["module"]] === "object");
}
