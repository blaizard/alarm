var Display = function(options) {

	if (typeof Display.id === "undefined") {
		Display.id = 0;
	}

	// Merge with default options
	this.options = $.extend({
		callback: function() {},
		id: Display.id++,
		args: null,
		title: ""
	}, options);

	var main = document.createElement("div");
	$(main).addClass("display");
	$(main).prop("id", "id-display-" + this.options["id"]);
	$(main).data("display", this);

	var close = document.createElement("div");
	$(close).addClass("display-close");
	if ($("body > .display").length) {
		$(close).addClass("previous");
	}
	$(close).click(function() {
		var main = $(this).parent();
		var obj = main.data("display");
		if (typeof obj.options["callback"] === "function") {
			obj.options["callback"].call(obj);
		}
		$(main).remove();
		delete obj;
	});
	$(main).append(close);

	var title = document.createElement("div");
	$(title).addClass("display-title");
	$(title).html("<h1>" + this.options["title"] + "</h1>");
	$(main).append(title);

	var container = document.createElement("div");
	$(container).addClass("display-content");
	$(main).append(container);

	$("body").append(main);

	this.main = main;
};

Display.create = function (content, options) {

	var display = (typeof options["id"] !== "undefined") ? Display.get(options["id"]) : null;

	// Create a display only if it does not exists
	if (!display) {
		display = new Display(options);
	}

	// Set the content
	display.setContent(content)

	return display;
}

Display.get = function (id) {
	var main = $("body > #id-display-" + id + ".display");
	if (main.length) {
		return $(main).data("display");
	}
	return null;
}

/**
 * Get the active display
 */
Display.getActive = function () {
	var main = $("body > .display:last");
	if (main.length) {
		return $(main).data("display");
	}
	return null;
}

Display.prototype.getId = function () {
	return this.options["id"];
}

Display.prototype.getArgs = function () {
	return this.options["args"];
}

Display.prototype.setArgs = function (args) {
	this.options["args"] = args;
}

/**
 * Update the content of the display.
 */
Display.prototype.setContent = function (content) {
	$(this.main).children(".display-content").html(content);
}

/**
 * Get the content of the display. Return the elt itself.
 */
Display.prototype.getContent = function () {
	return $(selector).children(".display-content");
}
