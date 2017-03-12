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
		{title: "WiFi", icon: "<i class=\"fa fa-wifi\" aria-hidden=\"true\"></i>", action: function() {}},
		{title: "Light", icon: "<i class=\"fa fa-sun-o\" aria-hidden=\"true\"></i>", action: function() { light(); }},
		{title: "Refresh", icon: "<i class=\"fa fa-power-off\" aria-hidden=\"true\"></i>", action: function() { location.reload(); }},
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
		$(item).addClass("dashboard-config-icon");
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
		callback: callback
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
		callback: callback
	});

	Dashboard.configLoad(function(config, modules) {

		// Set the layout
		var container = document.createElement("div");
		$(container).addClass("dashboard-layout-config");
		$(container).html(config["layout"]);
		display.setContent(container);

		// Create the layout
		$(container).irdashboard();

		// Set the names
		$(container).irdashboard("container").each(function(containerId) {
			if (Dashboard.isValid(containerId)) {
				// Write the name of the valid containers
				$(this).html(config["containers"][containerId]["module"]);
			}
			// Attach a event
			$(this).click(function() {
				Menu.moduleConfig(containerId, function() {
					// Reload the layout on exit
					Menu.layout();
				});
			});
		});
	});
}