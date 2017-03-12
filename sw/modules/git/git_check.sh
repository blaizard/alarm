#!/bin/bash

path=./
json=
silent=

usage() {
	cat 1>&2 <<EOF
Usage: $0 [-p <string>] [-j <string>]
	p: Path where the exploration should start
	j: JSON format to the path specified
	s: Silent mode
EOF
	exit 1
}

# Deal with options
while getopts "p:j:s" opt; do
	case $opt in
	p)
		path=${OPTARG}
		;;
	j)
		json=${OPTARG}
		;;
	s)
		silent=1
		;;
	*)
		usage
		;;
	esac
done
shift $(($OPTIND - 1))

# Get the absolute path
current_path=`pwd`
cd "$path"
path=`pwd`

json_output="["
json_first=1

# Look for all the git repositoriess
while read filename
do
	cd "$filename"
	cd ..
	filename=`pwd`

	# Look for the things that have not been commited
	not_commit_details=`git status --short | sed 's/^...//'`
	not_commit="0"
	if [ "$not_commit_details" ]; then
		not_commit=`echo "$not_commit_details" | wc -l`
	fi

	# If there are changes not pushed to origin
	not_pushed_details=`git diff HEAD origin/master --stat 2> /dev/null | grep -e '|\s*[0-9]\+' | sed 's/\s*|.*$//' | sed 's/^\s*//'`
    not_pushed="0"
	if [ "$not_pushed_details" ]; then
		not_pushed=`echo "$not_pushed_details" | wc -l`
	fi

	# Save the current origin/master commit hash
	current_ref=`git rev-parse origin/master`
	git fetch origin > /dev/null 2>&1
	if [ "$?" -ne "0" ]; then
        not_pulled="-1"
        not_pulled_details="Error fetching origin/master"
	else
		# If there are changes not pulled from origin
		not_pulled_details=`git diff $current_ref origin/master --stat 2> /dev/null | grep -e '|\s*[0-9]\+' | sed 's/\s*|.*$//' | sed 's/^\s*//'`
	    not_pulled="0"
		if [ "$not_pulled_details" ]; then
			not_pulled=`echo "$not_pulled_details" | wc -l`
		fi
	fi
	# Update the ref back to the previous state
	git update-ref refs/remotes/origin/master $current_ref

	# Display output
	if [ -z $silent ]; then
		echo "[Git repository: $filename]"
		if [ "$not_commit" -ne "0" ]; then
			echo -ne "\t$not_commit file(s) unstaged\n"
			echo -ne "\t\tFile(s): $not_commit_details\n" | tr '\n' ',' | sed 's/,/, /g' | sed 's/,\s*$//'
			echo -ne "\n"
		fi
		if [ "$not_pushed" -ne "0" ]; then
			echo -ne "\t$not_pushed file(s) not pushed\n"
			echo -ne "\t\tFile(s): $not_pushed_details\n" | tr '\n' ',' | sed 's/,/, /g' | sed 's/,\s*$//'
			echo -ne "\n"
		fi
		if [ "$not_pulled" -ne "0" ]; then
			echo -ne "\t$not_pulled file(s) not pulled\n"
			echo -ne "\t\tFile(s): $not_pulled_details\n" | tr '\n' ',' | sed 's/,/, /g' | sed 's/,\s*$//'
			echo -ne "\n"
		fi
	fi

	# Write in json format
	if [ $json ]; then
		if [ -z $json_first ]; then
			json_output="${json_output},"
		fi
		json_first=
		json_output="${json_output}{\"filename\":\"${filename}\""
		not_commit_details=`echo -ne "$not_commit_details" | xargs -I{} echo "\"{}\"" | tr '\n' ',' | sed 's/,\s*$//'`
		json_output="${json_output},\"unstaged\":${not_commit},\"unstaged_details\":[${not_commit_details}]"
		not_pushed_details=`echo -ne "$not_pushed_details" | xargs -I{} echo "\"{}\"" | tr '\n' ',' | sed 's/,\s*$//'`
	    json_output="${json_output},\"unpushed\":${not_pushed},\"unpushed_details\":[${not_pushed_details}]"
		not_pulled_details=`echo -ne "$not_pulled_details" | xargs -I{} echo "\"{}\"" | tr '\n' ',' | sed 's/,\s*$//'`
	    json_output="${json_output},\"unpulled\":${not_pulled},\"unpulled_details\":[${not_pulled_details}]}"
	fi

done <<< "$(find "$path" -name '.git' -type d)"

if [ $json ]; then
	json_output="${json_output}]"
	cd "$current_path"
	echo "$json_output" > $json
fi
