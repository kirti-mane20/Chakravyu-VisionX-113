import type { LearningModule } from '../types'

export const semiconductorsModule: LearningModule = {
  id: 'semiconductors',
  title: 'Semiconductor Devices',
  tagline: 'Diodes and transistors \u2014 the switches behind every modern device.',
  description:
    'How silicon doped with impurities conducts on command: PN-junction diodes that pass current one way, and transistors that amplify and switch.',
  icon: 'Cpu',
  lessons: [
    {
      id: 'semi-diode',
      moduleId: 'semiconductors',
      title: 'Diodes & the PN Junction',
      difficulty: 'medium',
      minutes: 9,
      summary:
        'A diode is a one-way valve for current. Understand why silicon behaves this way and where one-way valves are useful.',
      sections: [
        {
          heading: 'Making silicon conduct',
          body: [
            'Pure silicon has four valence electrons, all locked into bonds with neighbouring atoms, so it conducts poorly \u2014 it is a semiconductor. The trick is doping: add a trace of phosphorus (five valence electrons) and spare electrons roam free, making N-type ("negative") material. Add boron (three electrons) instead and missing-bond holes appear, making P-type ("positive") material.',
            'Join a P region to an N region and something remarkable happens at the boundary: electrons near the junction diffuse across to fill holes, creating a thin depletion region with no free carriers and a small internal voltage (~0.7 V for silicon) that opposes further movement. This junction is the diode.',
          ],
        },
        {
          heading: 'One-way behaviour',
          body: [
            'Forward bias \u2014 battery + to the P side \u2014 pushes the junction\u2019s internal barrier down; above ~0.7 V current flows easily, rising steeply with voltage. Reverse bias \u2014 + to the N side \u2014 widens the depletion region and only a negligible leakage current flows. One-way conduction: that is the diode\u2019s whole job.',
            'The ~0.7 V forward drop is not lost energy, it is the price of admission. In an LED, recombing electrons and holes release energy as photons \u2014 the same junction, engineered to glow instead of merely heat. A red LED\u2019s ~2 V forward voltage comes from its different semiconductor material (e.g. gallium arsenide), not from plain silicon.',
            'Real diodes have limits: a maximum forward current (heat!) and a maximum reverse voltage (breakdown). Exceed either destroys the part \u2014 exactly why LEDs need their series resistor from the Basic Electronics lesson.',
          ],
        },
        {
          heading: 'What diodes are used for',
          body: [
            'Rectification is the classic use: four diodes in a bridge convert the AC from a transformer into pulsating DC, and a smoothing capacitor fills in the dips \u2014 that is how nearly every mains-powered device makes its DC supply. Reverse-polarity protection uses one diode so plugging a battery in backwards does no harm.',
            'Specialised diodes add behaviours: Zener diodes conduct in reverse at a precise voltage and act as cheap voltage references; Schottky diodes drop only ~0.3 V and switch fast, saving power in converters; varactors change their capacitance with voltage and tune radio circuits.',
          ],
        },
      ],
      terms: [
        { term: 'Doping', definition: 'Adding trace impurities (phosphorus, boron) to silicon to create free electrons (N-type) or holes (P-type).' },
        { term: 'PN junction', definition: 'The boundary where P meets N; forms a depletion region and enables one-way conduction.' },
        { term: 'Forward bias', definition: 'Voltage applied so the diode conducts (P side positive). ~0.7 V drop for silicon.' },
        { term: 'Reverse bias', definition: 'Voltage applied so the diode blocks; only tiny leakage flows.' },
        { term: 'Rectifier', definition: 'A diode circuit that converts AC into DC.' },
        { term: 'Zener diode', definition: 'A diode designed to conduct in reverse at a precise voltage \u2014 used as a voltage reference.' },
      ],
      takeaways: [
        'Doping turns insulating silicon into N-type (electrons) or P-type (holes).',
        'A PN junction conducts forward above ~0.7 V and blocks in reverse.',
        'LEDs are forward-biased junctions engineered to emit photons.',
        'Bridge rectifiers + capacitor = the DC supply inside most devices.',
      ],
      application: {
        title: 'Charger protection you use daily',
        body: 'USB adapters include a diode so reversed insertion (or a battery plugged in backwards) cannot push current through sensitive electronics. The diode sits in series and simply blocks when biased the wrong way \u2014 costing cents and preventing damage. Its forward drop (~0.3 V for a Schottky) is deliberately chosen small so little power is wasted.',
      },
      diagram: 'diode-pn',
      diagramCaption:
        'PN junction under forward bias (conducting) vs reverse bias (blocking). The depletion region width tells the story.',
      quiz: [
        {
          id: 'semi-diode-q1',
          question: 'Silicon doped with phosphorus (5 valence electrons) becomes\u2026',
          options: ['P-type', 'N-type', 'An insulator', 'A superconductor'],
          correctIndex: 1,
          explanation: 'Phosphorus donates free electrons \u2014 negative carriers \u2014 making N-type material.',
        },
        {
          id: 'semi-diode-q2',
          question: 'The typical forward voltage drop of a silicon diode is about\u2026',
          options: ['0.07 V', '0.7 V', '2.0 V', '7 V'],
          correctIndex: 1,
          explanation: 'Silicon junctions need ~0.7 V before current flows freely. (LEDs drop ~2 V because of their different materials.)',
        },
        {
          id: 'semi-diode-q3',
          question: 'A Zener diode is normally used\u2026',
          options: [
            'To amplify signals',
            'As a fuse',
            'In reverse breakdown as a stable voltage reference',
            'To store charge',
          ],
          correctIndex: 2,
          explanation: 'Zeners are engineered to conduct in reverse at a precise, stable voltage \u2014 handy as references and clamps.',
        },
      ],
    },
    {
      id: 'semi-transistor',
      moduleId: 'semiconductors',
      title: 'Transistors: Amplifiers & Switches',
      difficulty: 'hard',
      minutes: 12,
      summary:
        'The most important invention of the 20th century: a terminal that controls another terminal \u2014 enabling amplification and electronic switching.',
      sections: [
        {
          heading: 'Three terminals, one idea',
          body: [
            'A bipolar junction transistor (BJT) sandwiches three doped layers: NPN or PNP. The three terminals are the emitter, base and collector. The idea: a tiny current into the base allows a much larger current to flow from collector to emitter. A base current of 1 mA might permit a collector current of 100 mA \u2014 a gain (called \u03B2 or h_FE) of 100.',
            'That current gain gives two superpowers. As an amplifier: make the base current follow a small signal (say a microphone\u2019s millivolts) and the collector current follows with the same shape but far more power \u2014 the signal is amplified. As a switch: drive the base fully on (saturation) or fully off (cut-off), and the transistor behaves like a voltage-controlled switch that never wears out and moves in nanoseconds.',
          ],
        },
        {
          heading: 'The transistor as a switch',
          body: [
            'Microcontroller pins are weak \u2014 they can typically source only 20\u201340 mA, far too little for a motor, relay or LED strip. The standard pattern: connect the load between the supply and the transistor\u2019s collector, emitter to ground, and drive the base through a resistor (e.g. 1 k\u03A9) from the pin. Now the pin\u2019s few milliamps of base current control hundreds of milliamps through the load.',
            'The base resistor matters: without it, the pin would try to supply unlimited base current and the pin (or transistor) could be damaged. With it, you set I\u1D2E \u2248 (V_out \u2212 0.7)/R_B. For logic switching you usually size it so I_C/I\u1D2E \u226A \u03B2, guaranteeing full saturation and minimal heat in the transistor.',
          ],
        },
        {
          heading: 'MOSFETs \u2014 the modern switch',
          body: [
            'The MOSFET improves on the BJT for switching: instead of a base current, its insulated gate is controlled by voltage, drawing essentially zero steady-state current. Billions of MOSFETs packed onto a chip form processors and memory \u2014 your phone\u2019s SoC is a city of them. In power circuits, logic-level MOSFETs switch motors and LED drivers with minimal loss.',
            'Rule of thumb for beginners: use BJTs for simple amplifiers and low-side switches when you have current to spare, use logic-level MOSFETs when driving loads from microcontrollers \u2014 but always check the gate threshold voltage in the datasheet matches your logic voltage (3.3 V or 5 V).',
          ],
        },
      ],
      terms: [
        { term: 'BJT', definition: 'Bipolar Junction Transistor \u2014 NPN/PNP device where base current controls collector current.' },
        { term: 'Gain (\u03B2)', definition: 'Collector current \u00F7 base current. Typical small-signal BJTs: 100\u2013300.' },
        { term: 'Saturation', definition: 'Fully-ON state: base is driven hard, transistor drops ~0.2 V, behaves like a closed switch.' },
        { term: 'Cut-off', definition: 'Fully-OFF state: no base current, no collector current, like an open switch.' },
        { term: 'MOSFET', definition: 'Voltage-controlled transistor with an insulated gate \u2014 the building block of digital ICs.' },
        { term: 'Base resistor', definition: 'Series resistor that limits base current when driving a BJT from a logic pin.' },
      ],
      takeaways: [
        'Small base current controls large collector current \u2014 that ratio is \u03B2.',
        'Amplifier = follow the signal; switch = full ON or full OFF.',
        'Always use a base/gate resistor when driving from a logic pin.',
        'MOSFETs are voltage-controlled and dominate modern ICs and power switching.',
      ],
      application: {
        title: 'Arduino driving a 12 V fan',
        body: 'An Arduino pin outputs 5 V at ~20 mA max, but the fan needs 12 V at 200 mA. A logic-level N-channel MOSFET (or NPN transistor with enough \u03B2) bridges the gap: pin \u2192 gate/base resistor \u2192 transistor \u2192 fan, sharing ground. The microcontroller stays safe at 5 V while the transistor handles the 12 V, 200 mA load \u2014 and PWM from the pin even gives speed control.',
      },
      diagram: 'transistor-switch',
      diagramCaption:
        'NPN low-side switch: a small base current (through R\u1D2E) lets a large collector current power the load.',
      quiz: [
        {
          id: 'semi-bjt-q1',
          question: 'A BJT with \u03B2 = 100 has 2 mA of base current in its active region. Collector current is about\u2026',
          options: ['2 mA', '20 mA', '200 mA', '2000 mA'],
          correctIndex: 2,
          explanation: 'I_C \u2248 \u03B2 \u00D7 I\u1D2E = 100 \u00D7 2 mA = 200 mA (as long as the external circuit allows it).',
        },
        {
          id: 'semi-bjt-q2',
          question: 'Why put a resistor between a microcontroller pin and a BJT base?',
          options: [
            'To make the transistor switch faster',
            'To limit the base current to a safe value',
            'To increase the gain',
            'To filter noise',
          ],
          correctIndex: 1,
          explanation: 'The base-emitter junction looks like a diode; without a resistor the pin would over-drive it and could damage pin or transistor.',
        },
        {
          id: 'semi-bjt-q3',
          question: 'What controls a MOSFET\u2019s channel conduction?',
          options: ['Base current', 'Gate voltage', 'Collector voltage', 'Temperature'],
          correctIndex: 1,
          explanation: 'The insulated gate is voltage-controlled \u2014 near-zero steady-state gate current, unlike a BJT\u2019s base current.',
        },
      ],
    },
  ],
}
