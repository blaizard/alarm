/**
 * jQuery Module Template
 *
 * This template is used for jQuery modules.
 *
 */

(function($) {
	/**
	 * \brief .\n
	 * Auto-load the irSpiner modules for the tags with a data-irSpiner field.\n
	 * 
	 * \alias jQuery.irSpiner
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irSpiner("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irSpiner.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irSpiner = function(arg, data) {
		var retval;
		// Go through each objects
		$(this).each(function() {
			retval = $().irSpiner.x.call(this, arg, data);
		});
		// Make it chainable, or return the value if any
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irSpiner.x = function(arg, data) {
		// Load the default options
		var options = $.fn.irSpiner.defaults;

		// --- Deal with the actions / options ---
		// Set the default action
		var action = "create";
		// Deal with the action argument if it has been set
		if (typeof arg === "string") {
			action = arg;
		}
		// If the module is already created and the action is not create, load its options
		if (action != "create" && $(this).data("irSpiner")) {
			options = $(this).data("irSpiner");
		}
		// If the first argument is an object, this means options have
		// been passed to the function. Merge them recursively with the
		// default options.
		if (typeof arg === "object" || action == "create") {
			options = $.extend(true, {}, options, arg);
		}
		// Store the options to the module
		$(this).data("irSpiner", options);

		// Handle the different actions
		switch (action) {
		// Create action
		case "create":
			$.fn.irSpiner.create.call(this);
			break;
		};
	};

	$.fn.irSpiner.val = function(value) {
		var body = $(this).find("ul:first");
		var index = 0;

		// Look for the index of the value
		$(body).find("li").each(function(i) {
			if ($(this).data("value") == value) {
				index = i;
				return false;
			}
		});

		$.fn.irSpiner.select.call(this, index);
	};

	$.fn.irSpiner.select = function(index) {
		var options = $(this).data("irSpiner");

		// Make sure index is within the boundaries
		index = Math.max(index, 0);
		index = Math.min(index, options["list"].length - 1);

		// Look for the value
		var body = $(this).find("ul:first");
		var item = $(body).find("li:nth-child(" + (index+1) + ")");
		var value = $(item).data("value");

		// Return if the same selection is already active
		if (options["value"] == value) {
			return;
		}

		options["value"] = value;
		$(this).data("irSpiner", options);

		if (options.vertical) {
			$(body).css({
				top: options["middleY"] - index * options["itemHeight"]
			});
		}
		else {
			alert("todo");
		}
		$(body).find("li").removeClass("selected");
		$(body).find(item).addClass("selected");
	};

	$.fn.irSpiner.create = function() {
		var obj = this;
		var options = $(this).data("irSpiner");

		$(this).addClass("irSpiner");

		var body = $("<ul>", {"style": "top: 0px;"});

		// Build the list of elements
		var list = options["list"];
		var newList = [];
		for (var name in list) {
			var item = $("<li>");
			var value = ($.isArray(list)) ? list[name] : name;
			newList.push(value);
			$(item).data("value", value);
			$(item).html(list[name]);
			$(item).on("click touch", function() {
				$(obj).val($(this).data("value")).trigger("change");
				// Stop event handlers
				$(document).off("mouseup touchend", $.fn.irSpiner.stopScrollingEvent);
				$(document).off("mousemove", $.fn.irSpiner.onMouseScrollingEvent);
				$(document).off("touchmove", $.fn.irSpiner.onTouchScrollingEvent);
			});
			$(body).append(item);
		}
		options["list"] = newList;

		$(this).html(body);

		// Set and pre-calculate some of the key values
		if (options.vertical) {
			$(this).css("height", $(this).parent().height() + "px");
			options["itemHeight"] = $(this).find("li:first").first().outerHeight();
			options["middleY"] = $(this).height() / 2 - options["itemHeight"] / 2;
		}
		else {
			alert("todo");
		}
		$(this).data("irSpiner", options);

		// Select the first element by default
		$.fn.irSpiner.select.call(this, 0);

		$(this).on("mousedown touchstart", obj, function(e) {
			var obj = e.data;
			var options = $(this).data("irSpiner");
			var itemHeight = options["itemHeight"];
			var middleY = options["middleY"];
			var nbItems = $(this).find("li").length;

			var initialPos = parseInt($(body).css("top"));
			var pY = e.pageY || e.originalEvent.touches[0].pageY;
			var prevDeltaY = 0;

			var setPositionFromDelta = function(obj, deltaY) {
				if (Math.abs(prevDeltaY) < itemHeight / 4) {
					return;
				}
				var index = Math.round((initialPos + deltaY - middleY) / itemHeight);
				$.fn.irSpiner.select.call(obj, -index);
			};

			var timeStartMs = performance.now();

			// Create an events and save them so it can be detached later on
			// These events are used to handle scrolling
			// Before doing this, delete previous events if any
			$(document).off("mouseup touchend", $.fn.irSpiner.stopScrollingEvent);
			$(document).off("mousemove", $.fn.irSpiner.onMouseScrollingEvent);
			$(document).off("touchmove", $.fn.irSpiner.onTouchScrollingEvent);

			$.fn.irSpiner.stopScrollingEvent = function(me) {
				// Ignore if the event is too small
				if (Math.abs(prevDeltaY) < itemHeight / 2) {
					return;
				}
				var obj = me.data;
				var timeTotalMs = performance.now() - timeStartMs;
				var acceleration = Math.abs(prevDeltaY / timeTotalMs);
				if (acceleration > 0.5) {
					setPositionFromDelta(obj, prevDeltaY * acceleration * 2);
				}
				
				$(obj).trigger("change");
				// Stop event handlers
				$(document).off("mouseup touchend", $.fn.irSpiner.stopScrollingEvent);
				$(document).off("mousemove", $.fn.irSpiner.onMouseScrollingEvent);
				$(document).off("touchmove", $.fn.irSpiner.onTouchScrollingEvent);
			};
			$(document).on("mouseup touchend", obj, $.fn.irSpiner.stopScrollingEvent);

			$.fn.irSpiner.onMouseScrollingEvent = function(me) {
				// Ensure that only one event is taken into account
				me.preventDefault();
				if (me.buttons) {
					var obj = me.data;
					prevDeltaY = me.pageY - pY;
					setPositionFromDelta(obj, prevDeltaY);
				}
				else {
					$.fn.irSpiner.stopScrollingEvent(me);
				}
			};
			$(document).on("mousemove", obj, $.fn.irSpiner.onMouseScrollingEvent);

			$.fn.irSpiner.onTouchScrollingEvent = function(me) {
				// Ensure that only one event is taken into account
				if (me.originalEvent.touches && me.originalEvent.touches.length > 0) {
					var obj = me.data;
					prevDeltaY = (me.originalEvent.touches[0].pageY - pY);
					setPositionFromDelta(obj, prevDeltaY);
				}
				else {
					$.fn.irSpiner.stopScrollingEvent(me);
				}
			};
			$(document).on("touchmove", obj, $.fn.irSpiner.onTouchScrollingEvent);
		});
	};

	/**
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irSpiner.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irSpiner.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irSpiner class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		/**
		 * Element list
		 */
		list: [],
		/**
		 * Current value of the element
		 */
		value: null,
		/**
		 * Orientation
		 */
		vertical: true
	};
})(jQuery);

irRequire(["Irform"], function () {
	// Hook to the jQuery.fn.val function
	Irform.jQueryHookVal(".irSpiner",
		/*readFct*/function() {
			var options = $(this).data("irSpiner");
			return options["value"];
		},
		/*writeFct*/function(value) {
			$().irSpiner.val.call(this, value);
		}
	);
});