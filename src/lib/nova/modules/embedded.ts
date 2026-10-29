import type { LearningModule } from '../types'

export const embeddedModule: LearningModule = {
  id: 'embedded-iot',
  title: 'Embedded Systems & IoT',
  tagline: 'Where everything comes together: computing, sensing and connectivity.',
  description:
    'The anatomy of embedded devices and how sensors, microcontrollers and networks combine into Internet of Things systems \u2014 responsibly and securely.',
  icon: 'Network',
  lessons: [
    {
      id: 'embedded-anatomy',
      moduleId: 'embedded-iot',
      title: 'Anatomy of an Embedded System',
      difficulty: 'medium',
      minutes: 9,
      summary:
        'An embedded system is a computer hidden inside a product with one job. Learn its building blocks and how firmware makes them cooperate.',
      sections: [
        {
          heading: 'One computer, one job',
          body: [
            'An embedded system is a microcontroller (or microprocessor) plus supporting circuits, built into a device to do a specific task: a washing machine controller, a drone flight computer, a car\u2019s airbag unit. Unlike a PC it runs one dedicated program \u2014 firmware \u2014 stored in flash, usually forever, with no user-installed apps.',
            'The core blocks around the MCU: power management (regulated 3.3 V/5 V from battery or mains), clock sources (crystals for accurate timing), reset circuitry, memory (flash for code, RAM for variables, sometimes EEPROM for settings that survive power-off), and input/output circuitry \u2014 the sensor interfaces and drivers from previous modules.',
          ],
        },
        {
          heading: 'Real-time thinking',
          body: [
            'What separates embedded from general computing is timing discipline. A hard real-time task must finish by a deadline \u2014 an airbag decision in milliseconds, a motor control loop every 100 \u00B5s. Firmware is structured around interrupts (events that pause the main loop immediately) and timers, not just sequential code.',
            'Interrupt service routines (ISRs) must be short: acknowledge the event, set a flag, return; the main loop handles the rest. Long ISRs are the classic beginner bug \u2014 everything else freezes. Watchdogs provide the safety net: if firmware hangs, the watchdog timer resets the chip automatically, turning a frozen device into a briefly offline one.',
          ],
        },
        {
          heading: 'From prototype to product',
          body: [
            'The journey from Arduino prototype to product removes the training wheels: custom PCB instead of breadboard, a bare MCU instead of a dev board, a bootloader for firmware updates, power optimisation (sleep modes drawing microamps), and rigorous testing of edge cases \u2014 brownouts, disconnections, sensor failures.',
            'A good habit from day one: design so every subsystem can fail visibly. Check sensor sanity ranges, timeout every wait, log what happened. Devices that fail silently are impossible to debug in the field.',
          ],
        },
      ],
      terms: [
        { term: 'Firmware', definition: 'The dedicated program stored in an embedded device\u2019s flash memory.' },
        { term: 'Interrupt', definition: 'A hardware event that pauses main code to run a short handler immediately.' },
        { term: 'ISR', definition: 'Interrupt Service Routine \u2014 the handler. Keep it short; do heavy work in the main loop.' },
        { term: 'Watchdog', definition: 'A countdown timer that resets the MCU if firmware stops refreshing it \u2014 hang protection.' },
        { term: 'Real-time', definition: 'Guaranteed response within a deadline \u2014 hard (must) vs soft (should).' },
        { term: 'Bootloader', definition: 'Small resident program that can load new firmware (e.g. over USB or OTA).' },
      ],
      takeaways: [
        'Embedded = MCU + power + clock + reset + I/O, running one firmware.',
        'Interrupts handle urgent events; ISRs stay short.',
        'Watchdogs convert hangs into automatic resets.',
        'Design for visible failure: range-check, timeout, log.',
      ],
      application: {
        title: 'The washing machine controller',
        body: 'A washing machine cycles water valves, a motor and a heater using a modest MCU. Firmware sequences states (fill \u2192 wash \u2192 rinse \u2192 spin), watches door-lock and pressure-switch inputs via interrupts, times everything from a crystal-derived tick, and refuses to spin with the door open. Decades of refinement pack into firmware of a few hundred KB \u2014 a masterclass in reliable real-time design.',
      },
      diagram: 'embedded-stack',
      diagramCaption:
        'Embedded anatomy: MCU core + memory, with power, clock, sensors and drivers arranged around it on one board.',
      quiz: [
        {
          id: 'emb-anat-q1',
          question: 'Why must an interrupt service routine be short?',
          options: [
            'To save flash memory',
            'While it runs, lower-priority code (including the main loop) is delayed',
            'Because registers are limited',
            'It should not be short',
          ],
          correctIndex: 1,
          explanation: 'The ISR preempts normal execution; lengthy ISRs starve the main loop and other interrupts, breaking timing everywhere.',
        },
        {
          id: 'emb-anat-q2',
          question: 'A watchdog timer mainly protects against\u2026',
          options: [
            'Power surges',
            'Firmware hangs \u2014 by resetting the MCU',
            'Sensor drift',
            'Wi-Fi disconnections',
          ],
          correctIndex: 1,
          explanation: 'If firmware stops petting the watchdog (a hang), it fires and resets the device automatically.',
        },
        {
          id: 'emb-anat-q3',
          question: 'Which memory would you use for a user setting that must survive power loss?',
          options: ['RAM', 'CPU registers', 'EEPROM/flash', 'Cache'],
          correctIndex: 2,
          explanation: 'EEPROM (or a flash sector) retains data without power; RAM loses contents at power-off.',
        },
      ],
    },
    {
      id: 'embedded-iot',
      moduleId: 'embedded-iot',
      title: 'IoT: Connecting Devices to the World',
      difficulty: 'medium',
      minutes: 10,
      summary:
        'The Internet of Things links sensors to the cloud. Learn the reference architecture, radio choices, and the security habits that keep devices safe.',
      sections: [
        {
          heading: 'The IoT reference architecture',
          body: [
            'Most IoT systems have four layers. Things: the sensor/actuator nodes \u2014 a temperature node, a door sensor. Connectivity: Wi-Fi, Bluetooth, LoRa, NB-IoT \u2014 whichever matches range, power and data-rate needs. Cloud/backend: ingests data, stores it, applies rules and analytics. Application: dashboards and apps where humans see alerts and press buttons.',
            'The design decision that dominates everything is power. A mains-powered camera can afford Wi-Fi and constant streaming; a battery soil sensor must sleep 99.9% of the time and whisper its reading over LoRaWAN once a minute. Range, power and data rate form a triangle \u2014 you pick two.',
          ],
        },
        {
          heading: 'Choosing the radio',
          body: [
            'Wi-Fi: high speed, heavy power, works only near a router. Bluetooth LE: low power, short range, phone-friendly. Zigbee/Thread: mesh networks of many low-power nodes (smart homes). LoRaWAN: kilometres of range at kilobit speeds for a battery lasting years \u2014 ideal for agriculture and city sensors. NB-IoT/LTE-M: carrier networks with nationwide coverage for meters and trackers.',
            'Above the radio sit messaging protocols: MQTT is the workhorse \u2014 lightweight publish/subscribe where devices publish to topics (home/livingroom/temperature) and apps subscribe. Its low overhead and QoS levels make it the default for constrained devices.',
          ],
        },
        {
          heading: 'Security is not optional',
          body: [
            'Every connected device is attackable. The baseline: change default credentials, use TLS for cloud connections, sign firmware updates so devices refuse tampered code, and never ship hard-coded secrets \u2014 provision keys securely per device. Patchability matters more than perfection: assume vulnerabilities will be found, and ensure you can update.',
            'Privacy follows the same logic: collect only needed data, keep it local when possible (edge processing), and encrypt in transit. The Innovation Studio\u2019s IoT Safety demo keeps all data local and simulated \u2014 a good pattern for student projects.',
          ],
        },
      ],
      terms: [
        { term: 'IoT node', definition: 'A sensing/actuating device with connectivity \u2014 the "thing" in the Internet of Things.' },
        { term: 'LoRaWAN', definition: 'Long-range, low-power radio network for battery sensors over kilometres.' },
        { term: 'MQTT', definition: 'Lightweight publish/subscribe protocol; devices publish to topics, apps subscribe.' },
        { term: 'Edge computing', definition: 'Processing data on or near the device instead of sending everything to the cloud.' },
        { term: 'OTA update', definition: 'Over-The-Air firmware update \u2014 essential for fixing field devices.' },
        { term: 'TLS', definition: 'Transport Layer Security \u2014 encryption for the device\u2013cloud link.' },
      ],
      takeaways: [
        'Four layers: things \u2192 connectivity \u2192 cloud \u2192 application.',
        'Power budget dictates radio choice: range/power/rate \u2014 pick two.',
        'MQTT publish/subscribe is the standard IoT messaging pattern.',
        'Security baseline: no default passwords, TLS, signed OTA updates.',
      ],
      application: {
        title: 'Smart agriculture at scale',
        body: 'A vineyard scatters 200 battery soil-moisture nodes, each sleeping and waking hourly to transmit one LoRaWAN packet (kilometres of range, years of battery). A gateway backhauls to the cloud, where rules trigger irrigation only where needed \u2014 cutting water use by double digits. The lesson-level pattern: tiny device, deliberate radio, simple messages, cloud rules.',
      },
      diagram: 'iot-architecture',
      diagramCaption:
        'IoT architecture: sensor nodes \u2192 gateway/radio \u2192 cloud rules & storage \u2192 dashboards and alerts.',
      quiz: [
        {
          id: 'emb-iot-q1',
          question: 'A battery soil sensor must last 3 years outdoors, 1 packet/hour. Best radio choice?',
          options: ['Wi-Fi', 'Bluetooth LE to a phone', 'LoRaWAN or NB-IoT', '5 GHz Wi-Fi'],
          correctIndex: 2,
          explanation: 'Long range + tiny payloads + deep sleep = LPWAN (LoRaWAN/NB-IoT). Wi-Fi\u2019s handshake power would flatten the battery.',
        },
        {
          id: 'emb-iot-q2',
          question: 'In MQTT, a temperature device typically\u2026',
          options: [
            'Subscribes to home/temp',
            'Publishes its reading to a topic like home/temp',
            'Emails the cloud',
            'Runs the dashboard',
          ],
          correctIndex: 1,
          explanation: 'Devices publish data to topics; consumers (dashboards, rules engines) subscribe to those topics.',
        },
        {
          id: 'emb-iot-q3',
          question: 'Which is the weakest security practice?',
          options: [
            'TLS to the cloud',
            'Signed firmware updates',
            'A default password printed in the manual',
            'Per-device provisioned keys',
          ],
          correctIndex: 2,
          explanation: 'Default credentials are the top cause of compromised IoT devices \u2014 they must be changed/removed before shipping.',
        },
      ],
    },
  ],
}
