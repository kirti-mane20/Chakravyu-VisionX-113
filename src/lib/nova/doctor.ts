import type { DoctorCase } from './types'

export const DOCTOR_CASES: DoctorCase[] = [
  {
    id: 'doc-wire',
    order: 1,
    title: 'The Lamp That Never Lights',
    difficulty: 'easy',
    scenario:
      'A simple LED circuit on a breadboard: 5 V rail \u2192 330 \u03A9 resistor \u2192 red LED \u2192 GND. The builder closes the power switch, but the LED stays completely dark.',
    expectedBehavior: 'Switch closed: LED should glow at roughly (5 \u2212 2)/330 \u2248 9 mA.',
    observedBehavior: 'LED is fully dark. Measured current through the circuit: 0 mA. The supply reads a healthy 5.0 V.',
    diagram: 'led-broken-wire',
    clues: [
      { label: 'Clue 1 \u2014 Supply voltage', detail: 'Multimeter across the 5 V rail reads 5.0 V. The supply is fine.' },
      { label: 'Clue 2 \u2014 Resistor', detail: 'Resistor colour bands read orange\u2013orange\u2013brown = 330 \u03A9 and it measures 331 \u03A9 out of circuit. The resistor is fine.' },
      { label: 'Clue 3 \u2014 The gap', detail: 'A wire from the LED cathode area to the GND rail is visibly lifted out of its breadboard row \u2014 the loop is broken there.' },
    ],
    faultOptions: [
      { id: 'f1', label: 'The supply voltage is too low' },
      { id: 'f2', label: 'A disconnected wire breaks the current loop' },
      { id: 'f3', label: 'The resistor value is wrong' },
      { id: 'f4', label: 'The LED is inserted backwards' },
    ],
    correctFaultId: 'f2',
    faultExplanation:
      'Current needs a complete loop. The lifted wire leaves the LED cathode floating \u2014 no return path to GND, so 0 mA flows and the LED cannot light even though the supply and resistor are healthy.',
    fixOptions: [
      { id: 'x1', label: 'Replace the 9 V battery' },
      { id: 'x2', label: 'Re-seat the loose wire so the cathode connects to the GND rail' },
      { id: 'x3', label: 'Swap in a 100 \u03A9 resistor' },
      { id: 'x4', label: 'Flip the LED around' },
    ],
    correctFixId: 'x2',
    fixExplanation:
      'Restoring the loop is the only fix that addresses the actual fault. The other components were verified good by the clues.',
    concepts: ['Closed loops', 'Series circuits', 'Systematic checking: supply \u2192 components \u2192 connections'],
  },
  {
    id: 'doc-switch',
    order: 2,
    title: 'Switched On, Nothing Happens',
    difficulty: 'easy',
    scenario:
      'A workbench lamp circuit: 9 V battery \u2192 toggle switch \u2192 470 \u03A9 resistor \u2192 white LED \u2192 back to battery. The operator flips the switch; the lamp does not respond.',
    expectedBehavior: 'Switch ON: LED glows at (9 \u2212 3)/470 \u2248 13 mA. Switch OFF: dark.',
    observedBehavior: 'Switch is clearly in the ON position, but the LED behaves as if the switch were OFF.',
    diagram: 'led-open-switch',
    clues: [
      { label: 'Clue 1 \u2014 Voltage after the switch', detail: 'With the switch ON, the voltage after the switch reads 0 V. Before the switch, the battery\u2019s 9 V is present.' },
      { label: 'Clue 2 \u2014 Continuity test', detail: 'With power removed, the switch shows infinite resistance even in the ON position. A working closed switch should read ~0 \u03A9.' },
      { label: 'Clue 3 \u2014 The toggle', detail: 'The toggle lever moves and clicks normally, but its internal contacts are worn/dirty \u2014 the lever works, the contact does not.' },
    ],
    faultOptions: [
      { id: 'f1', label: 'The switch is internally open even in the ON position' },
      { id: 'f2', label: 'The battery is empty' },
      { id: 'f3', label: 'The LED is reversed' },
      { id: 'f4', label: 'The 470 \u03A9 resistor is open' },
    ],
    correctFaultId: 'f1',
    faultExplanation:
      'Continuity says it all: ON position should be a short circuit (~0 \u03A9), but this switch measures open. The lever clicking does not guarantee electrical contact \u2014 mechanical and electrical state can disagree.',
    fixOptions: [
      { id: 'x1', label: 'Replace the faulty switch with a known-good one' },
      { id: 'x2', label: 'Charge the battery' },
      { id: 'x3', label: 'Use a bigger resistor' },
      { id: 'x4', label: 'Bypass the resistor with plain wire' },
    ],
    correctFixId: 'x1',
    fixExplanation:
      'A mechanically moving but electrically open switch must be replaced. Never bypass a switch with plain wire \u2014 you would remove the operator\u2019s ability to turn the circuit off.',
    concepts: ['Switch continuity', 'Verifying with a multimeter', 'Mechanical vs electrical state'],
  },
  {
    id: 'doc-resistor',
    order: 3,
    title: 'The Briefly Brilliant LED',
    difficulty: 'medium',
    scenario:
      'A student builds 5 V \u2192 resistor \u2192 red LED \u2192 GND. For a moment the LED glows extremely bright \u2014 then it dims noticeably and feels hot. The resistor in the circuit has bands brown\u2013black\u2013red.',
    expectedBehavior: 'With the intended 1 k\u03A9 resistor: I = (5 \u2212 2)/1000 = 3 mA \u2014 dim but safe and stable.',
    observedBehavior: 'LED drew far more current than intended, overheated, and is degrading.',
    diagram: 'led-wrong-resistor',
    clues: [
      { label: 'Clue 1 \u2014 Current measurement', detail: 'The multimeter reads ~30 mA through the circuit. The intended value was ~3 mA \u2014 ten times too high.' },
      { label: 'Clue 2 \u2014 Colour code', detail: 'The installed resistor reads brown\u2013black\u2013red = 1, 0, \u00D7100 = 1 k\u03A9\u2026 wait, check the third band again: it is actually brown\u2013black\u2013brown = 100 \u03A9. Easy to misread red vs brown under lab light.' },
      { label: 'Clue 3 \u2014 The maths', detail: 'I = (5 \u2212 2)/100 = 30 mA \u2014 exactly what is measured. The resistor value explains the current perfectly.' },
    ],
    faultOptions: [
      { id: 'f1', label: 'The LED is reversed' },
      { id: 'f2', label: 'The supply is too high' },
      { id: 'f3', label: 'A 100 \u03A9 resistor was used instead of the intended 1 k\u03A9 \u2014 10\u00D7 too much current' },
      { id: 'f4', label: 'The LED has failed open' },
    ],
    correctFaultId: 'f3',
    faultExplanation:
      'The measured current matches a 100 \u03A9 resistor exactly: (5 \u2212 2)/100 = 30 mA. That is above the ~20 mA comfort zone of an indicator LED, so it overheats and degrades. The fix is the correct value, not a bigger LED.',
    fixOptions: [
      { id: 'x1', label: 'Install the intended 1 k\u03A9 resistor (brown\u2013black\u2013red)' },
      { id: 'x2', label: 'Reduce the supply to 3 V' },
      { id: 'x3', label: 'Add a second LED in parallel' },
      { id: 'x4', label: 'Leave it \u2014 LEDs brighten as they warm up' },
    ],
    correctFixId: 'x1',
    fixExplanation:
      'Restoring the designed 3 mA fixes both symptoms at once: safe temperature and stable long-term brightness. Verify by re-measuring current after the swap.',
    concepts: ['Colour code reading', 'I = (V \u2212 V\u2091)/R', 'LED thermal limits'],
  },
  {
    id: 'doc-led-reversed',
    order: 4,
    title: 'Polarity Mystery',
    difficulty: 'medium',
    scenario:
      'A status indicator: 3.3 V logic rail \u2192 220 \u03A9 resistor \u2192 green LED \u2192 GND, built exactly like the documentation diagram \u2014 except the LED emits nothing.',
    expectedBehavior: 'Forward current (3.3 \u2212 2.1)/220 \u2248 5.5 mA: a clear green glow.',
    observedBehavior: 'Zero light. Current measures ~0 mA. Voltage across the LED reads 3.3 V \u2014 the full rail appears across the LED.',
    diagram: 'led-reversed',
    clues: [
      { label: 'Clue 1 \u2014 Voltage across the LED', detail: 'Almost the whole 3.3 V sits across the LED. A conducting forward-biased LED would drop only ~2.1 V, leaving ~1.2 V across the resistor.' },
      { label: 'Clue 2 \u2014 Legs', detail: 'Both legs are trimmed to the same length after mounting (a classic trap \u2014 the length clue is gone). But the flat spot on the plastic rim faces the resistor side.' },
      { label: 'Clue 3 \u2014 Physics', detail: 'Reverse-biased diodes block current. A reversed LED drops the entire supply across itself \u2014 which is exactly what Clue 1 shows.' },
    ],
    faultOptions: [
      { id: 'f1', label: 'The LED is inserted backwards (cathode towards the resistor)' },
      { id: 'f2', label: 'The resistor is shorted' },
      { id: 'f3', label: 'The 3.3 V rail is dead' },
      { id: 'f4', label: 'The LED is a blue type needing 3.3 V exactly' },
    ],
    correctFaultId: 'f1',
    faultExplanation:
      'Full supply voltage across a non-conducting LED is the signature of reverse bias. The flat rim facing the "wrong" way confirms it: cathode is towards the resistor instead of towards GND.',
    fixOptions: [
      { id: 'x1', label: 'Re-insert the LED the other way round \u2014 anode towards the resistor, cathode towards GND' },
      { id: 'x2', label: 'Double the resistor to 440 \u03A9' },
      { id: 'x3', label: 'Raise the rail to 5 V' },
      { id: 'x4', label: 'Replace the resistor with a wire' },
    ],
    correctFixId: 'x1',
    fixExplanation:
      'Reversing the LED restores forward bias; the circuit then draws its designed 5.5 mA and glows. Note the trimmed legs: verify polarity by the flat rim or datasheet, not leg length alone.',
    concepts: ['LED polarity', 'Diode reverse blocking', 'The flat-rim marking'],
  },
  {
    id: 'doc-gate-input',
    order: 5,
    title: 'The Gate That Ignores B',
    difficulty: 'hard',
    scenario:
      'A student wires a digital test: two toggle switches (A, B) feed an AND gate; the output drives an LED. The LED should light only when A AND B are both HIGH, but it lights whenever switch A is HIGH \u2014 switch B seems completely ignored.',
    expectedBehavior: 'Truth table check: LED on only for A = 1 AND B = 1 (one row of four).',
    observedBehavior: 'LED follows A exactly: on for A = 1 (any B), off for A = 0. As if the gate were a buffer, not an AND.',
    diagram: 'gate-wrong-input',
    clues: [
      { label: 'Clue 1 \u2014 Probe input B', detail: 'With B switched ON, the voltage at the gate\u2019s B input pin reads 0 V. At the switch terminal it reads 5 V \u2014 the signal exists, but not at the gate.' },
      { label: 'Clue 2 \u2014 Wiring trace', detail: 'Following the wire from switch B: it lands on pin 6 of the IC. The datasheet says pin 6 is the second gate\u2019s output \u2014 the B input is pin 5.' },
      { label: 'Clue 3 \u2014 The behaviour pattern', detail: 'AND with a floating/held-LOW B input outputs 0 always\u2026 but if B\u2019s pin actually floats high internally, output \u2248 A. The observed "LED = A" fits a B input that is not what the switch controls.' },
    ],
    faultOptions: [
      { id: 'f1', label: 'Switch A is faulty' },
      { id: 'f2', label: 'The AND gate is damaged internally' },
      { id: 'f3', label: 'Switch B\u2019s wire is connected to the wrong IC pin \u2014 the gate\u2019s B input is not receiving the signal' },
      { id: 'f4', label: 'The LED is reversed' },
    ],
    correctFaultId: 'f3',
    faultExplanation:
      'Signal tracing is decisive: 5 V exists at the switch but 0 V at the gate\u2019s B input, and the wire lands one pin off (output of a neighbouring gate instead of the input). The gate itself is fine \u2014 it simply never hears switch B.',
    fixOptions: [
      { id: 'x1', label: 'Move the wire from pin 6 to pin 5 (the AND gate\u2019s B input)' },
      { id: 'x2', label: 'Replace the IC' },
      { id: 'x3', label: 'Replace switch B' },
      { id: 'x4', label: 'Swap the LED for a brighter one' },
    ],
    correctFixId: 'x1',
    fixExplanation:
      'With B properly on the gate\u2019s input, the truth table works: LED on only when A = 1 AND B = 1. Lesson: always verify signals at the destination pin, not just at the source \u2014 and keep the datasheet open.',
    concepts: ['Truth-table debugging', 'Signal tracing with a multimeter', 'IC pinout discipline'],
  },
]
