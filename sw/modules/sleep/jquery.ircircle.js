(function($) {
	/**
	 * \brief .\n
	 * Auto-load the irCircle modules for the tags with a data-irCircle field.\n
	 * 
	 * \alias jQuery.irCircle
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irCircle("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irCircle.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irCircle = function(arg, data) {
		var retval;
		// Go through each objects
		$(this).each(function() {
			retval = $().irCircle.x.call(this, arg, data);
		});
		// Make it chainable, or return the value if any
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irCircle.x = function(arg, data) {
		// Load the default options
		var options = $.fn.irCircle.defaults;

		// --- Deal with the actions / options ---
		// Set the default action
		var action = "create";
		// Deal with the action argument if it has been set
		if (typeof arg === "string") {
			action = arg;
		}
		// If the module is already created and the action is not create, load its options
		if (action != "create" && $(this).data("irCircle")) {
			options = $(this).data("irCircle");
		}
		// If the first argument is an object, this means options have
		// been passed to the function. Merge them recursively with the
		// default options.
		if (typeof arg === "object") {
			options = $.extend(true, {}, options, arg);
		}
		// Store the options to the module
		$(this).data("irCircle", options);

		// Handle the different actions
		switch (action) {
		// Create action
		case "create":
			$.fn.irCircle.create.call(this);
			break;
		case "resize":
			$.fn.irCircle.resize.call(this);
			break;
		};
	};

	$.fn.irCircle.create = function () {
		$.fn.irCircle.resize.call(this);
	};

	$.fn.irCircle.resize = function () {

		var diameter = Math.min($(this).width(), $(this).height());
		var span = $("<span/>");

		var options = $(this).data("irCircle");
		var canvas = $("<canvas/>");
		var span = $("<span/>");

		if (typeof(G_vmlCanvasManager) !== 'undefined') {
			G_vmlCanvasManager.initElement(canvas);
		}

		canvas.get(0).height = diameter;
		canvas.get(0).width = diameter;
		var ctx = canvas.get(0).getContext('2d');

		ctx.translate(diameter / 2, diameter / 2); // change center
		ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

		var radius = (diameter - options.lineWidth) / 2;

		var drawCircle = function(color, lineWidth, percent) {
			if (radius < 0) {
				return;
			}
			percent = Math.min(Math.max(0, percent || 1), 1);
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
			ctx.strokeStyle = color;
        	ctx.lineCap = 'butt'; // butt, round or square
			ctx.lineWidth = lineWidth
			ctx.stroke();
		};

		drawCircle('#111', 2, 100 / 100);
		drawCircle('#fff', options.lineWidth, options.percent / 100);

		$(span).text((options.text) ? options.text : (options.percent + "%"));
		$(span).css({
			lineHeight: diameter + "px",
			marginTop: -diameter + "px",
		});

		$(this).addClass("irCircle").empty();
		$(this).append(canvas);
		$(this).append(span);
	};

	/**
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irCircle.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irCircle.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irCircle class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		percent: 25,
		rotate: 0,
		lineWidth: 5,
		text: null
	};
})(jQuery);
