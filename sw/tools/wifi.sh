#!/bin/bash

function usage
{
cat <<EOF
Usage: ${FILE_NAME} [options] [action] [...]

options:
	-h, -?          Print this help, then exit.

action:
	list                        List all available WiFi interfaces
	connect <ssid> <password>   Connect to a network 
example:
	`basename "$0"` list
EOF
}

while getopts "h?" opt; do
	case "$opt" in
	h|\?)
		usage
		exit 0
		;;
	esac
done

shift $((OPTIND-1))
[ "$1" = "--" ] && shift

if [ "$#" -eq "0" ]; then
	usage
	exit 1
fi

case "$1" in
list)
	# List all availabe wifi networks
	ssid_list=`nmcli device wifi list | tail -n+2`

	while read -r line; do
		line_normalized=`echo "$line" | sed 's/^\s*\*//'`
		selected=`echo "$line" | awk '{print $1}' | grep -e '^\*$'`
		ssid=`echo "$line_normalized" | sed 's/^\s*\(.\+\)\s*Infra.*$/\1/'`
		strength=`echo "$line_normalized" | sed 's/^.*bit\/s//' | awk '{print $1}'`
		protected=`echo "$line_normalized" | sed 's/^.*bit\/s//' | awk '{print $3}'`
		echo "$ssid"
		echo "$strength"
		echo "$selected"
		echo "$protected"
	done <<< "$ssid_list"

	exit 0
	;;

connect)
	# Connect to a WiFi network
	if [ "$#" -ne "3" ]; then
		usage
		exit 1
	fi
	retval=`nmcli device wifi connect "$2" password "$3" 2>&1 | grep Error`
	if [ "$retval" ]; then
		echo "$retval"
		exit 2
	fi
	exit 0
	;;

*)
	usage
	exit 1
	;;
esac
