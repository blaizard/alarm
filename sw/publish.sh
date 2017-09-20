#!/bin/bash

echo "Copying to remote... (password: 1234)"
scp -r . pi@10.0.0.110:/home/pi/alarm
