/**
 * Irform must be loaded
 */

var Menu = function () {
};

Menu.config = function (callback) {
	var container = document.createElement("div");
	$(container).addClass("dashboard-config");

	var itemList = [
		{title: "Layout", icon: "<i class=\"fa fa-columns\" aria-hidden=\"true\"></i>", action: function() {
			Menu.layout(function() {
				Dashboard.configLoad();
			});
		}},
		{title: "Theme", icon: "<i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i>", action: function() {}},
		{title: "WiFi", icon: "<i class=\"fa fa-wifi\" aria-hidden=\"true\"></i>", action: function() {
			Menu.wifi(function(){});
		}},
		{title: "Light", icon: "<i class=\"fa fa-sun-o\" aria-hidden=\"true\"></i>", action: function() { light(); }},
		{title: "Refresh", icon: "<i class=\"fa fa-power-off\" aria-hidden=\"true\"></i>", action: function() {
			var modal = $("<div/>");
			$(modal).irformModal({
				onValidate: function() {
					switch ($(this).val()) {
					case "refresh":
						location.reload();
						break;
					case "restart":
						Core.restapi("POST", "json", "/api/restart", null, undefined, function(message) {
							Log.error(message);
						});
						break;
					case "shutdown":
						Core.restapi("POST", "json", "/api/shutdown", null, undefined, function(message) {
							Log.error(message);
						});
						break;
					default:
						Log.debug("Unkown action type " + $(this).val());
					}
				}
			});

			$(modal).irSpiner({list: {
				refresh: "<i class=\"fa fa-refresh\" aria-hidden=\"true\"></i> Refresh",
				restart: "<i class=\"fa fa-repeat\" aria-hidden=\"true\"></i> Restart",
				shutdown: "<i class=\"fa fa-power-off\" aria-hidden=\"true\"></i> Shutdown"}});
		}},
		{title: "About", icon: "<i class=\"fa fa-question\" aria-hidden=\"true\"></i>", action: function() {
			var html = $("<div/>");
			Core.loading();
			var about = Display.create(html, {
				title: "About",
				id: "about"
			});
			Core.restapi("GET", "", "about.html", null, function(data) {
				about.setContent(data);
			});
		}},
	];

	for (var i in itemList) {
		var item = document.createElement("div");
		$(item).addClass("dashboard-config-item");
		$(item).click(itemList[i]["action"]);

		var icon = document.createElement("div");
		$(icon).addClass("dashboard-config-icon");
		$(icon).html(itemList[i]["icon"]);
		$(item).append(icon);

		var text = document.createElement("div");
		$(text).addClass("dashboard-config-text");
		$(text).text(itemList[i]["title"]);
		$(item).append(text);

		$(container).append(item);
	}

	Display.create(container, {
		title: "Configuration",
		id: "config",
		callback: function() {
			callback();
		}
	});
}

/**
 * Save the data of the current display
 */
Menu.moduleConfigSave = function () {
	var display = Display.get("moduleConfig");

	// Make sure the view is there
	if (!display) {
		Log.error("Module configuration view is missing. Internal error.");
		return;
	}

	// Read the container Id
	var containerId = display.getArgs();
	// Read the data
	var data = Irform.get(display.getContent().find("form:first"));

	// Save the data only if the current menu is valid
	Dashboard.configLoad(function(config, modules) {

		if (typeof config["containers"][containerId] === "undefined") {
			// Insert empty containers
			for (var i = config["containers"].length; i <= containerId; i++) {
				config["containers"][i] = {};
			}
		}
		// Merge the data
		config["containers"][containerId] = $.extend({}, config["containers"][containerId], data);

	});
}

/**
 * Load the data of the selected module
 */
Menu.moduleConfigLoad = function (moduleType, callback) {
	var display = Display.get("moduleConfig");

	// Make sure the view is there
	if (!display) {
		Log.error("Module configuration view is missing. Internal error.");
		return;
	}

	// Read the container Id
	var containerId = display.getArgs();

	// Load the values and clone it
	Dashboard.configLoad(function(config, modules) {

		var values = config["containers"][containerId];
		values = $.extend({}, values);
		values["module"] = (typeof moduleType === "string") ? moduleType : values["module"];

		Irform.set(display.getContent().find("form:first"), values);

		if (typeof callback === "function") {
			callback();
		}
	});
}

