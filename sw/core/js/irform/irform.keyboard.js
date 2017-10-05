/**
 * jQuery Module Template
 *
 * This template is used for jQuery modules.
 *
 */

(function($) {
	/**
	 * \brief .\n
	 * Auto-load the irKeyboard modules for the tags with a data-irKeyboard field.\n
	 * 
	 * \alias jQuery.irKeyboard
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irKeyboard("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irKeyboard.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irKeyboard = function(arg, data) {
		var retval;
		// Go through each objects
		$(this).each(function() {
			retval = $().irKeyboard.x.call(this, arg, data);
		});
		// Make it chainable, or return the value if any
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irKeyboard.x = function(arg, data) {
		// Load the default options
		var options = $.fn.irKeyboard.defaults;

		// --- Deal with the actions / options ---
		// Set the default action
		var action = "create";
		// Deal with the action argument if it has been set
		if (typeof arg === "string") {
			action = arg;
		}
		// If the module is already created and the action is not create, load its options
		if (action != "create" && $(this).data("irKeyboard")) {
			options = $(this).data("irKeyboard");
		}
		// If the first argument is an object, this means options have
		// been passed to the function. Merge them recursively with the
		// default options.
		if (typeof arg === "object" || action == "create") {
			options = $.extend(true, {}, options, arg);
		}
		// Store the options to the module
		$(this).data("irKeyboard", options);

		// Handle the different actions
		switch (action) {
		// Create action
		case "create":
			$.fn.irKeyboard.create.call(this);
			break;
		};
	};

	$.fn.irKeyboard.create = function() {
		var obj = this;
		$(this).on("focus", function() {
			if ($("#irKeyboard").length == 0) {
				var options = $(this).data("irKeyboard");
				$.fn.irKeyboard.show.call(this, options.type);
			}
		});
	};

	$.fn.irKeyboard.hide = function() {
		// Delete all existing keyboards if any
		$("#irKeyboard").remove();
		$("#irKeyboard-padding").remove();
		$(document).off("click", $.fn.irKeyboard.clickOutEvent);
	}

	$.fn.irKeyboard.show = function(type) {
		var obj = this;
		var options = $(this).data("irKeyboard");
		// Look for the type of keyboard
		var preset = options.presets[type];
		// Hide any previous keyboard if any
		$.fn.irKeyboard.hide.call(obj);
		// Create the main container and fill it with the keys
		var container = $("<div>", {
			id: "irKeyboard",
			class: type
		});
		for (var rowIndex in preset) {
			var rowElt = $("<div>", {
				class: "row row-" + rowIndex
			});
			for (var keyIndex in preset[rowIndex]) {
				var key = preset[rowIndex][keyIndex];
				// Create the key
				var keyElt = $("<div>", {
					class: "key key-" + keyIndex
				});
				if (typeof key === "object") {
					$(keyElt).html(key.display);
					$(keyElt).data("value", key.callback);
				}
				else {
					$(keyElt).text(key);
					$(keyElt).data("value", key);
				}
				$(rowElt).append(keyElt);
			}
			$(container).append(rowElt);
		}

		// Add the event
		$(container).on("mousedown touchstart", ".key", function(e) {
			// Make sure that only one event is handled
			e.preventDefault();

			var key = e.currentTarget;
			var action = $(key).data("value");
			var value = $(obj).val() + "";
			var selectionStart = obj.selectionStart;
			var selectionEnd = obj.selectionEnd;
			if (typeof action === "function") {
				$(obj).val(action.call(obj, value));
			}
			else {
				action += "";
				value = value.slice(0, selectionStart) + action + value.slice(selectionEnd);
				$(obj).val(value);
				obj.selectionStart = obj.selectionEnd = selectionStart + action.length;
			}

			// If this is the first touch of this key
			if ($.fn.irKeyboard.currentKey != key) {
				// Create an event on this specific key, to support repeat
				var stopListening = function() {
					$($.fn.irKeyboard.currentKey).off("mouseup mouseout touchend touchcancel", $.fn.irKeyboard.currentKeyHandler);
					$.fn.irKeyboard.currentKey = undefined;
					$.fn.irKeyboard.currentKeyHandler = false;
					clearTimeout($.fn.irKeyboard.currentKeyTimeout);
				};
				// Delete previous handler if any
				stopListening();
				// Set the new handler
				$.fn.irKeyboard.currentKey = key;
				$.fn.irKeyboard.currentKeyHandler = function(e) {
					stopListening();
				};
				$(key).on("mouseup mouseout touchend touchcancel", $.fn.irKeyboard.currentKeyHandler);
				$.fn.irKeyboard.currentKeyTimeout = setTimeout(function() {
					var triggerKey = function() {
						$.fn.irKeyboard.currentKeyTimeout = setTimeout(function() {
							$($.fn.irKeyboard.currentKey).trigger("mousedown");
							triggerKey();
						}, options.repeatPeriod);
					};
					triggerKey();
				}, options.repeatStart);
			}
		});

		// Add the event to hide the keyboard
		$.fn.irKeyboard.clickOutEvent = function(e) {
			var obj = e.data;
			if (obj != e.target && !obj.contains(e.target) && $(e.target).parents("#irKeyboard").length == 0)
			{
				$.fn.irKeyboard.hide.call(obj);
			}
			else {
				// Keep the focus on the element
				$(obj).focus();
			}
		};
		$(document).on("click", this, $.fn.irKeyboard.clickOutEvent);

		// Display the keyboard
		$("body").append(container);

		// Add some padding to the body, to ensure that all the content is visible
		var padding = $("<div>", {
			id: "irKeyboard-padding"
		});
		$(padding).html("&nbsp;");
		$(padding).height($(container).outerHeight());
		var contentContainer = ($(this).parents(".display").length) ? $(this).parents(".display:first") : "body";
		$(contentContainer).append(padding);

		// Set the element in the middle of the viewing area (if hidden)
		var objPos = $(this).offset().top;
		var objHeight = $(this).outerHeight();
		var keyboardPos = $(container).offset().top;

		var needToMove = false;
		// Below the keyboard or
		// Above the screen (this can happen when adding the padding, everything moves up)
		if (objPos + objHeight > keyboardPos || objPos < $(document).scrollTop()) {
			var viewHeight = keyboardPos - $(document).scrollTop();
			$(contentContainer).scrollTop(objPos - viewHeight/2 + objHeight/2);
		}
	};

	$.fn.irKeyboard.Key = function (display, callback) {
		this.display = display;
		this.callback = callback;
	};

	$.fn.irKeyboard.keys = {
		space: new $.fn.irKeyboard.Key("", ' '),
		backspace: new $.fn.irKeyboard.Key("<i class=\"fa fa-long-arrow-left\" aria-hidden=\"true\"></i>", function(value) { return value = value.slice(0, -1); }),
		special: new $.fn.irKeyboard.Key("<small>?123</small>", function(value) {
			$.fn.irKeyboard.show.call(this, "special");
			return value;
		}),
		alphabetical: new $.fn.irKeyboard.Key("<small>abc</small>", function(value) {
			$.fn.irKeyboard.show.call(this, "alphabetical");
			return value;
		})
	};

	/**
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irKeyboard.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irKeyboard.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irKeyboard class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		presets : {
			alphabetical: [
				['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
				['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
				[$.fn.irKeyboard.keys.special, 'z', 'x', 'c', 'v', 'b', 'n', 'm', $.fn.irKeyboard.keys.backspace],
				[$.fn.irKeyboard.keys.space]
			],
			special: [
				['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
				['@', '#', '$', '%', '&', '*', '-', '+', '(', ')'],
				[$.fn.irKeyboard.keys.alphabetical, '!', '"', '\'', ':', ';', '/', '?', $.fn.irKeyboard.keys.backspace],
				['.', $.fn.irKeyboard.keys.space, ',']
			]
		},
		type: "alphabetical",
		/**
		 * Time in ms before the key repeat starts
		 */
		 repeatStart: 500,
		 /**
		  * Period for the key repeat in ms
		  */
		 repeatPeriod: 50
	};
})(jQuery);

// Attach the keyboard to basic elements
irRequire(["Irform"], function () {
	var originalInput = Irform.defaultOptions.fields.input;
	Irform.defaultOptions.fields.input = function(name, options) {
		var elt = originalInput(name, options);
		$(elt).irKeyboard();
		return elt;
	};
	var originalPassword = Irform.defaultOptions.fields.password;
	Irform.defaultOptions.fields.password = function(name, options) {
		var elt = originalPassword(name, options);
		$(elt).irKeyboard();
		return elt;
	};
});