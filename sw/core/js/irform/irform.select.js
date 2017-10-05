/**
 * jQuery Module Template
 *
 * This template is used for jQuery modules.
 *
 */

(function($) {
	/**
	 * \brief .\n
	 * Auto-load the irSelect modules for the tags with a data-irSelect field.\n
	 * 
	 * \alias jQuery.irSelect
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irSelect("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irSelect.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irSelect = function(arg, data) {
		var retval;
		// Go through each objects
		$(this).each(function() {
			retval = $().irSelect.x.call(this, arg, data);
		});
		// Make it chainable, or return the value if any
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irSelect.x = function(arg, data) {
		// Load the default options
		var options = $.fn.irSelect.defaults;

		// --- Deal with the actions / options ---
		// Set the default action
		var action = "create";
		// Deal with the action argument if it has been set
		if (typeof arg === "string") {
			action = arg;
		}
		// If the module is already created and the action is not create, load its options
		if (action != "create" && $(this).data("irSelect")) {
			options = $(this).data("irSelect");
		}
		// If the first argument is an object, this means options have
		// been passed to the function. Merge them recursively with the
		// default options.
		if (typeof arg === "object" || action == "create") {
			options = $.extend(true, {}, options, arg);
		}
		// Store the options to the module
		$(this).data("irSelect", options);

		// Handle the different actions
		switch (action) {
		// Create action
		case "create":
			$.fn.irSelect.create.call(this);
			break;
		};
	};

	$.fn.irSelect.create = function() {
		var obj = this;
		$(this).addClass("clickable irSelect");
		$(this).click(function() {
			$(this).blur();
			$.fn.irSelect.select.call(obj);
		});
	};

	$.fn.irSelect.select = function() {
		var obj = this;
		var options = $(this).data("irSelect");
		var modal = $("<div>", {"name": "temp"});
		$(modal).irformModal({
			isCancel: false,
			onValidate: function() {
				var values = Irform.get(modal);
				$(obj).val(values.temp).trigger("change");
			}
		});
		$(modal).irSpiner(options);
		$(modal).val($(this).val());
	};

	/**
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irSelect.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irSelect.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irSelect class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		/**
		 * Element list
		 */
		list: {}
	};
})(jQuery);

irRequire(["Irform"], function () {
//	var originalSelect = Irform.defaultOptions.fields.select;
	Irform.defaultOptions.fields.select = function(name, options) {
	//	var select = originalSelect(name, options);

		var custom = $("<div>", {
			name: name
		});
		$(custom).irformCustom({
			hookValWrite: function(value) {
				var options = $(this).data("irSelect");
				var display = value;
				if (typeof options.list[value] === "string") {
					display = options.list[value];
				}
				return [value, display];
			},
		});

		custom.irSelect(options);
		return custom;
	};
});