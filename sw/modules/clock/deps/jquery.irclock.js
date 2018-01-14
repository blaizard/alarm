(function($) {
	/**
	 * \brief .\n
	 * 
	 * \alias irclock
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irclock("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irclock.defaults a the complete list.
	 *
	 * \note The analog clock is taken from https://cssanimation.rocks/clocks/
	 *
	 * \return {jQuery}
	 */
	$.fn.irclock = function(arg, data) {
		/* This is the returned value */
		var retval;
		/* Go through each objects */
		$(this).each(function() {
			retval = $().irclock.x.call(this, arg, data);
		});
		/* Make it chainable, or return the value if any  */
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irclock.x = function(arg, data) {
		/* Load the default options */
		var options = $.fn.irclock.defaults;

		/* --- Deal with the actions / options --- */
		/* Set the default action */
		var action = "create";
		/* Deal with the action argument if it has been set */
		if (typeof arg === "string") {
			action = arg;
		}
		/* If the module is already created and the action is not create, load its options */
		if (action != "create" && $(this).data("irclock")) {
			options = $(this).data("irclock");
		}
		/* If the first argument is an object, this means options have
		 * been passed to the function. Merge them recursively with the
		 * default options.
		 */
		if (typeof arg === "object") {
			options = $.extend(true, {}, options, arg);
		}
		/* Store the options to the module */
		$(this).data("irclock", options);

		/* Handle the different actions */
		switch (action) {
		/* Create action */
		case "create":
			$.fn.irclock.create.call(this);
			break;
		/* Get the current date */
		case "value":
			return $.fn.irclock.getDate.call(this);
		};
	};

	$.fn.irclock.createDigital = function() {
		var elt_time = document.createElement("div");
		$(elt_time).addClass("irclock-time");
		$(this).append(elt_time);
		var elt_date = document.createElement("div");
		$(elt_date).addClass("irclock-date");
		$(this).append(elt_date);
		var elt_audio = document.createElement("div");
		$(elt_audio).addClass("irclock-audio");
		$(elt_audio).css("display", "none");
		$(this).append(elt_audio);
		var elt_alarm = document.createElement("div");
		$(elt_alarm).addClass("irclock-alarm");
		$(this).append(elt_alarm);
	};

	$.fn.irclock.createAnalog = function() {
		var content = "<div class=\"clock-analog\">"
			+ "<div class=\"background-container\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 226.6 233.8\"><path d=\"M105.5 22.7V6.4h-5.9V4.3c.8 0 1.5-.1 2.2-.2.7-.1 1.4-.3 2-.7.6-.3 1.1-.8 1.5-1.3.4-.6.7-1.3.8-2.1h2.1v22.7h-2.7zM114.1 4.8c.3-1 .8-1.8 1.4-2.5.6-.7 1.4-1.3 2.4-1.7.9-.4 2-.6 3.2-.6 1 0 1.9.1 2.8.4.9.3 1.6.7 2.3 1.2.6.5 1.1 1.2 1.5 2 .4.8.6 1.7.6 2.8 0 1-.2 1.9-.5 2.7s-.7 1.5-1.2 2.1c-.5.6-1.1 1.2-1.8 1.6-.7.5-1.3 1-2 1.4-.7.4-1.4.8-2.1 1.3s-1.3.9-1.9 1.3c-.6.5-1.1 1-1.5 1.5s-.7 1.2-.8 1.9h11.6v2.4h-14.8c.1-1.3.3-2.5.7-3.4.4-.9.8-1.8 1.4-2.5s1.2-1.3 2-1.9c.7-.5 1.5-1 2.3-1.5 1-.6 1.8-1.1 2.5-1.6s1.3-1 1.8-1.5.8-1.1 1.1-1.7.4-1.3.4-2.1c0-.6-.1-1.2-.4-1.7-.2-.5-.5-.9-.9-1.3s-.9-.6-1.4-.8c-.5-.2-1.1-.3-1.7-.3-.8 0-1.5.2-2 .5-.6.3-1 .8-1.4 1.3-.4.5-.6 1.1-.8 1.8s-.2 1.3-.2 2H114c-.3-1-.2-2.1.1-3.1zM166.5 38.2V21.9h-5.9v-2.2c.8 0 1.5-.1 2.2-.2.7-.1 1.4-.3 2-.7.6-.3 1.1-.8 1.5-1.3.4-.6.7-1.3.8-2.1h2.1v22.7h-2.7zM198.9 59.2c.3-1 .8-1.8 1.4-2.5.6-.7 1.4-1.3 2.4-1.7.9-.4 2-.6 3.2-.6 1 0 1.9.1 2.8.4.9.3 1.6.7 2.3 1.2.6.5 1.1 1.2 1.5 2 .4.8.6 1.7.6 2.8 0 1-.2 1.9-.5 2.7s-.7 1.5-1.2 2.1c-.5.6-1.1 1.2-1.8 1.6-.7.5-1.3 1-2 1.4-.7.4-1.4.8-2.1 1.3s-1.3.9-1.9 1.3c-.6.5-1.1 1-1.5 1.5s-.7 1.2-.8 1.9h11.6V77H198c.1-1.3.3-2.5.7-3.4.4-.9.8-1.8 1.4-2.5s1.2-1.3 2-1.9c.7-.5 1.5-1 2.3-1.5 1-.6 1.8-1.1 2.5-1.6s1.3-1 1.8-1.5.8-1.1 1.1-1.7.4-1.3.4-2.1c0-.6-.1-1.2-.4-1.7-.2-.5-.5-.9-.9-1.3s-.9-.6-1.4-.8c-.5-.2-1.1-.3-1.7-.3-.8 0-1.5.2-2 .5-.6.3-1 .8-1.4 1.3-.4.5-.6 1.1-.8 1.8s-.2 1.3-.2 2h-2.7c-.2-1.1-.1-2.1.2-3.1zM217.6 115.1H218.5c.6 0 1.1-.1 1.6-.2s1-.4 1.4-.7c.4-.3.7-.7.9-1.2.2-.5.4-1 .4-1.6 0-1.2-.4-2.1-1.2-2.7-.8-.6-1.7-.9-2.9-.9-.7 0-1.4.1-1.9.4-.5.3-1 .6-1.3 1.1-.4.4-.6 1-.8 1.6-.2.6-.3 1.2-.3 1.9h-2.7c0-1.1.2-2.1.5-3s.8-1.7 1.3-2.3c.6-.6 1.3-1.1 2.2-1.5.9-.4 1.9-.5 3-.5 1 0 1.9.1 2.7.4s1.6.6 2.2 1.1c.6.5 1.1 1.1 1.5 1.9s.5 1.7.5 2.7c0 1-.3 1.9-.9 2.7-.6.8-1.3 1.4-2.2 1.8v.1c1.4.3 2.4 1 3.1 2 .7 1 1 2.2 1 3.6 0 1.1-.2 2.1-.6 3-.4.9-1 1.6-1.7 2.2s-1.5 1-2.5 1.3-2 .4-3 .4c-1.2 0-2.2-.2-3.1-.5-.9-.3-1.7-.8-2.4-1.4-.7-.6-1.2-1.4-1.5-2.3-.4-.9-.5-2-.5-3.1h2.7c0 1.5.5 2.7 1.3 3.6.8.9 2 1.4 3.6 1.4.7 0 1.3-.1 1.9-.3.6-.2 1.1-.5 1.6-.9s.8-.8 1.1-1.4.4-1.2.4-1.8c0-.7-.1-1.3-.4-1.9s-.6-1-1-1.4-.9-.7-1.5-.8-1.2-.3-1.9-.3c-.6 0-1.1 0-1.6.1V115c-.1.1 0 .1.1.1zM214.2 173.8v2.4h-3.1v5.3h-2.6v-5.3h-10v-2.6l10.3-14.8h2.2v15h3.2zm-5.6-11.1l-7.6 11.1h7.6v-11.1zM163.7 199.4l-1.2 6.5.1.1c.5-.6 1.1-1 1.9-1.2.8-.3 1.6-.4 2.3-.4 1 0 2 .2 2.8.5.9.3 1.7.8 2.3 1.5.7.7 1.2 1.5 1.6 2.4s.6 2.1.6 3.4c0 1-.2 1.9-.5 2.8-.3.9-.8 1.7-1.5 2.4s-1.5 1.3-2.5 1.7-2.1.6-3.5.6c-1 0-1.9-.1-2.8-.4s-1.6-.7-2.3-1.2-1.2-1.2-1.6-2c-.4-.8-.6-1.7-.6-2.8h2.7c0 .6.2 1.1.4 1.6s.6.9 1 1.3.9.7 1.5.9c.6.2 1.2.3 1.9.3.6 0 1.3-.1 1.8-.3.6-.2 1.1-.6 1.5-1 .4-.4.8-1 1-1.7.3-.7.4-1.5.4-2.4 0-.7-.1-1.4-.4-2.1s-.6-1.2-1-1.6-1-.8-1.6-1.1-1.3-.4-2.1-.4c-.9 0-1.7.2-2.4.6-.7.4-1.3.9-1.8 1.6l-2.3-.1 2.1-11.8h11.2v2.4h-9zM116.4 214.1c-.7-.6-1.5-.9-2.6-.9-1.2 0-2.1.3-2.8.8s-1.3 1.3-1.6 2.1-.7 1.8-.8 2.8c-.1 1-.2 1.9-.3 2.8l.1.1c.6-1 1.4-1.8 2.4-2.3.9-.5 2-.7 3.3-.7 1.1 0 2.1.2 2.9.6.9.4 1.6.9 2.2 1.6s1 1.4 1.4 2.3c.3.9.5 1.9.5 2.9 0 .8-.1 1.7-.4 2.6-.3.9-.7 1.7-1.3 2.4-.6.7-1.4 1.3-2.3 1.8-1 .5-2.2.7-3.6.7-1.7 0-3-.3-4.1-1s-1.8-1.6-2.4-2.6c-.6-1.1-.9-2.2-1.1-3.5-.2-1.3-.3-2.5-.3-3.7 0-1.6.1-3.1.4-4.5.3-1.5.7-2.8 1.4-3.9.6-1.1 1.5-2 2.6-2.7 1.1-.7 2.4-1 4-1 1.9 0 3.4.5 4.5 1.5s1.7 2.4 1.9 4.3h-2.7c-.2-1.1-.6-1.9-1.3-2.5zm-4.9 7.5c-.6.3-1.1.6-1.5 1.1-.4.5-.7 1-.9 1.6-.2.6-.3 1.3-.3 2s.1 1.4.3 2c.2.6.5 1.2.9 1.6.4.4.9.8 1.5 1.1.6.3 1.3.4 2 .4s1.4-.1 2-.4c.6-.3 1-.6 1.4-1.1.4-.5.7-1 .9-1.6s.3-1.2.3-1.9-.1-1.4-.3-2c-.2-.6-.5-1.2-.8-1.6-.4-.5-.9-.8-1.4-1.1s-1.2-.4-2-.4c-.9-.1-1.5.1-2.1.3zM64.9 203.4c-1 1.6-1.9 3.2-2.7 5-.8 1.8-1.4 3.6-1.9 5.5s-.8 3.7-.9 5.5h-3c.1-1.9.4-3.8.9-5.6.5-1.8 1.1-3.6 1.9-5.2s1.7-3.3 2.7-4.8c1-1.5 2.1-2.9 3.3-4.1H53.5V197h14.7v2.3c-1.2 1.2-2.3 2.5-3.3 4.1zM15.2 162.1c.4-.7.9-1.3 1.5-1.8s1.3-.9 2.1-1.1c.8-.3 1.6-.4 2.5-.4 1.2 0 2.3.2 3.2.5.9.3 1.6.8 2.1 1.3s.9 1.2 1.2 1.9c.3.7.4 1.4.4 2.1 0 1-.3 2-.8 2.8s-1.3 1.5-2.3 1.9c1.4.4 2.4 1.1 3 2.1s1 2.2 1 3.6c0 1.1-.2 2.1-.6 2.9-.4.9-.9 1.6-1.6 2.2s-1.5 1-2.4 1.3-1.9.4-2.9.4c-1.1 0-2.1-.1-3-.4-.9-.3-1.8-.7-2.4-1.3s-1.2-1.3-1.6-2.2c-.4-.9-.6-1.9-.6-3 0-1.3.3-2.5 1-3.5s1.7-1.7 2.9-2.2c-1-.4-1.7-1-2.3-1.9-.6-.9-.9-1.8-.9-2.8-.1-.9.1-1.7.5-2.4zm2.9 16.2c.9.8 2.1 1.2 3.5 1.2.7 0 1.3-.1 1.9-.3.6-.2 1.1-.5 1.5-.9s.7-.9 1-1.4.3-1.1.3-1.8c0-.6-.1-1.2-.4-1.7s-.6-1-1-1.4-.9-.7-1.5-.9c-.6-.2-1.2-.3-1.8-.3-.7 0-1.3.1-1.9.3-.6.2-1.1.5-1.5.9-.4.4-.8.8-1 1.4-.2.5-.4 1.1-.4 1.8-.1 1.2.3 2.3 1.3 3.1zm-.3-12c.2.5.5.8.9 1.1.4.3.8.5 1.3.7.5.1 1 .2 1.6.2 1.1 0 2-.3 2.7-1 .7-.6 1.1-1.5 1.1-2.7s-.4-2-1.1-2.6c-.7-.6-1.6-.9-2.7-.9-.5 0-1 .1-1.5.2s-.9.4-1.3.7c-.4.3-.6.7-.8 1.1-.2.4-.3.9-.3 1.5-.2.7-.1 1.2.1 1.7zM4.5 125.1c.8.6 1.7.9 2.8.9 1.7 0 2.9-.7 3.7-2.2s1.3-3.6 1.4-6.6l-.1-.1c-.5 1-1.2 1.7-2.2 2.3-.9.6-2 .8-3.1.8-1.2 0-2.2-.2-3.1-.6-.9-.4-1.6-.9-2.3-1.6-.6-.7-1.1-1.5-1.4-2.4-.3-.9-.5-2-.5-3.1s.2-2.1.5-3c.4-.9.9-1.7 1.5-2.3.7-.7 1.5-1.2 2.4-1.5.9-.4 1.9-.5 3-.5s2.1.2 3 .5c.9.3 1.8.9 2.5 1.7.7.8 1.3 1.9 1.7 3.3.4 1.4.6 3.2.6 5.3 0 3.9-.6 6.9-1.9 9-1.2 2.1-3.2 3.2-6 3.2-1.9 0-3.5-.5-4.7-1.4s-2-2.4-2.1-4.4h2.7c.4 1.2.9 2.1 1.6 2.7zm7.2-14.2c-.2-.6-.5-1.2-.9-1.6s-.9-.9-1.5-1.1c-.6-.3-1.2-.4-2-.4s-1.5.1-2.1.4-1 .7-1.4 1.2c-.4.5-.6 1.1-.8 1.7-.2.6-.2 1.3-.2 2 0 .6.1 1.2.3 1.8.2.6.5 1.1.9 1.5.4.4.9.8 1.4 1.1s1.1.4 1.8.4 1.3-.1 1.9-.4 1.1-.6 1.5-1.1c.4-.5.7-1 .9-1.6.2-.6.3-1.2.3-1.9.2-.7.1-1.4-.1-2zM13.6 76V59.8H7.8v-2.2c.8 0 1.5-.1 2.2-.2.7-.1 1.4-.3 2-.7.6-.3 1.1-.8 1.5-1.3.4-.6.7-1.3.8-2.1h2.1V76h-2.8zM21.9 62.3c0-.9.1-1.8.3-2.6.2-.9.4-1.7.7-2.4.3-.8.8-1.4 1.3-2 .6-.6 1.3-1 2.1-1.4s1.9-.5 3-.5c1.2 0 2.2.2 3 .5s1.5.8 2.1 1.4c.6.6 1 1.2 1.3 2 .3.8.6 1.6.7 2.4.2.9.3 1.7.3 2.6s.1 1.8.1 2.6 0 1.7-.1 2.6-.1 1.8-.3 2.6c-.2.9-.4 1.7-.7 2.4s-.8 1.4-1.3 2c-.6.6-1.2 1-2.1 1.4s-1.8.5-3 .5-2.2-.2-3-.5-1.5-.8-2.1-1.4c-.6-.6-1-1.2-1.3-2s-.6-1.6-.7-2.4c-.2-.9-.3-1.7-.3-2.6 0-.9-.1-1.8-.1-2.6.1-.8.1-1.7.1-2.6zm2.9 5.4c.1 1.1.2 2 .5 3 .3.9.8 1.7 1.4 2.4s1.5 1 2.7 1c1.2 0 2-.3 2.7-1s1.1-1.4 1.4-2.4c.3-.9.5-1.9.5-3 .1-1.1.1-2 .1-2.9V63c0-.7-.1-1.3-.2-2s-.2-1.3-.4-2c-.2-.6-.4-1.2-.8-1.7s-.8-.9-1.3-1.2-1.2-.4-2-.4-1.4.1-2 .4c-.5.3-1 .7-1.3 1.2-.4.5-.6 1-.8 1.7-.2.6-.3 1.3-.4 2-.1.7-.1 1.3-.2 2v1.8c.1.9.1 1.9.1 2.9z\"/><g><path d=\"M53.5 38.2V21.9h-5.9v-2.2c.8 0 1.5-.1 2.2-.2.7-.1 1.4-.3 2-.7.6-.3 1.1-.8 1.5-1.3.4-.6.7-1.3.8-2.1h2.1v22.7h-2.7zM69.1 38.2V21.9h-5.9v-2.2c.8 0 1.5-.1 2.2-.2.7-.1 1.4-.3 2-.7.6-.3 1.1-.8 1.5-1.3.4-.6.7-1.3.8-2.1h2.1v22.7h-2.7z\"/></g></svg></div>"
			+ "<div class=\"hours-container\">"
			+ "<div class=\"hours\"></div>"
			+ "</div>"
			+ "<div class=\"minutes-container\">"
			+ "<div class=\"minutes\"></div>"
			+ "</div>"
			+ "<div class=\"seconds-container\">"
			+ "<div class=\"seconds\"></div>"
			+ "</div>"
			+ "</div>";
		$(this).html(content);
	};

	$.fn.irclock.create = function() {

		var options = $(this).data("irclock");
		// Set the theme
		$(this).addClass("irclock " + options.theme);
		$(this).empty();

		var options = $(this).data("irclock");
		switch (options.type) {
		case "analog":
			$.fn.irclock.createAnalog.call(this);
			break;
		case "digital":
		default:
			$.fn.irclock.createDigital.call(this);
		}

		// Update the alarm and sort them
		for (var i in options["alarmList"]) {
			options["alarmList"][i]["timestamp"] = parseInt(options["alarmList"][i]["timestamp"]);
		}
		//options["alarmList"].sort();
		/* Update the values */
		$.fn.irclock.update.call(this);
		//$.fn.irclock.alarm.call(this);
	};

	$.fn.irclock.updateAnalog = function() {
		// Read the options
		var options = $(this).data("irclock");

		var date = $.fn.irclock.getDate.call(this);
		var seconds = date.getSeconds();
		var minutes = date.getMinutes();
		var hours = date.getHours();

		// Create an object with each hand and it's angle in degrees
		var hands = [{
				hand: 'hours',
				angle: (hours * 30) + (minutes / 2)
			},
			{
				hand: 'minutes',
				angle: (minutes * 6)
			},
			{
				hand: 'seconds',
				angle: (seconds * 6)
			}
		];

		// Loop through each of these hands to set their angle
		for (var j = 0; j < hands.length; j++) {
			$('.' + hands[j].hand).each(function() {
				$(this).css({
					webkitTransform: 'rotateZ('+ hands[j].angle +'deg)',
					transform: 'rotateZ('+ hands[j].angle +'deg)'
				});
			});
		}
	};

	$.fn.irclock.updateDigital = function() {
		// Read the options
		var options = $(this).data("irclock");
		// Calculate the date
		var date = $.fn.irclock.getDate.call(this);
		var month = date.getMonth();
		var month_list = options["lang"]["months"];
		var d = date.getDate();
		var day = date.getDay();
		var day_list = options["lang"]["days"];
		var h = date.getHours();
		var m = date.getMinutes();
		if (m < 10) {
			m = "0" + m;
		}

		// Hack
	//	h = "8";
	//	m = "20";

		var dateText = day_list[day] + ", " + month_list[month] + " " + d;

		if (0) {
			/* Check the alarm */
			var alarmstampCurrent = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
			/* Identify the comming alarm */
			var alarmstamp = options["alarmList"][0]["timestamp"]; /* TODO */
			var alarmAction = options["alarmList"][0]["action"];
			var alarmText = "TODAY";
			/* Alarm */
			if (Math.floor(alarmstampCurrent / 60) == Math.floor(alarmstamp / 60)) {
				alarmText = "<< ALARM >>";
				$.fn.irclock.alarm.call(this, alarmAction);
			}
			else if (alarmstampCurrent > alarmstamp) {
				alarmText = day_list[(day + 1) % 7];
			}
			var alarmdate = new Date(alarmstamp * 1000);
			alarmText += " " + alarmdate.getHours() + ":" + ((alarmdate.getMinutes() < 10) ? "0" : "") + alarmdate.getMinutes();
			dateText += "&nbsp;&nbsp;<i class=\"fa fa-bell-o\" aria-hidden=\"true\"></i>&nbsp;&nbsp;" + alarmText;
		}
		/* Update the date */
		$(this).find(".irclock-time:first").text(h + ":" + m);
		$(this).find(".irclock-date:first").html(dateText);
	};

	$.fn.irclock.update = function() {
		// Stop the callback if the object does not exists anymore
		if ($(this).parents("body").length != 1) {
			return;
		}

		var options = $(this).data("irclock");
		switch (options.type) {
		case "analog":
			$.fn.irclock.updateAnalog.call(this);
			break;
		case "digital":
		default:
			$.fn.irclock.updateDigital.call(this);
		}

		var obj = this;
		// Auto-size the text
		$.fn.irclock.resize.call(obj);
		// Call the callback
		setTimeout(function() {
			$.fn.irclock.update.call(obj);
		}, 1000 * 60);
	};

	$.fn.irclock.alarmStop = function() {
		/* Stop the audio */
		$.fn.irclock.stopAudio.call(this);
		/* Kill the fullscreen window */
		$(this).find(".irclock-alarm").empty();
	};

	$.fn.irclock.alarm = function(callback) {
		var obj = this;
		var snoozeTime = 10;
		/* Create alarm screen */
		var container = document.createElement("div");
		$(container).addClass("irclock-fullscreen");
		/* Snooze button */
		var elt = document.createElement("div");
		$(elt).addClass("irclock-snooze");
		$(elt).html("<div class=\"irclock-snooze-text\">Snooze</div>");
		/* Create the progress bar */
		var snoozeProgress = new ProgressBar.Circle(elt, {
			strokeWidth: 20,
			easing: 'linear',
			color: '#099',
			trailWidth: 0,
			svgStyle: null
		});
		$(elt).click(function() {
			/* Disable click functionality */
			$(this).unbind("click");
			/* Stop the audio */
			$.fn.irclock.stopAudio.call(obj);
			/* Animate the progress bar */
			snoozeProgress.animate(1.0, {
				duration: snoozeTime * 1000
			}, function() {
				$(container).remove();
				/* Once completed, re-set the alarm */
				$.fn.irclock.alarm.call(obj);
			});
			/* Create the counter */
			var snoozeText = $(this).children(".irclock-snooze-text");
			$(snoozeText).data("counter", snoozeTime);
			var updateTime = function() {
				/* Retrieve the counter */
				var counter = $(snoozeText).data("counter");
				/* Make sure it still exists */
				if (!counter || counter <= 0 || $(snoozeText).parents("body").length < 1) {
					return;
				}
				var min = Math.floor(counter / 60);
				var sec = counter % 60;
				$(snoozeText).text(min + ":" + ((sec < 10) ? "0" : "") + sec);
				/* Decrease the counter and save it*/
				$(snoozeText).data("counter", --counter);
				/* Call itself */
				setTimeout(updateTime, 1000);
			};
			updateTime();
		});
		$(container).append(elt);

		/* Stop button */
		var elt = document.createElement("div");
		$(elt).addClass("irclock-stop");
		$(elt).text("Stop");
		$(elt).click(function() {
			/* Stop the snooze if any */
			snoozeProgress.destroy();
			/* Stop the alarm */
			$.fn.irclock.alarmStop.call(obj);
		});
		$(container).append(elt);
		/* Attach the container */
		$(this).find(".irclock-alarm").html(container);
		/* Play a sound */
		//$.fn.irclock.playAudio.call(this, "modules/clock/alarm/awesomemorning_alarm.mp3");
		/* Play the callback */
		callback.call(this);
	};

	/**
	 * Handles audio
	 */
	$.fn.irclock.playAudio = function(src, fadein_ms) {
		/* Fade in time in ms, set the default value */
		if (typeof fadein_ms === "undefined") {
			fadein_ms = 5000;
		}
		/* Create alarm screen */
		var elt = document.createElement("audio");
		$(elt).prop("src", src);
		$(elt).prop("loop", "true");
		/* Action once the element is loaded */
		elt.onloadeddata = function() {
			/* Stop animation if any */
			$(elt).stop();
			/* Start to play */
			elt.volume = 0;
			elt.play();
			$(elt).animate({volume: 1}, fadein_ms, "linear");
		};
		/* Apply the element to the DOM */
		$(this).find("div.irclock-audio").html(elt);
	};

	$.fn.irclock.stopAudio = function(fadeout_ms) {
		var obj = this;
		/* Fade out time in ms, set the default value */
		if (typeof fadeout_ms === "undefined") {
			fadeout_ms = 1000;
		}
		var elt = $(this).find("div.irclock-audio audio");
		if ($(elt).length > 0) {
			/* Stop animation if any */
			$(elt).stop();
			$(elt).animate({volume: 0}, fadeout_ms, "linear", function() {
				$(elt).get(0).pause();
				/* Kill the element */
				$(obj).find("div.irclock-audio").empty();
			});
		}
	};

	$.fn.irclock.resize = function() {
		// Auto-size the text
		var options = $(this).data("irclock");
		options.resize();
	};

	/**
	 * Return the current date
	 */
	$.fn.irclock.getDate = function() {
		/* Read the options */
		var options = $(this).data("irclock");
		return new Date(Date.now() + parseInt(options["offset"]) * 1000);
	};

	/**
	 * \alias irclock.defaults
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irclock.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irclock.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irclock class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "irclock-android",
		/**
		 * Offset from the original timestamp
		 */
		offset: 0,
		/**
		 * digital or analog
		 * Analog is taken from https://cssanimation.rocks/clocks/
		 */
		type: "analog",
		/**
		 * Language text
		 */
		lang: {
			days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
			months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
		},
		/**
		 * List of active alarms. Set as a list of timestamp with not date but only
		 * hours, minutes and seconds.
		 * Format ( a list of object as follow):
		 * {alarm: <timestamp>, action: function()}
		 */
		alarmList: [],
		resize: function() {}
	};
})(jQuery);
