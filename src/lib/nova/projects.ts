import type { ProjectMeta } from './types'

export const PROJECTS: ProjectMeta[] = [
  {
    id: 'smart-home',
    title: 'Smart Home Automation',
    tagline: 'Lights and a fan that respond to light, temperature and occupancy — with manual override.',
    icon: 'Home',
    concepts: [
      'Sensor input → control-rule → actuator output: the universal automation loop.',
      'Threshold logic: a photosensor decides darkness, a thermistor drives fan speed steps.',
      'AND decisions: the light only turns on when it is dark AND someone is present — logic gates in firmware.',
      'Manual override vs automatic mode — the same pattern as real thermostat systems.',
    ],
    useCase:
      'Budget home-automation kits work exactly like this: a PIR occupancy sensor, an LDR and a temperature sensor wired to a relay board driven by a small microcontroller. Occupancy + darkness saves lighting energy; stepped fan control from temperature keeps rooms comfortable without continuous-speed complexity. The same three-rules firmware ships in commercial smart plugs and thermostat controllers.',
    knowledgeCheck: [
      {
        id: 'sh-q1',
        question: 'The light should turn ON when which condition is true (in auto mode)?',
        options: ['Ambient light is bright', 'Room is dark AND occupied', 'Temperature is high', 'Fan speed is above zero'],
        correctIndex: 1,
        explanation: 'The rule is isDark AND presence — lighting an empty room wastes energy, and a bright room needs no lamp.',
      },
      {
        id: 'sh-q2',
        question: 'Temperature is 27 °C with someone present. What fan speed does the rule table produce?',
        options: ['0 (off)', '1 (low)', '2 (medium)', '3 (high)'],
        correctIndex: 2,
        explanation: '27 °C falls in the ≥26 °C tier → speed 2. At ≥30 °C it would step to 3; below 23 °C it stays off.',
      },
      {
        id: 'sh-q3',
        question: 'Why do real systems offer a manual override alongside the auto rule?',
        options: [
          'To save electricity',
          'Because sensors can misread situations users know better — override restores trust and comfort',
          'Because automatic rules are illegal in homes',
          'To disable the sensors permanently',
        ],
        correctIndex: 1,
        explanation: 'Automation is convenient until it is wrong (guests, unusual preferences). Manual override is the safety valve that makes automated products acceptable.',
      },
    ],
  },
  {
    id: 'iot-safety',
    title: 'IoT Safety Monitoring',
    tagline: 'Temperature, gas and motion sensors with configurable thresholds and a three-level alert state machine.',
    icon: 'ShieldAlert',
    concepts: [
      'Threshold state machine: normal → warning → danger, decided per sensor with hysteresis margins.',
      'Worst-case aggregation: the system status is the most severe of any single sensor.',
      'Escalating responses: increase sampling → notify operator → alarm + evacuation, matched to severity.',
      'Event logging: timestamped threshold crossings are the audit trail every safety system needs.',
    ],
    useCase:
      'This is the architecture of workshop and kitchen safety monitors: an MQ-2 gas sensor and a temperature sensor on an ESP32, thresholds tuned to the installation, and alerts pushed to phones via MQTT. Warehouses run the same pattern at scale — dozens of nodes reporting to a dashboard where one danger reading turns the whole map red and triggers evacuation alerts.',
    knowledgeCheck: [
      {
        id: 'iot-q1',
        question: 'Temperature reads WARNING while gas reads DANGER. What is the system status?',
        options: ['Normal', 'Warning', 'Danger', 'Undefined'],
        correctIndex: 2,
        explanation: 'The system takes the WORST sensor state. Any danger reading means immediate action — never average across severity levels.',
      },
      {
        id: 'iot-q2',
        question: 'Why set the danger threshold higher than the warning threshold instead of using one limit?',
        options: [
          'It saves battery',
          'It creates escalation room: warning buys time to investigate before the drastic danger response triggers',
          'Warnings are only decorative',
          'Sensors cannot measure above the warning level',
        ],
        correctIndex: 1,
        explanation: 'Two levels separate "investigate now" from "act immediately" — avoiding both false alarms and missed emergencies.',
      },
      {
        id: 'iot-q3',
        question: 'What belongs in the alert log, and why?',
        options: [
          'Only danger events — warnings are noise',
          'Timestamped threshold crossings with severity — the audit trail for post-incident analysis',
          'Every raw sample — logs must be exhaustive',
          'Nothing; alerts go straight to users',
        ],
        correctIndex: 1,
        explanation: 'Regulators and engineers reconstruct incidents from logs: when the threshold crossed, which sensor, and how the system responded. Raw samples are stored separately.',
      },
    ],
  },
  {
    id: 'comm-network',
    title: 'Smart Communication Network',
    tagline: 'Tune signal strength and noise, watch SNR change, and transmit a real byte through simulated errors.',
    icon: 'Radio',
    concepts: [
      'SNR = signal − noise (in dB): the single number that decides link quality.',
      'Higher noise or weaker signal → lower SNR → more bit errors in received data.',
      'Error detection (CRC) catches corrupted messages and triggers retransmission.',
      'Link budget thinking: power, antennas and distance all just move the same SNR number.',
    ],
    useCase:
      'Wi-Fi routers do this maths continuously: your phone reports SNR, and the router picks a modulation that survives it (256-QAM when clean, QPSK when noisy). Cellular base stations, LoRaWAN gateways and satellite modems all run the same SNR-to-reliability trade-off. Understanding it explains every "one bar vs four bars" moment.',
    knowledgeCheck: [
      {
        id: 'cn-q1',
        question: 'Signal is −55 dBm and noise is −85 dBm. What is the SNR?',
        options: ['−30 dB', '30 dB', '140 dB', '55 dB'],
        correctIndex: 1,
        explanation: 'SNR = signal − noise = (−55) − (−85) = 30 dB. Subtracting a negative adds — a classic sign slip.',
      },
      {
        id: 'cn-q2',
        question: 'The noise floor rises while signal strength stays fixed. What happens?',
        options: [
          'SNR falls and bit errors become more likely',
          'SNR rises and the link speeds up',
          'Nothing — noise does not affect digital links',
          'The signal automatically becomes stronger',
        ],
        correctIndex: 0,
        explanation: 'Fixed signal + rising noise = shrinking SNR = the receiver confuses symbol states more often — more errors, lower usable speed.',
      },
      {
        id: 'cn-q3',
        question: 'A received frame fails its CRC check. What does the protocol do?',
        options: [
          'Accepts it anyway',
          'Discards it and requests retransmission (or repairs it if FEC is used)',
          'Turns off the transmitter',
          'Randomly guesses the missing bits',
        ],
        correctIndex: 1,
        explanation: 'Error detection exists to stop corrupted data being trusted: discard and retransmit — or let forward error correction rebuild it without a round-trip.',
      },
    ],
  },
]
