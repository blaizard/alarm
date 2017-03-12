<?php
	require_once("core/module.php");
	$id = module_unique_id();
?>

<div id="<?php echo $id; ?>"></div>

<script type="text/javascript">

	function clockModuleTest()
	{
		var values = formHelperGet($("#<?php echo $id; ?>"));
		actionsRun(values["actions"]);
	}

    $("#<?php echo $id; ?>").html(dashboardLoading());

	/* Load the configuration file */
    dashboardConfigLoad(function(dashboardConfig, modulesConfig) {

		/* Create the module list */
		var moduleList = {};
		for (var i in dashboardConfig["containers"]) {
			var container = dashboardConfig["containers"][i];
			if (!container) {
				continue;
			}
			if (typeof container["module"] !== "string" || typeof modulesConfig[container["module"]] !== "object") {
				continue;
			}
			var id = container["module"];
			if (typeof moduleList[id] === "undefined") {
				moduleList[id] = {
					idList: [],
					display: (typeof modulesConfig[id]["name"] === "string") ? modulesConfig[id]["name"] : id
				};
			}
			moduleList[id]["idList"].push(i);
		}
		var moduleDisplayList = [];
		for (var id in moduleList) {
			for (var i=0; i<moduleList[id]["idList"].length; i++) {
				/* Read the module information and extract the action list */
				var dashboardId = moduleList[id]["idList"][i];
				var ircontainer = $("#content").irdashboard("container", dashboardId);
				var actionList = $(ircontainer).ircontainer("actionList");
				if (actionList.length) {
					var info = {
						id: id + "_" + i,
						display: moduleList[id]["display"] + ((moduleList[id]["idList"].length > 1) ? (" (" + (i+1) + ")") : ""),
						actionList: actionList
					};
	                moduleDisplayList.push(info);
				}
			}
		}

		/* Clear previous content */
        $("#<?php echo $id; ?>").empty();

		$("#<?php echo $id; ?>").append(formHelperDateTime("offset", "Date", {
			fromInput: function(value) {
				var offset = (value) ? parseInt(value) : 0;
				return Math.floor(Date.now() / 1000) + offset;
			},
			/* Keep the difference between the current time and the calculated timestamp */
			toInput: function(timestamp) {
				var currentTimestamp = Math.floor(Date.now() / 1000);
				return timestamp - currentTimestamp;
			}
		}));

		$("#<?php echo $id; ?>").append(formHelperDateTime("alarm", "Alarm", {
			printYears: false,
			printMonths: false,
			printDays: false,
			printSeconds: false,
			runningTime: false,
			fromInput: function(value) {
				return (value) ? parseInt(value) : 0;
			},
			toInput: function(timestamp) {
				var d = new Date(timestamp * 1000);
				return d.getUTCHours() * 3600 + d.getUTCMinutes() * 60;
			}
		}));

		$("#<?php echo $id; ?>").append(formHelperInput("label", "Label"));

		$("#<?php echo $id; ?>").append(formHelperSlider("dimming", "Light Start Before (min)", {
			min: 0,
			max: 120,
			step: 5,
			scale: "logarithmic",
			label: "%imin"
		}));

		var title = "Actions <button class=\"btn btn-primary\" type=\"button\" onclick=\"javascript:clockModuleTest();\"><i class=\"fa fa-play\" aria-hidden=\"true\"></i> Test</button>";

		$("#<?php echo $id; ?>").append(formHelperMulti("actions", title, function() {

			var commonOptions = {
				layout: "inline",
				title: false,
				width: "150px"
			};
			var text = formHelperInput("text", "Text", commonOptions);
			/* Module ID */
			var action = formHelperSelect("action", "Action", [], {
				layout: "inline",
				title: false,
				width: "300px"
			});
			var list = [];
			for (var i in moduleDisplayList) {
                list.push([moduleDisplayList[i]["id"], moduleDisplayList[i]["display"]]);
			}
			var module = formHelperSelect("module_id", "Module", list, $.extend({
					onChange: function(value) {
						/* Clear the selection */
						$(action).find("select").empty();
	                    for (var i in moduleDisplayList) {
	                    	if (moduleDisplayList[i]["id"] === value) {
								for (var j in moduleDisplayList[i]["actionList"]) {
									var option = document.createElement("option");
									$(option).text(moduleDisplayList[i]["actionList"][j]);
									$(action).find("select").append(option);
								}
								break;
							}
						}
					}
                }, commonOptions)
			);
			var timer = formHelperSlider("timer", "Timer", {
				layout: "inline",
				title: false,
				min: 0,
				max: 60,
				scale: "logarithmic",
				label: "%is"
			});

			var container = document.createElement("form");
			$(container).addClass("form-inline");
			var type = formHelperSelect("type", "Type",
				[["tts", "Text To Speech"], ["module", "Module"], ["ringtone", "Ringtone"], ["wait", "Wait"]],
				$.extend({
					onChange: function(value) {
						$(text).hide();
						$(module).hide();
						$(action).hide();
						$(timer).hide();
						switch (value) {
						case "tts":
		                    $(text).show();
							break;
						case "module":
		                    $(module).show();
							$(action).show();
                            /* Hack to trigger a change */
							$(module).find("select").change();
							break;
						case "wait":
		                    $(timer).show();
							break;
						}
					}
				}, commonOptions)
			);

			$(container).append(type);

			$(container).append(text);
			$(container).append(module);
			$(container).append(action);
			$(container).append(timer);

			$(module).hide();
			$(action).hide();
			$(timer).hide();

			return container;
		}));
	});

</script>
