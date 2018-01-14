# Import the modules to send commands to the system and access GPIO pins
import subprocess
import RPi.GPIO as gpio
import time

PIN = 14

def beep():
	player = subprocess.Popen(["aplay", "beep.wav"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	time.sleep(1)

# Define a function to run when an interrupt is called
def shutdown(pin):
	beep()
	print "Halting the device"
	subprocess.Popen(["sudo", "chvt", "1"]) # Switch back to the first display
	subprocess.Popen(["sudo", "shutdown", "-h", "now"])

beep()
gpio.setmode(gpio.BCM)
gpio.setup(PIN, gpio.IN)
gpio.add_event_detect(PIN, gpio.FALLING, callback=shutdown, bouncetime=1000)

while True:
	time.sleep(10)
