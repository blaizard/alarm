(function($) {
	/**
	 * \brief .\n
	 * 
	 * \alias irdashboard
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irdashboard("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irdashboard.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irdashboard = function(arg, data) {
		/* This is the returned value */
		var retval;
		/* Go through each objects */
		$(this).each(function() {
			retval = $().irdashboard.x.call(this, arg, data);
		});
		/* Make it chainable, or return the value if any  */
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irdashboard.x = function(arg, data) {
		/* Load the default options */
		var options = $.fn.irdashboard.defaults;

		/* --- Deal with the actions / options --- */
		/* Set the default action */
		var action = "create";
		/* Deal with the action argument if it has been set */
		if (typeof arg === "string") {
			action = arg;
		}
		/* If the module is already created and the action is not create, load its options */
		if (action != "create" && $(this).data("irdashboard")) {
			options = $(this).data("irdashboard");
		}
		/* If the first argument is an object, this means options have
		 * been passed to the function. Merge them recursively with the
		 * default options.
		 */
		if (typeof arg === "object") {
			options = $.extend(true, {}, options, arg);
		}
		/* Store the options to the module */
		$(this).data("irdashboard", options);

		/* Handle the different actions */
		switch (action) {
		/* Create action */
		case "create":
			$.fn.irdashboard.create.call(this);
			break;
		/* Returned the cleaned layout */
		case "layout":
			return $.fn.irdashboard.layout.call(this);
		/* Return all the containers or the specific one at index # */
		case "container":
			return $.fn.irdashboard.container.call(this, data);
		};
	};

	$.fn.irdashboard.create = function() {
		/* Size the columns */
		var col_sel = $(this).children("[class*='irdashboard-column']");
		/* Dimensions includes padding but not borders */
		var max_width = $(this).innerWidth();
		var max_height = $(this).innerHeight();
		/* Gutter dimensions */
		var options = $(this).data("irdashboard");
		var gutter_width = options["gutterWidth"];
		var gutter_height = options["gutterHeight"];
		/* Keep track of the current container */
		var container_id = 0;
		/* Set the content div as relative to position all element inside relative to this one */
		$(this).css("position", "relative");
		/* Calculate the total width */
		var total_width = 0, nb_cols = 0;
		var re = new RegExp("irdashboard-column-?([0-9]+)?");
		$(col_sel).each(function() {
			var res = re.exec($(this).prop("class"));
			$(this).data("irdashboard-width", (typeof res[1] === "string") ? parseInt(res[1]) : 1);
			total_width += $(this).data("irdashboard-width");
			nb_cols++;
		});
		/* Update max width to take into account the gutter width */
		max_width -= (nb_cols + 1) * gutter_width;
		/* Set the width of each column */
		var prev_left = gutter_width;
		$(col_sel).each(function(i) {
			var width = max_width * $(this).data("irdashboard-width") / total_width;
			/* Do the same for each container within this column */
			var row_sel = $(this).children("[class*='irdashboard-container']");
			/* Calculate the total height */
			var total_height = 0, nb_rows = 0;
			var re = new RegExp("irdashboard-container-?([0-9]+)?");
			$(row_sel).each(function() {
				var res = re.exec($(this).prop("class"));
				$(this).data("irdashboard-height", (typeof res[1] === "string") ? parseInt(res[1]) : 1);
				total_height += $(this).data("irdashboard-height");
				nb_rows++;
			});
			/* Update max height to take into account the gutter height */
			var current_max_height = max_height - (nb_rows + 1) * gutter_height;
			/* Set the height of each container */
			var prev_top = gutter_height;
			$(row_sel).each(function(i) {
				var height = current_max_height * $(this).data("irdashboard-height") / total_height;
				$(this).css({
					position: "absolute",
					top: prev_top + "px",
					left: prev_left + "px",
					width: width + "px",
					height: height + "px"
				});
				/* Give them a unique identifier */
				$(this).addClass("irdashboard-" + (container_id++));
				prev_top += height + gutter_height;
			});
			/* Update the left position */
			prev_left += width + gutter_width;
		});
	};

	$.fn.irdashboard.container = function(data) {
		if (typeof data !== "undefined") {
			return $(this).find(".irdashboard-" + data + ":first");
		}
		/* Return all the containers */
		return $(this).find("[class*='irdashboard-container']");
	}

	$.fn.irdashboard.layout = function() {
		var $layout = $("<div/>").html($(this).html());
		/* Remove the content and the geometry */
		$layout.find("[class*='irdashboard-container']").each(function() {
			$(this).css({
				position: "",
				top: "",
				left: "",
				width: "",
				height: ""
			});
			$(this).empty();
			$(this).removeClass(function(index, css) {
				return (css.match (/(^|\s)irdashboard-[0-9]+/g) || []).join(' ');
			});
		});
		return $layout.html();
	};

	/**
	 * \alias irdashboard.defaults
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irdashboard.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irdashboard.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irdashboard class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		gutterWidth: 10,
		gutterHeight: 10
	};
})(jQuery);
