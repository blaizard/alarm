process_css_default: INPUT := \
	lib/irform/css/irform.touch.min.css \
	theme/default/main.scss \
	theme/default/irform.scss \
	theme/default/notification.scss \
	theme/default/loading.scss \
	theme/default/display.scss \
	theme/default/config-menu.scss \
	theme/default/config-layout.scss

process_css_default: OUTPUT := theme/default/style.min.css

copy_css_default: INPUT := \
	theme/default/settings.svg \
	theme/default/close.svg \
	theme/default/previous.svg \
	lib/irform/css/icon
copy_css_default: OUTPUT := theme/default/