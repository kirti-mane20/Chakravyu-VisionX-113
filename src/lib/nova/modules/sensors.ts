import type { LearningModule } from '../types'

export const sensorsModule: LearningModule = {
  id: 'sensors-mcu',
  title: 'Sensors & Microcontrollers',
  tagline: 'How machines measure the world and act on it.',
  description:
    'Transducers turn temperature, light and distance into electrical signals; microcontrollers read, decide and respond \u2014 the recipe behind every smart device.',
  icon: 'Radar',
  lessons: [
    {
      id: 'sensors-sensing',
      moduleId: 'sensors-mcu',
      title: 'Sensors: How Machines Sense the World',
      difficulty: 'medium',
      minutes: 9,
      summary:
        'A sensor converts a physical quantity into an electrical signal. Learn the main families and how raw readings become usable data.',
      sections: [
        {
          heading: 'Transducers: physical \u2192 electrical',
          body: [
            'A sensor (transducer) converts some physical quantity \u2014 temperature, light, pressure, distance, motion \u2014 into an electrical signal. A thermistor\u2019s resistance changes with temperature; an LDR (light-dependent resistor) changes resistance with light; an ultrasonic module measures distance from an echo\u2019s travel time; an IR pair detects interruption of a beam for motion counting.',
            'Sensors fall into two output families. Analog sensors output a continuously varying voltage or resistance that must be measured by an ADC (analog-to-digital converter). Digital sensors output clean 0/1 signals or send complete readings over a bus like I2C or SPI. Analog is simple and cheap; digital is immune to cable noise and needs no calibration maths on your side.',
          ],
        },
        {
          heading: 'From raw signal to useful number',
          body: [
            'Most analog sensors need conditioning before a microcontroller can read them. A voltage divider turns a resistance change into a voltage change: sensor on top, fixed resistor below, and the midpoint voltage follows the sensed quantity. An Arduino\u2019s 10-bit ADC then maps 0\u20135 V onto 0\u20131023 counts, so each count is about 4.9 mV.',
            'Raw readings are noisy: one sample jumps around. Firmware smooths this by averaging several samples, filtering, or calibrating with two known points (e.g. ice water and boiling water for a temperature sensor). Calibration converts ADC counts into real units \u2014 \u00B0C, lux, centimetres \u2014 and is the difference between "a number" and "a measurement".',
          ],
        },
        {
          heading: 'Choosing the right sensor',
          body: [
            'Practical selection questions: What range do I need? (A temperature sensor for weather \u221220\u202660 \u00B0C is different from one for an oven.) What accuracy? (DHT22 \u00B10.5 \u00B0C vs a bare thermistor \u00B12 \u00B0C.) What interface? (Analog needs an ADC pin; I2C shares two wires among many sensors.) How fast must it respond? (A PIR detects motion in ~1 s; a photodiode in nanoseconds.)',
            'In the Innovation Studio\u2019s IoT Safety project you will drive simulated temperature and gas sensors past thresholds and watch the alarm logic \u2014 the same decision structure you would deploy on real hardware.',
          ],
        },
      ],
      terms: [
        { term: 'Transducer', definition: 'A device converting one form of energy to another \u2014 here, physical quantity \u2192 electrical signal.' },
        { term: 'Thermistor', definition: 'Resistor whose resistance drops (NTC) as temperature rises.' },
        { term: 'LDR', definition: 'Light Dependent Resistor \u2014 resistance falls as illumination increases.' },
        { term: 'ADC', definition: 'Analog-to-Digital Converter \u2014 turns a voltage into a number. 10-bit ADC: 1024 levels.' },
        { term: 'I2C', definition: 'Two-wire digital bus (data + clock) letting multiple sensors share one port.' },
        { term: 'Calibration', definition: 'Mapping raw readings to real-world units using known reference points.' },
      ],
      takeaways: [
        'Sensors = physical quantity \u2192 electrical signal.',
        'Analog sensors need conditioning (divider) + ADC; digital sensors deliver clean data.',
        'Average/filter noisy readings; calibrate into real units.',
        'Choose sensors by range, accuracy, interface and speed.',
      ],
      application: {
        title: 'Automatic street lighting',
        body: 'An LDR in a voltage divider tells a microcontroller how dark it is. Below a threshold, the controller switches the lamp relay on; above it, off. Cities add a small delay/hysteresis (two thresholds) so passing clouds or headlights do not flicker the streetlights \u2014 a neat example of conditioning logic, not just the sensor, making the product.',
      },
      diagram: 'sensor-block',
      diagramCaption:
        'Signal chain of a sensing system: sensor \u2192 conditioning \u2192 ADC \u2192 microcontroller decision \u2192 actuator.',
      quiz: [
        {
          id: 'sensors-q1',
          question: 'An NTC thermistor gets warmer. Its resistance\u2026',
          options: ['Increases', 'Decreases', 'Stays constant', 'Becomes zero'],
          correctIndex: 1,
          explanation: 'NTC = Negative Temperature Coefficient: resistance falls as temperature rises.',
        },
        {
          id: 'sensors-q2',
          question: 'An Arduino UNO\u2019s 10-bit ADC reads a 0\u20135 V input. One ADC count corresponds to about\u2026',
          options: ['4.9 mV', '49 mV', '0.49 V', '5 mV exactly'],
          correctIndex: 0,
          explanation: '5 V \u00F7 1024 levels \u2248 4.88 mV per count.',
        },
        {
          id: 'sensors-q3',
          question: 'Why average multiple sensor readings?',
          options: [
            'To increase the ADC resolution',
            'To reduce random noise in the measurement',
            'To make the sensor respond faster',
            'To save power',
          ],
          correctIndex: 1,
          explanation: 'Random noise averages toward zero, so averaging improves the estimate \u2014 at the cost of response time.',
        },
      ],
    },
    {
      id: 'sensors-arduino',
      moduleId: 'sensors-mcu',
      title: 'Arduino & the Microcontroller Workflow',
      difficulty: 'medium',
      minutes: 10,
      summary:
        'Read \u2192 decide \u2192 act: understand the setup/loop program structure, GPIO pins, PWM and how code meets hardware.',
      sections: [
        {
          heading: 'What a microcontroller is',
          body: [
            'A microcontroller (MCU) is a complete tiny computer on one chip: CPU, flash memory for your program, RAM for variables, and peripherals \u2014 GPIO pins, timers, ADC, serial ports \u2014 all sharing one silicon die. An Arduino UNO is a development board around the ATmega328P MCU: 16 MHz CPU, 32 KB flash, 2 KB RAM, 14 digital I/O pins and 6 analog inputs.',
            'Unlike a PC, an MCU has no keyboard or screen; its whole world is its pins. It reads inputs (buttons, sensors), makes decisions in code, and drives outputs (LEDs, motors, displays). Cheap, low-power and instantly responsive, MCUs sit inside washing machines, drones, toys and satellites.',
          ],
        },
        {
          heading: 'setup() and loop() \u2014 the Arduino heartbeat',
          body: [
            'Every Arduino sketch has two functions. setup() runs once at power-up: initialise pin modes, start serial, seed values. Then loop() repeats forever: read inputs, compute, update outputs. This simple structure scales from blinking an LED to reading a full sensor suite.',
            'The classic first program proves the whole chain works:\n\nvoid setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}\n\nPin 13\u2019s LED blinks once per second. Trace it: pinMode configures the pin\u2019s direction register, digitalWrite sets the output latch HIGH/LOW, delay pauses the loop. Every beginner mistake is one of these three doing the wrong thing \u2014 wrong pin mode, wrong pin number, or a delay where none was intended.',
          ],
        },
        {
          heading: 'PWM \u2014 fake analog from digital pins',
          body: [
            'Digital pins are only HIGH or LOW, yet we dim LEDs and set motor speeds with PWM (Pulse Width Modulation): switch the pin on/off very fast and vary the on-fraction (duty cycle). At 50% duty the LED averages half brightness; a motor averages half speed. On the UNO, analogWrite(pin, value) uses value 0\u2013255 on pins marked ~ (3, 5, 6, 9, 10, 11) at ~490 Hz.',
            'PWM works because the load responds to the average, not the pulses. It is efficient (the transistor is either fully on or fully off, wasting little power as heat) \u2014 one reason every DC motor driver and LED dimmer you own is PWM-based. In the Innovation Studio\u2019s Smart Home project the fan speed slider does exactly this in simulation.',
          ],
        },
      ],
      terms: [
        { term: 'MCU', definition: 'Microcontroller \u2014 CPU + memory + peripherals on one chip.' },
        { term: 'GPIO', definition: 'General-Purpose Input/Output pin \u2014 readable and writable by software.' },
        { term: 'setup()', definition: 'Arduino function that runs once at boot for initialisation.' },
        { term: 'loop()', definition: 'Arduino function that repeats forever \u2014 the program\u2019s main cycle.' },
        { term: 'PWM', definition: 'Pulse Width Modulation \u2014 mimicking analog levels by varying a digital on/off duty cycle (analogWrite 0\u2013255).' },
        { term: 'Duty cycle', definition: 'Fraction of time a PWM signal stays HIGH. 255/255 = 100%, 128 \u2248 50%.' },
      ],
      takeaways: [
        'MCU = computer on a chip; the pins are its eyes and hands.',
        'setup() runs once, loop() runs forever.',
        'pinMode/digitalWrite/delay are the three primitives of every first sketch.',
        'PWM (analogWrite 0\u2013255) gives dimming and speed control from digital pins.',
      ],
      application: {
        title: 'Plant watering sentinel',
        body: 'A soil probe (resistance between two nails) feeds an ADC pin. loop() reads it, averages ten samples, and if the soil is dry drives a transistor/MOSFET to run a small pump for 3 seconds. setup() calibrates thresholds from wet and dry readings. That entire product is ~40 lines of Arduino code \u2014 exactly the read \u2192 decide \u2192 act pattern.',
      },
      diagram: 'arduino-led',
      diagramCaption:
        'Blink wiring: pin 13 \u2192 220 \u03A9 resistor \u2192 LED anode; cathode \u2192 GND. The code above drives it.',
      quiz: [
        {
          id: 'sensors-ard-q1',
          question: 'How many times does setup() run after pressing the Arduino reset button?',
          options: ['Never', 'Once', 'Every loop iteration', 'Twice'],
          correctIndex: 1,
          explanation: 'setup() runs exactly once per boot/reset; then loop() repeats indefinitely.',
        },
        {
          id: 'sensors-ard-q2',
          question: 'analogWrite(pin, 128) produces roughly what duty cycle on a PWM pin?',
          options: ['12.8%', '25%', '50%', '100%'],
          correctIndex: 2,
          explanation: '128 of 255 \u2248 50% \u2014 the pin is HIGH about half the time.',
        },
        {
          id: 'sensors-ard-q3',
          question: 'What does pinMode(7, INPUT) do?',
          options: [
            'Sets pin 7 to output 0 V',
            'Configures pin 7\u2019s direction as an input',
            'Reads pin 7 once',
            'Enables PWM on pin 7',
          ],
          correctIndex: 1,
          explanation: 'pinMode configures direction: INPUT makes the pin a high-impedance input you can digitalRead().',
        },
      ],
    },
  ],
}
