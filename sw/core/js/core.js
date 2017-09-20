var Core = function (container) {
	this.container = container;
	var core = this;

	irRequire(["Dashboard", "$().ircontainer", "Menu", "Irform"], function () {

		Dashboard.init(core.container);

		// Pimp Irform
		{
			$().irformArray.defaults.isMove = false;
		}

		// Update the ircontainer restapi 
		$().ircontainer.restapi = function (type, url, data, callbackSuccess, callbackError) {
			Core.restapi.call(this, type, "", url, data, callbackSuccess, callbackError, $(this).children("div"));
		};
		$().ircontainer.defaults.callbackLoad = function () {
			Core.loading(this);
		};

		// Configure the dashboard
		Dashboard.restapi = function (type, dataType, url, data, callback) {
			Core.restapi.call(this, type, dataType, url, data,
					function (data) {
						callback.call(this, true, data);
					}, function (message) {
						callback.call(this, false, message);
					},
					container
			);
		};
		Dashboard.onLoad = function (container) {
			Core.loading(container);
		};
		Dashboard.onLoadContainer = function(containerId) {
			// Enable long press action
			Core.longPress(this, function() {
				Menu.moduleConfig(containerId, function() {
					Dashboard.configSave();
					Dashboard.load();
				});
			});
		};

		irRequire(["$().irdashboard"], function () {
			// Load the dashboard
			Dashboard.load();
		});

		// Add the resize event
		$(window).resize(function () {
			// Load the dashboard
			Dashboard.load();
		});
	});
};

/**
 * Update the display
 */
Core.prototype.update = function () {
	var core = this;
	irRequire("Dashboard", function () {
		// Reload the display
		Dashboard.load();
	});
};

/**
 * Generic REST API function
 */
Core.restapi = function (type, datatype, url, data, callbackSuccess, callbackError, container) {

	if (typeof callbackSuccess === "undefined") {
		callbackSuccess = function() {};
	}
	if (typeof callbackError === "undefined") {
		callbackError = function() {};
	}

	var obj = this;
	var config = {
		type: type,
		url: url,
		success: function(data) {
			callbackSuccess.call(obj, data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// Create the error message
			var errorMsg = "REST API: ";

			switch (jqXHR.status) {
			case 0:
				errorMsg += "Not connect, please verify your network connection. ";
				break;
			case 404:
				errorMsg += "Requested page not found. ";
				break;
			case 500:
				errorMsg += "Internal Server Error. ";
				break;
			}
			switch (textStatus) {
			case "parsererror":
				errorMsg += "Requested JSON parse failed. ";
				break;
			case "timeout":
				errorMsg += "Time out error. ";
				break;
			case "abort":
				errorMsg += "Ajax request aborted. ";
				break;
			}
			if (jqXHR.responseText) {
				errorMsg += jqXHR.responseText;
			}

			// Log all potential errors
			Log.debug(errorMsg);
			// If container is set, use it as well to display the message
			if (typeof container !== "undefined") {
				Core.error(container, errorMsg);
			}
			callbackError.call(obj, errorMsg);
		}
	};
	if (data) {
		config["data"] = (datatype == "json") ? JSON.stringify(data) : data;
		if (datatype == "json") {
			config["contentType"] = "application/json; charset=utf-8";
		}
	}
	console.info(config);
	$.ajax(config);
};

Core.loading = function (container, message) {
	var html =  "<div class=\"loading\" style=\"display: table; width: 100%; height: 100%;\">"
			+ "<div style=\"display: table-cell; text-align: center; vertical-align: middle;\">"
			+ "<i class=\"fa fa-circle-o-notch fa-spin fa-3x fa-fw\"></i>"
			+ "<span class=\"sr-only\">Loading...</span>"
			+ ((typeof message === "undefined") ? "" : "<br/><br/>" + message)
			+ "</div></div>";
	$(container).html(html);
};

Core.error = function (container, errorMsg) {
	var html = 	"<div style=\"display: table; width: 100%; height: 100%;\">"
			+ "<div style=\"display: table-cell; text-align: center; vertical-align: middle;\">"
			+ "<p>Error</p>"
			+ "<p>" + errorMsg + "</p>"
			+ "</div></div>";
	$(container).html(html);
};

Core.longPress = function (elt, callback) {
	$(elt).on("mouseup touchend touchleave touchcancel", function() {
		clearTimeout(Core.longPress.timer);
		return false;
	}).on("mousedown touchstart", function() {
		var elt = this;
		clearTimeout(Core.longPress.timer);
		Core.longPress.timer = window.setTimeout(function() {
			callback.call(elt);
		}, 500);
		return false; 
	});
};
