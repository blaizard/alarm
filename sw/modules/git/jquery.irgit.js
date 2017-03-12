(function($) {
	/**
	 * \brief .\n
	 * 
	 * \alias irgit
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irgit("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irgit.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irgit = function(arg, data) {
		/* This is the returned value */
		var retval;
		/* Go through each objects */
		$(this).each(function() {
			retval = $().irgit.x.call(this, arg, data);
		});
		/* Make it chainable, or return the value if any  */
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irgit.x = function(arg, data) {
		/* Load the default options */
		var options = $.fn.irgit.defaults;

		/* --- Deal with the actions / options --- */
		/* Set the default action */
		var action = "create";
		/* Deal with the action argument if it has been set */
		if (typeof arg === "string") {
			action = arg;
		}
		/* If the module is already created and the action is not create, load its options */
		if (action != "create" && $(this).data("irgit")) {
			options = $(this).data("irgit");
		}
		/* If the first argument is an object, this means options have
		 * been passed to the function. Merge them recursively with the
		 * default options.
		 */
		if (typeof arg === "object") {
			options = $.extend(true, {}, options, arg);
		}
		/* Store the options to the module */
		$(this).data("irgit", options);

		/* Handle the different actions */
		switch (action) {
		/* Create action */
		case "create":
			$.fn.irgit.create.call(this);
			break;
		};
	};

	$.fn.irgit.create = function() {
		var options = $(this).data("irgit");
		/* Set the theme */
		$(this).addClass("irgit " + options["theme"]);
		/* Create the container */
		var container = document.createElement("div");
		$(container).addClass("irgit-container");
		$(this).html(container);
		/* Get the content */
		$.fn.irgit.update.call(this);

	};

	$.fn.irgit.update = function() {
		var options = $(this).data("irgit");
		var obj = this;
		/* Fetch te new data */
		$.getJSON(options["jsonURL"], function(data) {
			var table = document.createElement("table");
			var tr = document.createElement("tr");
			$(tr).html("<td>Repository</td><td>Unstaged</td><td>Not Pushed</td><td>Not Pulled</td>");
			$(table).append(tr);
			/* Populate the content */
			$.each(data, function(key, val) {
				var tr = document.createElement("tr");
				/* Filename */
				var td = document.createElement("td");
				var filename = val["filename"].replace(/^.*[\\\/]/, '');
				$(td).text(filename);
				$(tr).append(td);
				/* Unstagged */
				var td = document.createElement("td");
				$(td).text(val["unstaged"]);
				$(tr).append(td);
				/* Unpushed */
				var td = document.createElement("td");
				$(td).text(val["unpushed"]);
				$(tr).append(td);
				/* Unpulled */
				var td = document.createElement("td");
				$(td).text(val["unpulled"]);
				$(tr).append(td);
				$(table).append(tr);
			});
			/* Superseed the previous data */
 			$(obj).find(".irgit-container").html(table);
 			/* Call the resize callback if any */
 			if (options["resize"]) {
 				options["resize"].call(obj);
 			}
		}).fail(function(jqxhr, textStatus, error) {
			$(obj).find(".irgit-container").html("Failed to fetch data");
		});
	};

	/**
	 * \alias irgit.defaults
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irgit.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irgit.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irgit class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "irgit-android",
		/**
		 * Path where the content is
		 */
		jsonURL: "git_check.json",
		/**
		 * Callback used for resizing
		 */
		resize: null
	};
})(jQuery);
