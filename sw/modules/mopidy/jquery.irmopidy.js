(function($) {
	/**
	 * \brief .\n
	 * 
	 * \alias irmopidy
	 *
	 * \param {String|Array} [action] The action to be passed to the function. If the instance is not created,
	 * \a action can be an \see Array that will be considered as the \a options.
	 * Otherwise \a action must be a \see String with the following value:
	 * \li \b create - Creates the object and associate it to a selector. \code $("#test").irmopidy("create"); \endcode
	 *
	 * \param {Array} [options] The options to be passed to the object during its creation.
	 * See \see $.fn.irmopidy.defaults a the complete list.
	 *
	 * \return {jQuery}
	 */
	$.fn.irmopidy = function(arg, data) {
		/* This is the returned value */
		var retval;
		/* Go through each objects */
		$(this).each(function() {
			retval = $().irmopidy.x.call(this, arg, data);
		});
		/* Make it chainable, or return the value if any  */
		return (typeof retval === "undefined") ? $(this) : retval;
	};

	/**
	 * This function handles a single object.
	 * \private
	 */
	$.fn.irmopidy.x = function(arg, data) {
		/* Load the default options */
		var options = $.fn.irmopidy.defaults;

		/* --- Deal with the actions / options --- */
		/* Set the default action */
		var action = "create";
		/* Deal with the action argument if it has been set */
		if (typeof arg === "string") {
			action = arg;
		}
		/* If the module is already created and the action is not create, load its options */
		if (action != "create" && $(this).data("irmopidy")) {
			options = $(this).data("irmopidy");
		}
		/* If the first argument is an object, this means options have
		 * been passed to the function. Merge them recursively with the
		 * default options.
		 */
		if (typeof arg === "object") {
			options = $.extend(true, {}, options, arg);
		}
		/* Store the options to the module */
		$(this).data("irmopidy", options);

		/* Handle the different actions */
		switch (action) {
		/* Create action */
		case "create":
			$.fn.irmopidy.create.call(this);
			break;
		/* Play a song */
		case "play":
			$.fn.irmopidy.play.call(this);
			break;
		};
	};

	$.fn.irmopidy.create = function() {
		/* Read the options */
		var options = $(this).data("irmopidy");
		var obj = this;

		/* Build the DOM */
		var container = document.createElement("div");
		$(container).addClass("irmopidy " + options["theme"]);

		/* <div class="irmopidy-image"> */
		var image = document.createElement("div");
		$(image).addClass("irmopidy-image");

		/* <img/> */
		var img = document.createElement("img");
		$(image).append(img);

		/* <div class="irmopidy-overlay"> */
		var overlay = document.createElement("div");
		$(overlay).addClass("irmopidy-overlay");

		/* <div class="irmopidy-control"> */
		var control = document.createElement("div");
		$(control).addClass("irmopidy-control");

		/* <div class="irmopidy-previous"></div> */
		var previous = document.createElement("div");
		$(previous).addClass("irmopidy-previous");
		$(previous).html("<i class=\"fa fa-chevron-left\" aria-hidden=\"true\"></i>");
		$(previous).click(function() {
			var options = $(obj).data("irmopidy");
			if (options["ready"]) {
				options["mopidy"].playback.previous();
			}
		});
		$(control).append(previous);

		/* <div class="irmopidy-next"></div> */
		var next = document.createElement("div");
		$(next).addClass("irmopidy-next");
		$(next).html("<i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i>");
		$(next).click(function() {
			var options = $(obj).data("irmopidy");
			if (options["ready"]) {
				options["mopidy"].playback.next();
			}
		});
		$(control).append(next);

		/* <div class="irmopidy-playpause"></div> */
		var playpause = document.createElement("div");
		$(playpause).addClass("irmopidy-playpause");
		$(playpause).click(function() {
			var options = $(obj).data("irmopidy");
			var mopidy = options["mopidy"] || null;
			if (options["ready"]) {
				mopidy.playback.getState().then(function(state) {
					switch (state) {
					case "playing":
						mopidy.playback.pause();
						break;
					case "paused":
						mopidy.playback.resume();
						break;
					case "stopped":
					default:
						mopidy.playback.play();
					}
				});
			}
		});
		
		$(control).append(playpause);

		$(overlay).append(control);
		$(image).append(overlay);
		$(container).append(image);

		/* <div class="irmopidy-current"> */
		var current = document.createElement("div");
		$(current).addClass("irmopidy-current");
		$(current).html("<marquee behavior=\"scroll\" direction=\"left\">&nbsp;</marquee>");
		$(container).append(current);

		$(this).html(container);

		/* Resize the whole canevas */
		options["onResize"].call(this);

		/* Initializes the client */
		$.fn.irmopidy.init.call(this);
	};

	$.fn.irmopidy.onPlaybackState = function() {
		var options = $(this).data("irmopidy");
		var obj = this;
		options["mopidy"].playback.getState().then(function(state) {
			switch (state) {
			case "playing":
				$(obj).find(".irmopidy-playpause").html("<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>");
				break;
			case "paused":
			case "stopped":
			default:
				$(obj).find(".irmopidy-playpause").html("<i class=\"fa fa-play\" aria-hidden=\"true\"></i>");
			}
		});
	};

	$.fn.irmopidy.onNewTrack = function() {
		var identifyOptimalImage = function(imageList, minWidth, minHeight) {
			var curWidth = 0, curHeight = 0, curURL = "";
			/* Identify the optimal image size */
			for (var i in imageList) {
				if (curWidth < minWidth || curHeight < minHeight) {
					if (curWidth * curHeight < imageList[i]["width"] * imageList[i]["height"]) {
						curWidth = imageList[i]["width"];
						curHeight = imageList[i]["height"];
						curURL = imageList[i]["uri"];
					}
				}
				else if (imageList[i]["width"] >= minWidth && imageList[i]["height"] >= minHeight) {
					if (curWidth * curHeight > imageList[i]["width"] * imageList[i]["height"]) {
						curWidth = imageList[i]["width"];
						curHeight = imageList[i]["height"];
						curURL = imageList[i]["uri"];
					}
				}
			}
			return curURL;
		};
		var trackDesc = function(track) {
			var name = $('<div/>').text(track.name).html();
			var artist = $('<div/>').text(track.artists[0].name).html();
			var album = $('<div/>').text(track.album.name).html();
			return name + " <i>by</i> " + artist + " <i>from</i> " + album;
		};
		/* Read the options */
		var options = $(this).data("irmopidy");
		var mopidy = options["mopidy"];
		var obj = this;
		mopidy.playback.getCurrentTrack().then(function (track) {
			$(obj).find(".irmopidy-current marquee").html(trackDesc(track));
			/* Update the image */
			mopidy.library.getImages([track.uri]).then(function(trackList) {
				/* Get the first track only */
				for (var first in trackList) {
					var img = $(obj).find(".irmopidy-image img");
					var url = identifyOptimalImage(trackList[first], $(img).width(), $(img).height());
					/* Set the image */
					$(img).prop("src", url);
					break;
				}
			});
		});
	};

	/**
	 * Load the category list
	 */
	$.fn.irmopidy.categoryLoad = function(categoryId, callback) {
		/* Read the options */
		var options = $(this).data("irmopidy");
		var mopidy = options["mopidy"];
		var obj = this;
		switch (categoryId) {
		case "playlists":
			mopidy.playlists.asList().then(function(playlists) {
				var categoryList = [];
				for (var i in playlists) {
					categoryList.push({
						name: playlists[i]["name"],
						id: playlists[i]["uri"]
					});
				}
				var options = $(obj).data("irmopidy");
				options["playlists"] = categoryList;
				$(obj).data("irmopidy", options);
				$.fn.irmopidy.playlistLoad.call(obj, 0, function() {
					callback.call(obj);
				});
			});
			break;
		default:
			alert("Unknown category `" + categoryId + "'");
		}
	};

	/**
	 * Load the playlist. A category must be loaded first.
	 */
	$.fn.irmopidy.playlistLoad = function(playlistId, callback) {
		/* Update the playlist ID */
		var options = $(this).data("irmopidy");
		var mopidy = options["mopidy"];
		/* Make sure the playlistId is valid */
		if (playlistId < 0 || playlistId >= options["playlists"].length) {
			playlistId = 0;
		}
		options["playlistId"] = playlistId;
		$(this).data("irmopidy", options);
		var obj = this;

		/* List the tracks */
		var uri = options["playlists"][playlistId]["id"];
		/* Get all the tracks of the current caterogy and add them to the list */
		mopidy.playlists.getItems(uri).then(function(items) {
			var uris = [];
			for (var i in items) {
				uris.push(items[i]["uri"]);
			}
			mopidy.tracklist.add(undefined, undefined, undefined, uris).then(function() {
				callback.call(obj);
			});
		});
	};

	/**
	 * Initialize the client
	 */
	$.fn.irmopidy.init = function() {
		/* Read the options */
		var options = $(this).data("irmopidy");
		var obj = this;
		/* Connect to the server */
		var mopidy = new Mopidy({
			webSocketUrl: options["webSocketUrl"]
		});
		/* Save the new object */
		options["mopidy"] = mopidy;
		$(this).data("irmopidy", options);
		/* On connect... */
		mopidy.on("state:online", function() {
			/* At this point the mopidy object is connected and ready */
			var options = $(obj).data("irmopidy");
			options["ready"] = true;
			$(obj).data("irmopidy", options);
			/* List all the available playlists */
			$.fn.irmopidy.categoryLoad.call(obj, "playlists", function() {
				/* Check if something is playing, if not play */
				mopidy.playback.getState().then(function(state) {
					if (state == "stopped") {
						/* Play something random */
						$.fn.irmopidy.play.call(obj);
					}
					/* Else load the current music info */
					else {
						$.fn.irmopidy.onNewTrack.call(obj);
						$.fn.irmopidy.onPlaybackState.call(obj);
					}
					/* Call the ready cllback */
					var options = $(obj).data("irmopidy");
					options["onReady"].call(obj);
				});
			});
		});
		/* Update the track information */
		mopidy.on("event:trackPlaybackStarted", function() {
			$.fn.irmopidy.onNewTrack.call(obj);
		});
		/* On playback state change */
		mopidy.on("event:playbackStateChanged", function() {
			$.fn.irmopidy.onPlaybackState.call(obj);
		});
	};

	/**
	 * This function will play either the currently selected track
	 * or the first track if none is selected.
	 */
	$.fn.irmopidy.play = function(trackNum, playlistId) {
		/* Read the options */
		var options = $(this).data("irmopidy");
		var mopidy = options["mopidy"];
		var obj = this;
		/* Check if something is playing, if not play */
		mopidy.playback.getState().then(function(state) {
			/* Default values */
			trackNum = trackNum || 0; // TODO: handle this
			/* If the playlist selected is different, play */
			if (typeof playlistId !== "undefined" && playlistId != options["playlistId"]) {
				$.fn.irmopidy.playlistLoad.call(obj, playlistId, function() {
					mopidy.playback.play();
				});
			}
			/* If the music is stopped, load the playlist */
			else if (state == "stopped") {
				$.fn.irmopidy.playlistLoad.call(obj, options["playlistId"], function() {
					mopidy.playback.play();
				});
			}
			/* If pause, play the current track */
			else if (state == "paused") {
				mopidy.playback.resume();
			}
		});
	};

	/**
	 * \alias irmopidy.defaults
	 * \brief Default options, can be overwritten. These options are used to customize the object.
	 * Change default values:
	 * \code $().irmopidy.defaults.theme = "aqua"; \endcode
	 * \type Array
	 */
	$.fn.irmopidy.defaults = {
		/**
		 * Specifies a custom theme for this element.
		 * By default the irmopidy class is assigned to this element, this theme
		 * is an additional class to be added to the element.
		 * \type String
		 */
		theme: "irmopidy-none",
		/**
		 * The websocket address of the server
		 */
		webSocketUrl: "ws://localhost:6680/mopidy/ws/",
		/**
		 * Callback used for resizing
		 */
		onResize: function() {},
		/**
		 * Callback once the module is ready
		 */
		onReady: function() {}
	};
})(jQuery);
