var dashboardConfig = null;
var modulesConfig = null;

function tts(text, callback)
{
	/* Cannot have 2 instance of TTS running at the same time, keep only the latest one */
	if (typeof tts.singleton === "undefined") {
		tts.singleton = null;
	}
	else if (tts.singleton !== false) {
		clearTimeout(tts.singleton);
		tts.singleton = null;
	}

	/* Create the subtitle frame */
    var container = $("#ttsContainerId");
	if (!$("#ttsContainerId").length) {
		container = document.createElement("div");
		$(container).attr("id", "ttsContainerId");
		$("body").append(container)
	}

	dashboardRestAPI("GET", "http", "http://127.0.0.1:8080/tts/" + encodeURIComponent(text), null, function(isSuccess, message) {
		if (!isSuccess) {
			/* Means busy */
			tts.singleton = setTimeout(function() {
				tts(text, callback);
			}, 1000);
		}
		else {
			/* Set the text */
    		$(container).text(text);
			$(container).show();
			/* Fade the text */
			tts.singleton = setTimeout(function() {
				tts.singleton = null;
                $(container).fadeOut(1000);
			}, 2000);
			callback();
		}
	}, true);
}

function light(callback)
{
	dashboardRestAPI("GET", "http", "http://127.0.0.1:8080/light", null, function(isSuccess, message) {
		if (typeof callback === "function") {
			callback(isSuccess, message);
		}
	});
}

function containerIdFromModuleId(module_id, nth, callback)
{
	dashboardConfigLoad(function(dashboardConfig, modulesConfig) {
		for (var i in dashboardConfig["containers"]) {
			if (typeof dashboardConfig["containers"][i]["module"] === "string" && dashboardConfig["containers"][i]["module"] == module_id) {
				if (nth == 0) {
					callback(i);
					return;
				}
				nth--;
			}
		}
		callback(null);
	});
}

/* To be moved to the clock module - can keep here for debugging */
function actionsRun(actionList)
{
	/* While the action is not empty */
	while (actionList.length) {
		var action = actionList.shift();
		/* Decode the action */
		switch (action["type"]) {
		case "wait":
			setTimeout(function() {
				actionsRun(actionList);
			}, action["timer"] * 1000);
			return;
		case "module":
			var res = action["module_id"].match(/^(.+)_([0-9]+)$/);
			if (res) {
				containerIdFromModuleId(res[1], res[2], function(containerId) {
					if (containerId === null) {
						alert("Unable to locate the module");
						actionsRun(actionList)
						return;
					}
					var container = $("#content").find(".irdashboard-" + containerId);
					if (!$(container).length) {
						alert("Module not found");
						actionsRun(actionList)
						return;
					}
					$(container).ircontainer("action", action["action"], function() {
						actionsRun(actionList);
					});
				});
				return;
			}
			else {
				alert("Module ID malformed");
			}
			break;
		case "tts":
			tts(action["text"], function() {
				actionsRun(actionList);
			});
			return;
		case "ringtone":
			break;
		}
	}
}

