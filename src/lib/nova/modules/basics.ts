import type { LearningModule } from '../types'

export const basicsModule: LearningModule = {
  id: 'basics',
  title: 'Basic Electronics & Components',
  tagline: 'Start here: voltage, current, resistance and the parts every circuit uses.',
  description:
    'The foundation of all electronics: what voltage and current really are, how Ohm\u2019s law connects them, and how common components behave in a circuit.',
  icon: 'Zap',
  lessons: [
    {
      id: 'basics-ohms-law',
      moduleId: 'basics',
      title: 'Voltage, Current & Ohm\u2019s Law',
      difficulty: 'easy',
      minutes: 8,
      summary:
        'Meet the three fundamental electrical quantities and learn the one formula that connects them all.',
      sections: [
        {
          heading: 'What electricity actually is',
          body: [
            'Electric current is the flow of tiny charged particles called electrons through a material such as a copper wire. Imagine water flowing through a pipe: the water is like the electrons, and the amount of water passing a point every second is the current. We measure current in amperes (A), and in small electronics we usually talk about milliamperes (mA), where 1000 mA = 1 A.',
            'Voltage is the push that makes the electrons move. It is the electrical pressure difference between two points, measured in volts (V). A 9 V battery pushes electrons harder than a 1.5 V AA battery, in the same way a tall water tank pushes water through a pipe harder than a small one. Higher voltage means more energy delivered to each unit of charge.',
            'Resistance is how much a material opposes the flow of current, measured in ohms (\u03A9). A narrow pipe resists water flow; a resistor resists electron flow. Every real component has some resistance, and we deliberately add resistors to circuits to control how much current flows.',
          ],
        },
        {
          heading: 'Ohm\u2019s law \u2014 the formula you will use forever',
          body: [
            'Ohm\u2019s law links the three quantities: Voltage = Current \u00D7 Resistance, written as V = I \u00D7 R. If you know any two values you can always find the third: I = V/R gives the current, and R = V/I gives the resistance. This single relationship is the most used calculation in all of electronics.',
            'Worked example: a 9 V battery drives current through a 470 \u03A9 resistor. The current is I = V/R = 9 / 470 \u2248 0.019 A, which is about 19 mA. If we doubled the resistance to 940 \u03A9, the current would halve to about 9.6 mA. This shows the key rule: current is inversely proportional to resistance when voltage is fixed.',
            'In the Virtual Lab you can test this directly: set a voltage and resistance, and the simulator calculates the current using exactly this formula. Notice how the LED brightness changes with current \u2014 more current means a brighter (but hotter) LED.',
          ],
        },
        {
          heading: 'Circuits must be complete loops',
          body: [
            'Current only flows in a closed loop from the positive terminal of the source, through the components, and back to the negative terminal. Any break in this loop \u2014 an open switch, a snapped wire, a loose connection \u2014 stops the current everywhere in the circuit. This is the first thing to check whenever a circuit does not work.',
            'A series circuit has components connected one after another, so the same current passes through each of them. If one component fails open in a series string (like one burned-out bulb in old fairy lights), the whole string goes dark. Understanding the loop and the path of current is the core skill behind all troubleshooting.',
          ],
        },
      ],
      terms: [
        { term: 'Voltage (V)', definition: 'Electrical pressure difference between two points, measured in volts. It pushes charge around a circuit.' },
        { term: 'Current (I)', definition: 'The rate of flow of electric charge, measured in amperes (A). 1 A = 1000 mA.' },
        { term: 'Resistance (R)', definition: 'Opposition to current flow, measured in ohms (\u03A9).' },
        { term: 'Ohm\u2019s law', definition: 'V = I \u00D7 R. Relates voltage, current and resistance in any resistor.' },
        { term: 'Open circuit', definition: 'A break in the current path. No current flows anywhere in a series loop.' },
        { term: 'Closed circuit', definition: 'A complete loop that allows current to flow from source and back.' },
      ],
      takeaways: [
        'Voltage pushes, current flows, resistance limits.',
        'Ohm\u2019s law: V = I \u00D7 R \u2014 knowing any two quantities gives you the third.',
        'More resistance means less current (at fixed voltage).',
        'No complete loop means no current \u2014 always check connections first.',
      ],
      application: {
        title: 'Why your phone charger gets warm',
        body: 'Chargers push several amps of current through cables and components. Every real conductor has a small resistance, and by P = I\u00B2R that current turns some energy into heat. Thicker cables have lower resistance, so they waste less energy as heat \u2014 which is why cheap thin charging cables warm up more and charge slower over long runs.',
      },
      diagram: 'ohms-law-circuit',
      diagramCaption:
        'A simple series loop: a battery (V) drives current (I) through a resistor (R). Ohm\u2019s law gives I = V/R.',
      quiz: [
        {
          id: 'basics-ohms-q1',
          question: 'A 12 V supply is connected to a 2 k\u03A9 resistor. What current flows?',
          options: ['24 mA', '6 mA', '0.6 mA', '2.4 A'],
          correctIndex: 1,
          explanation: 'I = V/R = 12 / 2000 = 0.006 A = 6 mA. Convert ohms to kilohms carefully: 2 k\u03A9 = 2000 \u03A9.',
        },
        {
          id: 'basics-ohms-q2',
          question: 'If you keep the voltage the same but double the resistance, the current will\u2026',
          options: ['Double', 'Stay the same', 'Halve', 'Drop to zero'],
          correctIndex: 2,
          explanation: 'I = V/R, so current is inversely proportional to resistance. Doubling R halves I.',
        },
        {
          id: 'basics-ohms-q3',
          question: 'A switch in a series circuit is opened. What happens to the current everywhere in that loop?',
          options: [
            'It increases in the other components',
            'It drops to zero in the whole loop',
            'It only stops after the switch',
            'It reverses direction',
          ],
          correctIndex: 1,
          explanation: 'A series loop is a single path. One break (open switch) stops current everywhere in that loop.',
        },
      ],
    },
    {
      id: 'basics-components',
      moduleId: 'basics',
      title: 'Resistors, LEDs & Component Basics',
      difficulty: 'easy',
      minutes: 9,
      summary:
        'Learn to read the parts every circuit uses: resistor colour codes, LEDs and their polarity, and safe current limits.',
      sections: [
        {
          heading: 'Reading a resistor\u2019s colour code',
          body: [
            'Resistors are too small for printed numbers, so they use coloured bands. Each colour is a digit: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. In the common four-band code, the first two bands are digits and the third is a multiplier (how many zeros to append). The fourth band, usually gold or silver, is the tolerance \u2014 how far the real value may drift from the marked value.',
            'Example: red\u2013violet\u2013orange\u2013gold reads 2, 7, \u00D71000 \u2192 27,000 \u03A9 = 27 k\u03A9 with \u00B15% tolerance. A quick memory trick: the multiplier band tells you the number of zeros after the two digits. Brown\u2013black\u2013red is 1, 0, \u00D7100 \u2192 1000 \u03A9 (1 k\u03A9).',
            'Resistors have no polarity \u2014 they work the same in either direction. That makes them the most forgiving component to place, and they are used everywhere: limiting LED current, setting timing, dividing voltages, and pulling logic inputs to known levels.',
          ],
        },
        {
          heading: 'LEDs \u2014 diodes that light up',
          body: [
            'An LED (Light Emitting Diode) emits light when current flows through it in the forward direction. Unlike resistors, LEDs are polarised: current flows from anode (+) to cathode (\u2212) only. On a typical through-hole LED, the longer leg is the anode and the flat spot on the plastic rim marks the cathode. Reversed, the LED simply blocks current and stays dark \u2014 in this simulator it cannot be damaged by reverse voltage, but real LEDs can break down at higher reverse voltages.',
            'An LED is not a resistor: once it starts conducting, its voltage stays roughly constant (about 2 V for red, 3 V for blue/white) no matter how much current flows. On its own, an LED connected straight to a battery would draw a damaging current. That is why every LED needs a series current-limiting resistor.',
            'Typical indicator LEDs are happy at 5\u201320 mA and start glowing visibly around 1\u20132 mA. The resistor value sets the current: with a 5 V supply, a red LED (~2 V) and a 330 \u03A9 resistor, I = (5 \u2212 2) / 330 \u2248 9 mA \u2014 safe and bright. Skipping the resistor is the number-one cause of dead LEDs on breadboards.',
          ],
        },
        {
          heading: 'Switches and wires',
          body: [
            'A switch is simply a controllable break in the loop: closed means the loop is complete, open means no current. In real circuits, mechanical switches "bounce" \u2014 their contacts physically vibrate for a few milliseconds when pressed, which matters later when we connect them to microcontrollers.',
            'Wires are assumed ideal in this simulator (zero resistance), but real wires have small resistance that matters at high current. Breadboards make temporary connections through spring clips underneath the holes, and a surprising number of beginner circuits "fail" simply because a wire is in the wrong hole row.',
          ],
        },
      ],
      terms: [
        { term: 'Colour code', definition: 'Coloured bands on a resistor encoding its value: 2 digits + multiplier + tolerance.' },
        { term: 'Tolerance', definition: 'Allowed deviation from the marked value, e.g. \u00B15% means a 100 \u03A9 part may be 95\u2013105 \u03A9.' },
        { term: 'LED', definition: 'Light Emitting Diode \u2014 a polarised component that emits light when forward current flows.' },
        { term: 'Forward voltage (V\u2091)', definition: 'The roughly constant voltage an LED drops when conducting (~2 V red, ~3 V blue).' },
        { term: 'Polarity', definition: 'Whether a component has a + and \u2212 direction. LEDs do; resistors do not.' },
        { term: 'Current-limiting resistor', definition: 'A series resistor that keeps LED current at a safe level.' },
      ],
      takeaways: [
        'Four-band code: two digits, one multiplier (zeros), one tolerance.',
        'LEDs are polarised \u2014 long leg (anode) towards the more positive side.',
        'Always use a series resistor with an LED; aim for 5\u201320 mA.',
        'LED current: I = (V supply \u2212 V\u2091) / R.',
      ],
      application: {
        title: 'Power-indicator LED on a 9 V wall adapter',
        body: 'A device\u2019s "power on" LED is designed exactly as in this lesson: a 9 V supply, a red LED dropping ~2 V, and a resistor of (9 \u2212 2)/0.01 \u2248 680 \u03A9 setting 10 mA. Designers pick 5\u201310 mA because it is clearly visible and wastes almost no power \u2014 important for a lamp that is on whenever the device is plugged in.',
      },
      diagram: 'resistor-color',
      diagramCaption:
        'Four-band resistor code: yellow\u2013violet\u2013red\u2013gold = 4, 7, \u00D7100 \u2192 4.7 k\u03A9 \u00B15%.',
      quiz: [
        {
          id: 'basics-comp-q1',
          question: 'A resistor has bands brown\u2013black\u2013orange. What is its value?',
          options: ['100 \u03A9', '1 k\u03A9', '10 k\u03A9', '100 k\u03A9'],
          correctIndex: 2,
          explanation: 'Brown=1, black=0, orange=\u00D71000 \u2192 10 \u00D7 1000 = 10,000 \u03A9 = 10 k\u03A9.',
        },
        {
          id: 'basics-comp-q2',
          question: 'Which LED leg is the anode on a standard through-hole LED?',
          options: ['The longer leg', 'The shorter leg', 'The leg near the flat spot', 'Either leg \u2014 LEDs have no polarity'],
          correctIndex: 0,
          explanation: 'The longer leg is the anode (+). The shorter leg / flat-rim side is the cathode (\u2212).',
        },
        {
          id: 'basics-comp-q3',
          question: '5 V supply, red LED with V\u2091 \u2248 2 V, resistor 150 \u03A9. Approximate current?',
          options: ['6.7 mA', '20 mA', '33 mA', '2 mA'],
          correctIndex: 1,
          explanation: 'I = (5 \u2212 2) / 150 = 3/150 = 0.02 A = 20 mA. That is the upper end of a typical indicator LED\u2019s safe range.',
        },
      ],
    },
  ],
}
