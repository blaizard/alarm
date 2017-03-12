#!/bin/sh

date
echo "$$ - Arbitrary workload start"
t=$1
while [ $t -ge 0 ]; do
	sleep 1
	echo "$$ - time left $t"
	t=`expr $t - 1`
done