function dashboardRestAPI(type, datatype, url, data, callback, silent)
{
	if (typeof silent === "undefined") {
		silent = false;
	}
	var obj = this;
	var config = {
		type: type,
		url: url,
		success: function(data) {
			callback.call(obj, true, data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var errorMsg = ajaxErrorToString(jqXHR, textStatus, errorThrown);
			if (!silent) {
				alert(errorMsg);
			}
			callback.call(obj, false, errorMsg);
		}
	};
	if (data) {
		config["data"] = (datatype == "json") ? JSON.stringify(data) : data;
		if (datatype == "json") {
			config["contentType"] = "application/json; charset=utf-8";
		}
	}
	$.ajax(config);
}

function dashboardLoading()
{
	return "<div class=\"loading\" style=\"display: table; width: 100%; height: 100%;\">"
			+ "<div style=\"display: table-cell; text-align: center; vertical-align: middle;\">"
			+ "<span>Loading...</span>"
			+ "</div></div>";
}

function dashboardInit()
{
	$("#content").html(dashboardLoading());

	// Read the configuration
	dashboardConfigLoad(function() {
		// Load the dashboard layout
		$("#content").html(dashboardConfig["layout"]);
		$("#content").irdashboard();
		// Load the containers
		$("#content").irdashboard("container").each(function(containerId) {
			// Set the content of the container
			if (isValidContainer(containerId)) {
				$(this).ircontainer({
                    callbackLoad: function() {
						$(this).html(dashboardLoading());
					},
					module: dashboardConfig["containers"][containerId]["module"],
					verticalAlign: dashboardConfig["containers"][containerId]["verticalAlign"],
					horizontalAlign: dashboardConfig["containers"][containerId]["horizontalAlign"],
					config: dashboardConfig["containers"][containerId]
				});
			}
			// Enable long press action
			longPress(this, function() {
				screenModuleConfig(containerId, function() {
					dashboardConfigSave();
					dashboardInit();
				});
			});
		});
	});
}

function isValidContainer(containerId)
{
	return (typeof dashboardConfig["containers"][containerId] === "object" && dashboardConfig["containers"][containerId] && typeof dashboardConfig["containers"][containerId]["module"] !== "undefined" && dashboardConfig["containers"][containerId]["module"] != "empty");
}

/**
 * This function will load the configuration
 */
function dashboardConfigLoad(callback)
{
	/* If already loaded do nothing and call directly the callback */
	if (dashboardConfig) {
		callback(dashboardConfig, modulesConfig);
		return;
	}
	/* Read the configuration */
	dashboardRestAPI("get", "json", "/api/config", null, function(is_success, data) {
		if (is_success === true) {
			dashboardConfig = data;
			/* Load the module info */
        	dashboardRestAPI("get", "json", "/api/modules", null, function(is_success, data) {
				if (is_success === true) {
					modulesConfig = data;
					if (typeof callback === "function") {
						callback(dashboardConfig, modulesConfig);
					}
				}
				else {
					alert("A problem occurred while loading the configuration file, please retry.");
				}
			});
		}
		else {
			alert("A problem occurred while loading the configuration file, please retry.");
		}
	});
}

/**
 * This function will save the current configuration
 */
function dashboardConfigSave(callback)
{
	if (!dashboardConfig) {
		return;
	}
	/* Read the configuration */
	dashboardRestAPI("put", "json", "/api/config", dashboardConfig, function(is_success, data) {
		if (is_success === true) {
			if (typeof callback === "function") {
				callback();
			}
		}
		else {
			alert("A problem occurred while saving the configuration file, please retry.");
		}
	});
}

/**
 * Create a view. The content will displayed in the view.
 * If a screen is already open, then the current content is saved
 * and a new one is created on top of it with a return button instead an exit.
 */
function createScreen(content, options)
{
	if (typeof createScreen.id === "undefined") {
        createScreen.id = 0;
	}

	/* Merge with default options */
	options = $.extend({
		callback: function() {},
		id: createScreen.id++,
		args: null,
		title: ""
	}, options);

    var main = null;
	/* If a screen with the same ID already exists, replace it */
    if ($("body > #id-screen-" + options["id"] + ".screen").length !== 0) {
		main = $("body > #id-screen-" + options["id"] + ".screen").detach();
		$("main").find(".screen-content:first").html(content);
	}
	else {
		main = document.createElement("div");
		$(main).addClass("screen");
		$(main).prop("id", "id-screen-" + options["id"]);
		$(main).data("screen-args", options["args"]);

		var close = document.createElement("div");
		$(close).addClass("screen-close");
		if ($("body > .screen").length) {
			$(close).html("<i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i>");
		}
		else {
			$(close).html("<i class=\"fa fa-times\" aria-hidden=\"true\"></i>");
		}
		$(close).click(function() {
			if (typeof options["callback"] === "function") {
				options["callback"].call(main, options["id"]);
			}
			$(main).remove();
		});
		$(main).append(close);

		var title = document.createElement("div");
		$(title).addClass("screen-title");
		$(title).html("<h1>" + options["title"] + "</h1>");
		$(main).append(title);

		var container = document.createElement("div");
		$(container).addClass("screen-content");
		$(container).html(content);
		$(main).append(container);
	}

	$("body").append(main);

	/* Returns the ID of the screen */
	return options["id"];
}

/**
 * Update the content of the screen. If no id is defined, update the current screen (or last created).
 */
function screenSetContent(content, id)
{
	var selector = (typeof id === "undefined") ? $("body > .screen:last") : $("body > #id-screen-" + id + ".screen");
	$(selector).children(".screen-content").html(content);
}

/**
 * Get the content of the screen. Return the elet itself. If no id is defined, get the current screen (or last created).
 */
function screenGetContent(id)
{
	var selector = (typeof id === "undefined") ? $("body > .screen:last") : $("body > #id-screen-" + id + ".screen");
	return $(selector).children(".screen-content");
}

/**
 * Returns true if the screen exists, false otherwise
 */
function isScreenExists(id)
{
	return ($("body > #id-screen-" + id + ".screen").length === 0) ? false : true;
}

/**
 * Return the screen arguments. If no id is defined, return the argument of the current screen (or last created).
 */
function screenGetArgs(id)
{
	var selector = (typeof id === "undefined") ? $("body > .screen:last") : $("body > #id-screen-" + id + ".screen");
	return $(selector).data("screen-args");
}

/**
 * Set the screen arguments. If no id is defined, set the argument of the current screen (or last created).
 */
function screenSetArgs(args, id)
{
	var selector = (typeof id === "undefined") ? $("body > .screen:last") : $("body > #id-screen-" + id + ".screen");
	 $(selector).data("screen-args", args);
}

function screenModuleConfig(containerId, callback)
{
	var moduleType = "empty";

	/* If the containerId is unset, it means that the window is open */
	if (typeof containerId === "undefined" && isScreenExists("moduleConfig")) {
		containerId = screenGetArgs("moduleConfig");
		moduleType = screenGetContent("moduleConfig").find("form [name=module]").val();
	}
	else if (typeof containerId !== "undefined") {
		moduleType = (isValidContainer(containerId)) ? dashboardConfig["containers"][containerId]["module"] : moduleType;
	}
	else {
		return alert("The module Id is not defined");
	}

	/* Create the view if needed */
	if (!isScreenExists("moduleConfig")) {
        createScreen("", {
			id: "moduleConfig",
			title: "Module " + containerId,
			callback: function() {
				screenModuleConfigSaveData();
				if (typeof callback === "function") {
					callback();
				}
			}
		});
	}
	/* Set the containerId */
	screenSetArgs(containerId, "moduleConfig");
	/* Set the loading icon */
    screenSetContent(dashboardLoading(), "moduleConfig");

	/* Load the attributes */
	dashboardRestAPI("get", "html", "/api/config/" + moduleType, null, function(is_success, data) {

		var container = document.createElement("form");

		/* Populate the module list */
		var moduleList = [["empty", "None"]];
		for (var id in modulesConfig) {
			var display = (typeof modulesConfig[id]["name"] === "string") ? modulesConfig[id]["name"] : id;
			moduleList.push([id, display]);
		}
		$(container).append(formHelperSelect("module", "Module", moduleList, {
			onChange: function() {
				screenModuleConfig();
			}
		}));

		/* Position */
		$(container).append(formHelperSelect("horizontalAlign", "Horizontal alignment", [["left", "Left"], ["center", "Center"], ["right", "Right"]]));
		$(container).append(formHelperSelect("verticalAlign", "Vertical alignment", [["top", "Top"], ["middle", "Middle"], ["bottom", "Bottom"]]));

		/* Add the specific content */
		$(container).append(data);

		/* Update the view */
        screenSetContent(container, "moduleConfig");

		/* Load the container data */
        screenModuleConfigLoadData(moduleType);
	});
}

/**
 * Save the data of the current screen
 */
function screenModuleConfigSaveData()
{
	/* Make sure the view is there */
	if (!isScreenExists("moduleConfig")) {
		return alert("Module configuration view is missing. Internal error.");
	}

	/* Read the container Id */
	var containerId = screenGetArgs("moduleConfig");
	/* Read the data */
	var data = formHelperGet(screenGetContent("moduleConfig").find("form:first"));

	/* Save the data only if the current menu is valid */
	if (typeof dashboardConfig["containers"][containerId] === "undefined") {
		/* Insert empty containers */
		for (var i = dashboardConfig["containers"].length; i <= containerId; i++) {
			dashboardConfig["containers"][i] = {};
		}
	}
	/* Merge the data */
	dashboardConfig["containers"][containerId] = $.extend({}, dashboardConfig["containers"][containerId], data);
}

/**
 * Load the data of the selected module
 */
function screenModuleConfigLoadData(moduleType)
{
	/* Make sure the view is there */
	if (!isScreenExists("moduleConfig")) {
		return alert("Module configuration view is missing. Internal error.");
	}

	/* Read the container Id */
	var containerId = screenGetArgs("moduleConfig");
	/* Load the values and clone it */
	var values = dashboardConfig["containers"][containerId];
	values = $.extend({}, values);
	values["module"] = (typeof moduleType === "string") ? moduleType : values["module"];

	formHelperSet(screenGetContent("moduleConfig").find("form:first"), values);
}

function longPress(elt, callback)
{
	$(elt).mouseup(function(){
		clearTimeout(longPress.timer);
		return false;
	}).mousedown(function(){
		clearTimeout(longPress.timer);
		longPress.timer = window.setTimeout(callback, 500);
		return false; 
	});
}

function screenConfig(callback)
{
	var container = document.createElement("div");
	$(container).addClass("dashboard-config");

	var itemList = [
		{title: "Layout", icon: "<i class=\"fa fa-columns\" aria-hidden=\"true\"></i>", action: function() {
			screenLayout(function() {
				dashboardConfigSave();
			});
		}},
		{title: "Theme", icon: "<i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i>", action: function() {}},
		{title: "WiFi", icon: "<i class=\"fa fa-wifi\" aria-hidden=\"true\"></i>", action: function() {}},
		{title: "Light", icon: "<i class=\"fa fa-sun-o\" aria-hidden=\"true\"></i>", action: light},
		{title: "Refresh", icon: "<i class=\"fa fa-power-off\" aria-hidden=\"true\"></i>", action: function() { location.reload(); }},
		{title: "About", icon: "<i class=\"fa fa-question\" aria-hidden=\"true\"></i>", action: function() {
			createScreen(dashboardLoading(), {
				title: "About",
				id: "about"
			});
			dashboardRestAPI("GET", "http", "about.html", null, function(isSuccess, data) {
				screenSetContent(data, "about");
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

	createScreen(container, {
		title: "Configuration",
		id: "config",
		callback: callback
	});
}

function screenLayout(callback)
{
    createScreen(dashboardLoading(), {
		title: "Layout",
		id: "layoutConfig",
		callback: callback
	});

	dashboardConfigLoad(function() {

		/* Set the layout */
		var container = document.createElement("div");
		$(container).addClass("dashboard-layout-config");
		$(container).html(dashboardConfig["layout"]);
		screenSetContent(container, "layoutConfig");
		screenGetContent("layoutConfig").children(".dashboard-layout-config").irdashboard();

		/* Set the names */
		screenGetContent("layoutConfig").irdashboard("container").each(function(containerId) {
			if (isValidContainer(containerId)) {
				/* Write the name of the valid containers */
				$(this).html(dashboardConfig["containers"][containerId]["module"]);
			}
			/* Attach a event */
			$(this).click(function() {
				screenModuleConfig(containerId, function() {
					/* Reload the layout on exit */
					screenLayout();
				});
			});
		});
	});
}


