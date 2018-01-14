(function($) {
	/**
	 * \brief .\n
	 * 
	 * \alias ircontainer
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").ircontainer("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.ircontainer.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.ircontainer = function(arg, data, extra) {
		/* This is the returned value */
		var retval;
		/* Go through each objects */
		$(this).each(function() {
			retval = $().ircontainer.x.call(this, arg, data, extra);
		});
		/* Make it chainable, or return the value if any  */
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.ircontainer.x = function(arg, data, extra) {
		/* Load the default options */
		var options = $.fn.ircontainer.defaults;

		/* --- Deal with the actions / options --- */
		/* Set the default action */
		var action = "create";
		/* Deal with the action argument if it has been set */
		if (typeof arg === "string") {
			action = arg;
			/* Handle and dispatch standalone utility functions */
			switch (action) {
			case "textFill":
				$.fn.ircontainer.textFill.call(this, data);
				return;
			case "elementFill":
				$.fn.ircontainer.elementFill.call(this, data);
				return;
			}
		}
		/* If the module is already created and the action is not create, load its options */
		if (action != "create" && $(this).data("ircontainer")) {
			options = $(this).data("ircontainer");
		}
		/* If the first argument is an object, this means options have
		 * been passed to the function. Merge them recursively with the
		 * default options.
		 */
		if (typeof arg === "object") {
			options = $.extend(true, {}, options, arg);
		}
		/* Store the options to the module */
		$(this).data("ircontainer", options);

		/* Handle the different actions */
		switch (action) {
		/* Create action */
		case "create":
			$.fn.ircontainer.create.call(this);
			break;
		/* Set the text callback */
		case "actionRegister":
			$.fn.ircontainer.actionRegister.call(this, data, extra);
			break;
		/* Execute an action */
		case "action":
			var callback = options["actionList"][data];
			/* If the action is not ready yet, execute it once ready */
			if (typeof callback !== "function") {
				if (typeof callback === "undefined") {
					options["actionList"][data] = [];
				}
				options["actionList"][data].push(extra);
			}
			else {
				callback.call(this, extra);
			}
			break;
		/* Get the action list */
		case "actionList":
			var actionList = [];
			for (var actionId in options["actionList"]) {
                actionList.push(actionId);
			}
			return actionList;
		/* Get the list of parameters */
		case "config":
			return options["config"];
		};
	};

	$.fn.ircontainer.textFill = function(selector) {
		// Append span element inside the div
		var jq_elt_text;
		if (typeof selector === "undefined") {
			// Check if a container already exists
			if ($(this).children("span.ircontainer-textfill").length > 0) {
				jq_elt_text = $(this).children("span.ircontainer-textfill:first");
			}
			else {
				$(this).wrapInner("<span class=\"ircontainer-textfill\" style=\"line-height: inherit; display: inline-block\"></span>");
				jq_elt_text = $(this).children("span");
			}
		}
		else {
			jq_elt_text = $(this).find(selector);
		}
		var max_height = $(this).height();
		var max_width = $(this).width();
		var max_font_size = max_height;
		var min_font_size = 3;
		var text_height;
		var text_width;
		var font_size = parseInt(jq_elt_text.css("fontSize")) || Math.floor((max_font_size + min_font_size) / 2);

		// Compute the new size by binary search
		do {
			jq_elt_text.css("fontSize", font_size + "px");
			text_height = jq_elt_text.outerHeight();
			text_width = jq_elt_text.outerWidth();
			// Update the font size boundaries
			if (text_height > max_height || text_width > max_width) {
				max_font_size = font_size;
			}
			else {
				min_font_size = font_size;
			}
			font_size = Math.floor((max_font_size + min_font_size) / 2);
		} while (Math.abs(max_font_size - min_font_size) > 2);
		// Set the lower boundaries to make sure it fits
		jq_elt_text.css("fontSize", min_font_size + "px");
	};

	$.fn.ircontainer.elementFill = function(selector) {
		// Auto-size the text
		$(this).css({
			height: "100%",
			width: "100%"
		}).ircontainer("textFill", selector).css({
			height: "auto",
			width: "auto"
		});
	};

	/**
	 * Register an action
	 */
	$.fn.ircontainer.actionRegister = function(action_id, callback) {
		/* Read the options */
		var options = $(this).data("ircontainer");
		/* If some previous actions were pending */
		if (typeof options["actionList"][action_id] === "object") {
			var extraList = options["actionList"][action_id];
			for (var i in extraList) {
				callback.call(this, extraList[i]);
			}
		}
		options["actionList"][action_id] = callback
		$(this).data("ircontainer", options);
	};

	$.fn.ircontainer.create = function() {
		/* Read the options */
		var options = $(this).data("ircontainer");
		/* Set container ID for later use */
		if (typeof $.fn.ircontainer.create.id === "undefined") {
			$.fn.ircontainer.create.id = 0;
		}
		options["id"] = $.fn.ircontainer.create.id++;
		$(this).addClass("ircontainer-" + options["id"]);
		$(this).data("ircontainer", options);

		// Clear the content
		$(this).empty();
		$(this).css({
			overflow: "hidden",
			whiteSpace: "nowrap",
			textAlign: options["horizontalAlign"],
			//padding: options["margin"] + "px"
		});

		// Use this ghost element to create vertical alignment
		{
			var ghostElt = $("<span/>");
			$(ghostElt).css({
				display: "inline-block",
				height: "100%",
				verticalAlign: options["verticalAlign"],
				marginRight: "-0.25em"
	  		});
			$(this).append(ghostElt);
		}

		// Create the container view
		{
			var viewContainer = $("<div>", {
				class: "view view-" + options["id"]
			});

			$(viewContainer).css({
				display: "inline-block",
				verticalAlign: options["verticalAlign"],
				textAlign: options["horizontalAlign"],
				//width: "100%",
				overflow: "hidden",
				whiteSpace: "normal"
			});
			$(this).append(viewContainer);
		}

		// Populate the view
		$.fn.ircontainer.load.call(this);
	};

	/**
	 * REST API
	 */
	$.fn.ircontainer.restapi = function(type, url, data, callbackSuccess, callbackError) {
		Log.error("ircontainer.restapi needs to be implemented");
	};

	$.fn.ircontainer.getContainerSelector = function(containerId) {
		return ".ircontainer-" + (containerId) + ":first";
	};

	$.fn.ircontainer.getViewSelector = function(containerId) {
		return getContainerSelector() + " div.view-" + (containerId) + ":first";
	};

	/**
	 * Update the view of the container
	 */
	$.fn.ircontainer.load = function() {
		var options = $(this).data("ircontainer");

		options["callbackLoad"].call($(this).children(".view"));

		var data = $.extend(true, {}, options["config"], {
			"id":  options["id"]
		});

		// Load the content
		$.fn.ircontainer.restapi.call(this, "post", "/api/view/" + options["module"], data, function (data) {
			$(this).append(data);
		});
	};

	/**
	 * \alias ircontainer.defaults
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().ircontainer.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.ircontainer.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the ircontainer class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		/**
		 * Identifier used to reference the element
		 */
		id: null,
		module: "clock",
		verticalAlign: "middle",
		horizontalAlign: "center",
		margin: 20,
		config: [],
		/**
		 * List of registered actions. The key is the action ID and the value is the callback
		 */
		actionList: {},
		/**
		 * Function used to display a content while loading
		 */
		callbackLoad: function() {
			$(this).text("loading...");
		},
		/**
		 * Function called once the container is reiszing
		 */
		callbackResize: function() {
			/* By default, reload the content */
			$.fn.ircontainer.load.call(this);
		}
	};
})(jQuery);
