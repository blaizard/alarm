/**
 * jQuery Module Template
 *
 * This template is used for jQuery modules.
 *
 */

(function($) {
	/**
	 * \brief .\n
	 * Auto-load the irDate modules for the tags with a data-irDate field.\n
	 * 
	 * \alias jQuery.irDate
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irDate("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irDate.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irDate = function(arg, data) {
		var retval;
		// Go through each objects
		$(this).each(function() {
			retval = $().irDate.x.call(this, arg, data);
		});
		// Make it chainable, or return the value if any
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irDate.x = function(arg, data) {
		// Load the default options
		var options = $.fn.irDate.defaults;

		// --- Deal with the actions / options ---
		// Set the default action
		var action = "create";
		// Deal with the action argument if it has been set
		if (typeof arg === "string") {
			action = arg;
		}
		// If the module is already created and the action is not create, load its options
		if (action != "create" && $(this).data("irDate")) {
			options = $(this).data("irDate");
		}
		// If the first argument is an object, this means options have
		// been passed to the function. Merge them recursively with the
		// default options.
		if (typeof arg === "object" || action == "create") {
			options = $.extend(true, {}, options, arg);
		}
		// Store the options to the module
		$(this).data("irDate", options);

		// Handle the different actions
		switch (action) {
		// Create action
		case "create":
			$.fn.irDate.create.call(this);
			break;
		};
	};

	$.fn.irDate.create = function() {
		var obj = this;
		var options = $(this).data("irDate");
		$(this).addClass("clickable irDate");
		$(this).click(function() {
			$(this).blur();
			$.fn.irDate.select.call(obj);
		});

		// Set the running time only if the option is set
		if (options.isRunning) {
			var intervalHandle = setInterval(function() {
				if (!$(obj).parents("html").length) {
					clearInterval(intervalHandle);
					return;
				}
				var date = $.fn.irDate.val.call(obj);
				if (!options.isDelta) {
					date.setSeconds(date.getSeconds() + 1);
				}
				$.fn.irDate.val.call(obj, date);
			}, 1000);
		}
	};

	$.fn.irDate.val = function(date) {
		var options = $(this).data("irDate");

		if (typeof date === "undefined") {
			var value = $(this).val();
			if (options.isDelta) {
				var curDate = new Date();
				value = curDate.valueOf() + value * 1000;
			}

			date = new Date(value);
			if (isNaN(date.getTime())) {
				date = new Date();
			}
			return date;
		}

		var value = date.valueOf();
		if (options.isDelta) {
			var curDate = new Date();
			value -= curDate.valueOf();
			value /= 1000;
		}

		$(this).val(value);
	};

	$.fn.irDate.select = function() {
		var obj = this;
		var options = $(this).data("irDate");
		var modal = $("<div>", {
			class: "irDateSelector",
		});

		var getModalDate = function(modal) {
			var values = Irform.get(modal);
			values = $.extend({
				day: 8,
				month: 4,
				year: 1985,
				hour: 0,
				minute: 0,
				second: 0
			}, values);
			return new Date(values.year, values.month - 1, values.day, values.hour, values.minute, values.second);
		};
		var setModalDate = function(modal, date) {
			var value = {
				day: date.getDate(),
				month: date.getMonth() + 1,
				year: date.getFullYear(),
				hour: date.getHours(),
				minute: date.getMinutes(),
				second: date.getSeconds()
			};
			Irform.set(modal, value);
		};

		$(modal).irformModal({
			isCancel: false,
			onValidate: function() {
				var date = getModalDate(modal);
				console.log(date.toString());
				$.fn.irDate.val.call(obj, date);
			}
		});

		// Print the date
		if (options.isDate) {
			var day = $("<div>", {
				name: "day",
				class: "day",
			});
			$(modal).append(day);
			var month = $("<div>", {
				name: "month",
				class: "month"
			});
			$(modal).append(month);
			var year = $("<div>", {
				name: "year",
				class: "year"
			});
			$(modal).append(year);

			// Create the spinners
			var dayList = [];
			for (var i=1; i<=31; i++) {
				dayList.push(i);
			}
			$(day).irSpiner({list: dayList});
			$(month).irSpiner({list: {
					1: "January",
					2: "February",
					3: "Mars",
					4: "April",
					5: "May",
					6: "June",
					7: "July",
					8: "August",
					9: "September",
					10: "October",
					11: "November",
					12: "December"}});
			var yearList = [];
			for (var i=1985; i<=2099; i++) {
				yearList.push(i);
			}
			$(year).irSpiner({list: yearList});
		}

		// Print the time
		if (options.isTime) {
			var hour = $("<div>", {
				name: "hour",
				class: "hour",
			});
			$(modal).append(hour);
			$(modal).append("<div class=\"separator\">:</div>");
			var minute = $("<div>", {
				name: "minute",
				class: "minute"
			});
			$(modal).append(minute);

			// Create the spinners
			var hourList = [];
			for (var i=0; i<=23; i++) {
				hourList.push(i);
			}
			$(hour).irSpiner({list: hourList});

			var minuteSecondList = {};
			for (var i=0; i<=59; i++) {
				minuteSecondList[i] = (i < 10) ? "0" + i : i;
			}
			$(minute).irSpiner({list: minuteSecondList});

			// Display seconds
			if (options.isSeconds) {
				$(modal).append("<div class=\"separator\">:</div>");
				var second = $("<div>", {
					name: "second",
					class: "second"
				});
				$(modal).append(second);
				$(second).irSpiner({list: minuteSecondList});
			}
		}

		// Set the current date
		setModalDate(modal, $.fn.irDate.val.call(obj));

		// Set the running time only if the option is set
		if (options.isRunning) {
			var intervalHandle = setInterval(function() {
				if (!modal.parents("html").length) {
					clearInterval(intervalHandle);
					return;
				}
				var date = getModalDate(modal);
				date.setSeconds(date.getSeconds() + 1);
				setModalDate(modal, date);
			}, 1000);
		}
	};

	/**
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irDate.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irDate.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irDate class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "",
		/**
		 * Set a running time (second will increase)
		 */
		isRunning: true,
		/**
		 * If time should be shown
		 */
		isTime: true,
		/**
		 * If seconds should be shown
		 */
		isSeconds: true,
		/**
		 * If date should be shown
		 */
		isDate: true,
		/**
		 * Returns the delta between the current time and this one
		 */
		isDelta: false
	};
})(jQuery);

irRequire(["Irform"], function () {
	Irform.defaultOptions.fields.date = function(name, options) {
		var custom = $("<div>", {
			name: name
		});
		$(custom).irformCustom({
			hookValWrite: function(value) {
				var options = $(this).data("irDate");
				var date = null;

				// Either use the time as is or use the delta
				if (options.isDelta) {
					date = new Date();
					date = new Date(date.valueOf() + value * 1000);
				//	value = curDate.valueOf();
				}
				else {
					date = new Date(value);
				}

				var display = "";
				if (options.isDate) {
					display += date.toDateString();
				}
				if (options.isTime) {
					display += ((display) ? ", " : "") + date.getHours();
					display += ":" + ((date.getMinutes() > 9) ? "" : "0") + date.getMinutes();
					if (options.isSeconds) {
						display += ":" + ((date.getSeconds() > 9) ? "" : "0") + date.getSeconds();
					}
				}
				return [value, "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> " + display];
			}
		});
		$(custom).irDate(options);
		return custom;
	};
});
