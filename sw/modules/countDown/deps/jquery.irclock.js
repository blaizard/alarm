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

	$.fn.irclock.create = function() {
		var options = $(this).data("irclock");
		/* Set the theme */
		$(this).addClass("irclock " + options.theme);
		/* Set the layout */
		$(this).empty();
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
		/* Update the alarm and sort them */
		for (var i in options["alarmList"]) {
			options["alarmList"][i]["timestamp"] = parseInt(options["alarmList"][i]["timestamp"]);
		}
		//options["alarmList"].sort();
		/* Update the values */
		$.fn.irclock.update.call(this);
		//$.fn.irclock.alarm.call(this);
	};

	$.fn.irclock.update = function() {
		/* Stop the callback if the object does not exists anymore */
		if ($(this).parents("body").length != 1) {
			return;
		}
		/* Read the options */
		var options = $(this).data("irclock");
		/* Calculate the date */
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
		/* Update the date */
		$(this).find(".irclock-time:first").text(h + ":" + m);
		$(this).find(".irclock-date:first").html(day_list[day] + ", " + month_list[month] + " " + d + "&nbsp;&nbsp;<i class=\"fa fa-bell-o\" aria-hidden=\"true\"></i>&nbsp;&nbsp;" + alarmText);
		var obj = this;
		/* Auto-size the text. Do it asynchronously to ensure that the DOM is updated */
		$.fn.irclock.resize.call(obj);
		/* Call the callback */
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
