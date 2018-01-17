# Aube

Beautiful. Simple. Smart.

![Animation](https://github.com/blaizard/alarm/blob/master/model/video.gif?raw=true)

Aube is a smart alarm clock. It will guide you from the time you touch your bed until you wake up and is here make it a pleasant experience.
Aube is 3 major ideas: a design, a light and a smart device. 

## How to build Aube

The prototype is based on a Raspberry Pi 3 with the official 7 inches touch screen.
To fully build Aube, you will need a 3d printer, electronic circuit knowledges and some time!

The source contains various directories:
- **casing**: Contains the 3d models to be printed in order to build the skeleton of Aube
- **fw**: The firmware written in C to be compiled and loaded to a Microchip SAMD21 Microcontroller
- **schematics**: The electronics to handle the LED lighting with proximity sensor and the other sensors
- **sw**: The GUI of the alarm clock, written in Vanilla-Javascript and some back-end in Python

## Why Aube?
Pronounced /ob/, it is the translation of “dawn” in French. Dawn is a peaceful and relaxing experience which Aube is here to recreate every morning.

## Features
These are the raw features of Aube:
- Stereo speakers
- White LED light to simulate sunlight (with adjustable intensity and color temperature) with hovering dimming
- Connectivity: Wi-Fi, Bluetooth and USB ports (1xUSB type-C and 2x USB type-B) for charging only
- High sensitivity microphone for sleep monitoring
- Temperature, humidity and pressure sensors
- Proximity sensor to light up the screen on proximate movements

## Design
Inspired by Nordic designs, Aube is simple, pure with straight lines and strong contrasts.
Additionally, the user can customize the design by selecting the wooden base material.

![Front view](https://github.com/blaizard/alarm/blob/master/docs/front.jpg?raw=true)

3D modelization of the casing of Aube, this contains all the necessary electronics.
![3d model](https://github.com/blaizard/alarm/blob/master/docs/3dmodel.png?raw=true)

## Light
Our well-being and mood throughout the day is largely influenced by the light we are exposed to. Aube incorporates a light made to mimic the natural sun light.
Both intensity and light temperature can vary from 6500K to 4500K to recreate at best the color temperature of the light. Fade in from 4500K to 6500K in the morning to wake up smoothly and staying at 5000K in the evening to read a book before switching off the light.

The light has capacitive hovering capability, which means, without touching the device and by simply passing your hand on top of Aube, one can dim in or out the light.

Extrat of the LED lighting circuitry
![LED lighting](https://github.com/blaizard/alarm/blob/master/docs/circuit.jpg?raw=true)

## Apps
A set of Apps are displayed on the main screen of the alarm clock to provide the user with a personalized dashboard. The layout and the Apps can be selected by the user and configured to fit customized needs.

The following describes the default Apps coming with Aube. They all come with various designs that can be selected to create a personalized experience.

![Applications](https://github.com/blaizard/alarm/blob/master/docs/apps.png?raw=true)

## Clock
The clock is the essential application for an alarm clock. It’s core functionality is to provide accurate time but also notify the user on important times or dates.

Alarms can trigger an action or a chain of actions, for example, it can be configured to slowly dimm in the LED lights and play a music through Spotify. Or open the blind and start your coffee machine… anything combination of operation is possible and configurable.

Actions can be:
- Dimm in/out the embedded LED light
- Speak out a predefined message
- Trigger actions from any Apps available (Spotify with the Music Apps, Meeting in the morning with the Calendar Apps…)
- IFTTT support to trigger up to 500+ services

## Sleep
Monitor your sleep using the integrated high sensitivity microphone. Can connect to sleep monitor devices for more accurate results.

It will also record your sleep (if you like), and give you insights (if you woke up, moved or even snored) during your sleep.

## Weather
Give you up to date information of the local weather. It can also provide you with the right forecast for the day when combined with the alarm. Or simply configured to give you the next 5 days forecast for your next vacations trip.
In addition, the weather Apps connects to internal sensors to give you current and accurate information about the pressure, humidity, luminosity and temperature of the room.

## Calendar
Connected to your personal calendar, it will inform you about your next meetings in the morning, to make sure you never miss any of your appointments!

## News
Aube will inform you of the main news every morning or RSS feed you connect it too. I can also read you a digest of the news every morning as you wake up.

## Music
Connect it to your favorite music provider: Spotify, … and it will wake you up with your favorite playlist in the morning.

## Radio
The radio Apps can connect to any digital radio or podcasts through the web to give you the right information in the morning or before you go to bed.

## Baby Monitor
Check if your baby is sleeping well with the Baby Monitor. It connects to your third party wireless camera or baby monitor to give you the information you need to ensure your peace of mind before you fall asleep.

## Countdown
Cannot wait for your next vacation? Your birthday? or your old friend coming to town? The countdown Apps will inform you about the remaining days before an event happen.

# Phone charging
In addition, Aube comes with USB ports on the back made to charge your phone. Equipped with USB Type-B and the new USB Type-C port, you should not need any other piece of electronics on your night stand anymore.

# Open Source Framework
All Apps are built on a fixed but powerful API (Application Programming Interface). This enables anyone to interact with the core functionality of Aube and hence develop compatible applications. Opening Aube to developers brings unlimited possibilities.

The process is simple, one needs to download the SDK (Software Development Kit), and follow the tutorial to develop its own application.

The application development is extremely simple in order to give anyone the possibility to develop its own Apps. In addition, applications are developed in the most predominant programming language (Javascript) and hence can be coupled with a variety of existing modules to speed up development.
