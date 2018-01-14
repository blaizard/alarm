var Log = function() {
};

Log.init = function() {

	irRequire(["Logger"], function() {

		// Create the error handler, using https://github.com/jonnyreeves/js-logger
		Logger.useDefaults();

		// Override alert and the default error handler
		(function(proxied) {
			window.alert = function(msg) {
				Logger.error(msg);
			};
		}) (window.alert);
		window.onerror = function(message, source, lineno, colno, error) {
			Logger.error("Error: " + message + " on " + source + " (line: " + lineno + ")");
		};

		// Update the irRequire error handler
		irRequire.e = function(msg) {
			Logger.error("irRequire: " + msg);
		};

		// Create the logger
		irRequire(["jQuery", "Irform"], function() {
			Logger.setHandler(function(messages, context) {
				var notifyOptions = {
					type: "info",
					container: "#notification",
					group: true
				};
				var logPrefix = "[" + new Date().toLocaleString() + "] ";
				switch (context.level) {
				case Logger.DEBUG:
					notifyOptions.type = "debug";
					logPrefix += "[DEBUG] ";
					break;
				case Logger.INFO:
					notifyOptions.type = "info";
					logPrefix += "[INFO] ";
					break;
				case Logger.WARN:
					notifyOptions.type = "warning";
					logPrefix += "[WARNING] ";
					break;
				case Logger.ERROR:
					notifyOptions.type = "error";
					logPrefix += "[ERROR] ";
					break;
				}
				// Set the message
				var notification = new Irnotify(messages[0], notifyOptions);
				setTimeout(function() {
					$(notification.entry).fadeOut(400, function() {
						notification.delete();
					});
				}, 5000);
				// Also log the message on the console
				console.info(logPrefix + "" + messages[0]);
			});

			// The logger is not ready
			Log.ready = true;
		});

	});
};

Log.ready = false;

Log.info = function(msg) {
	if (Log.ready) {
		Logger.info(msg);
	}
	else {
		console.info(msg);
	}
};

Log.error = function(msg) {
	if (Log.ready) {
		Logger.error(msg);
	}
	else {
		console.error(msg);
	}
};

Log.debug = function(msg) {
	console.log(msg);
};

Log.warn = function(msg) {
	if (Log.ready) {
		Logger.warn(msg);
	}
	else {
		console.warn(msg);
	}
};