Menu.layout = function (callback) {
	var html = $("<div/>");
	Core.loading(html);
	var display = Display.create(html, {
		title: "Layout",
		id: "layoutConfig",
		callback: function() {
			var layout = $(this.getContent()).children(".dashboard-layout-config:first").val();
			Dashboard.configAttributeSave("layout", layout, callback);
		}
	});

	var layoutList = [
		"<table style=\"width: 100%; height: 100%;\">"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" style=\"width: 50%;\"></td><td class=\"container\" style=\"width: 50%;\"></td></tr>"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" colspan=\"2\"></td></tr>"
		+ "</table>",
		"<table style=\"width: 100%; height: 100%;\">"
			+ "<tr><td class=\"container\" style=\"width: 50%;\"></td><td style=\"width: 50%;\"><table style=\"width: 100%; height: 100%;\"><tr style=\"height: 50%;\"><td class=\"container\"></td></tr><tr style=\"height: 50%;\"><td class=\"container\"></td></tr></table></td></tr>"
		+ "</table>",
		"<table style=\"width: 100%; height: 100%;\">"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" colspan=\"2\"></td><td class=\"container\"></td></tr>"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" style=\"width: 33%;\"></td><td class=\"container\" style=\"width: 33%;\"></td><td class=\"container\" style=\"width: 33%;\"></td></tr>"
		+ "</table>",
		"<table style=\"width: 100%; height: 100%;\">"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" style=\"width: 66%;\"></td><td class=\"container\" style=\"width: 33%;\"></td></tr>"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" style=\"width: 66%;\"></td><td class=\"container\" style=\"width: 33%;\"></td></tr>"
		+ "</table>",
		"<table style=\"width: 100%; height: 100%;\">"
			+ "<tr><td class=\"container\"></td></tr>"
		+ "</table>",
		"<table style=\"width: 100%; height: 100%;\">"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" style=\"width: 50%;\"></td><td class=\"container\" style=\"width: 50%;\"></td></tr>"
			+ "<tr style=\"height: 50%;\"><td class=\"container\" style=\"width: 50%;\"></td><td class=\"container\" style=\"width: 50%;\"></td></tr>"
		+ "</table>",
	];

	var container = $("<div/>", {
		class: "dashboard-layout-config"
	});
	display.setContent(container);

	Dashboard.configLoad(function(config, modules) {

		// Set the layout
		$(container).irSpiner({list: layoutList});
		$(container).val(config["layout"]);

		// Update the content
		var updateContent = function(container) {
			$(container).find("li").each(function() {
				$(this).find(".container").each(function(containerId) {
					if (Dashboard.isValid(containerId)) {
						// Write the name of the valid containers
						var name = config["containers"][containerId]["module"];
						$(this).html(modules[name]["name"]);
					}
					// Attach a event
					$(this).click(function() {
						Menu.moduleConfig(containerId, function() {
							// Re-update the content as it might have changed
							var display = Display.get("layoutConfig");
							var container = $(display).children(".dashboard-layout-config:first");
							updateContent(container);
						});
					});
				});
			});
		};

		updateContent(container);
	});
}

Menu.wifi = function (callback) {
	var html = $("<div/>");
	Core.loading(html, "Scanning available wifi networks...");
	var display = Display.create(html, {
		title: "WiFi Network",
		id: "wifi",
		callback: callback
	});

	Core.restapi("GET", "json", "/api/wifi", null, function(data) {

		var container = $("<form>");
		display.setContent(container);

		// Generate the ssid list
		var wifiSelected = null;
		var ssidList = {};
		for (var i in data) {
			var ssid = data[i]["ssid"];
			var strength = data[i]["strength"];
			var selected = data[i]["selected"];
			var protected = data[i]["protected"];
			var message = "<i class=\"fa fa-wifi\" aria-hidden=\"true\" style=\"opacity:" + (strength/50) + ";\"></i>&nbsp;";
			if (protected) {
				message += "<i class=\"fa fa-lock\" aria-hidden=\"true\"></i>&nbsp;";
			}
			if (selected) {
				wifiSelected = ssid;
			}
			ssidList[ssid] = message + ssid;
		}

		var irformConfig = [
			{name: "ssid", caption: "Network", type: "select", list: ssidList},
			{name: "password", caption: "Password", type: "password"},
			{type: "submit", value: "Connect", callback: function(values) {
				var irform = this;
				irform.disable();
				Core.restapi("GET", "json", "/api/wifi/" + values["ssid"] + "/" + values["password"], null, function(data) {
					irform.enable();
					Log.info("Connected to " + values["ssid"]); 
				}, function(message) {
					irform.enable();
					Log.error(message);
				});
			}},
		];

		// Print the form
		var irform = new Irform(container, irformConfig);
		irform.set({
			"ssid": wifiSelected
		});
	});
};

Menu.moduleConfig = function (containerId, callback) {
	if (typeof containerId === "undefined" || typeof callback === "undefined") {
		throw "Both containerId and callback must be set";
	}

	if (typeof Menu.moduleConfig.preCloseCallback === "undefined") {
		Menu.moduleConfig.preCloseCallback = function(callback) {
			var newConfig = Menu.moduleConfig.irform.get();
			console.log(newConfig);
			Dashboard.configModuleSave(Menu.moduleConfig.containerId, newConfig, callback);
		};
	}

	// Identify the module
	var moduleType = (Dashboard.isValid(containerId)) ? Dashboard.getModuleType(containerId) : "empty";

	// Save the data for later use
	Menu.moduleConfig.containerId = containerId;
	Menu.moduleConfig.callback = callback;

	var html = $("<div/>");
	Core.loading(html);
	var display = Display.create(html, {
		title: "Container " + (containerId + 1),
		id: "moduleConfig",
		callback: function() {
			Menu.moduleConfig.preCloseCallback(Menu.moduleConfig.callback);
		}
	});

	// Set the containerId as argument
	display.setArgs(containerId);

	// Load the attributes
	Core.restapi("GET", "json", "/api/config/" + moduleType, null, function(data) {
		Dashboard.configLoad(function(config, modules) {
			// Build the list of available modules
			var moduleList = {};
			var description = undefined;
			for (var type in modules) {
				moduleList[type] = modules[type]["name"];
				if (type == moduleType)
				{
					description = modules[type]["description"];
				}
			}

			var container = $("<form>");
			display.setContent(container);

			Menu.moduleConfig.activate = false;
			var irformConfig = [
				// Module list 
				{name: "module", caption: "Type", type: "select", description: description, list: moduleList, onchange: function(item, value) {
					if (Menu.moduleConfig.activate)
					{
						Menu.moduleConfig.preCloseCallback(function() {
							Menu.moduleConfig(Menu.moduleConfig.containerId, Menu.moduleConfig.callback);
						});
					}
				}},
			];
			if (data)
			{
				irformConfig = irformConfig.concat(data);
			}
			// Print the form
			Menu.moduleConfig.irform = new Irform(container, irformConfig);
			var config = Dashboard.configModuleLoad(Menu.moduleConfig.containerId);
			console.log(config);
			Menu.moduleConfig.irform.set(config);
			Menu.moduleConfig.activate = true;
		});
	});
}
