// ─── NOVA AI built-in educational knowledge base ────────────────────────────
// Deterministic keyword-matched responses so the assistant works fully offline.
// The backend tries the real AI model first; this is the guaranteed fallback.

export interface KnowledgeEntry {
  id: string
  keywords: string[]
  title: string
  answer: string
}

export const NOVA_SUGGESTED_PROMPTS: string[] = [
  'Explain Ohm\u2019s law with an example',
  'How do I calculate the right resistor for an LED?',
  'What is the difference between AND and XOR gates?',
  'How does a transistor work as a switch?',
  'Walk me through my first Arduino blink program',
  'Why does FM sound better than AM?',
  'What is aliasing and how do I avoid it?',
  'Explain the IoT architecture layers',
  'Give me a practice question on series circuits',
  'How do I debug a circuit that does nothing?',
]

export const NOVA_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'ohms-law',
    keywords: ['ohm', 'ohms law', 'ohm\u2019s law', 'v=i*r', 'v = i', 'current voltage resistance', 'calculate current', 'i = v/r'],
    title: 'Ohm\u2019s Law',
    answer: `**Ohm's law** connects the three core electrical quantities:

> **V = I \u00D7 R** \u2014 Voltage (volts) = Current (amps) \u00D7 Resistance (ohms)

Rearranged, the two forms you will use most:
- **I = V / R** \u2014 how much current flows
- **R = V / I** \u2014 what resistance limits current to a target

**Worked example:** a 9 V battery feeds a 470 \u03A9 resistor.
I = 9 / 470 \u2248 **0.019 A \u2248 19 mA**.

**Watch the units** \u2014 the classic mistake: k\u03A9 and mA pair beautifully (V / k\u03A9 = mA), but mixing V with k\u03A9 and expecting amps, or ohms with k\u03A9, will misplace the decimal point. 12 V across 2 k\u03A9 is **6 mA**, not 6 A or 0.6 mA.

Try it live: the **Virtual Lab** lets you move voltage and resistance sliders and watch the current recalculate with Ohm's law.`,
  },
  {
    id: 'led-resistor',
    keywords: ['led resistor', 'led current', 'calculate resistor for led', 'led series resistor', 'how many ohms for led', 'led brightness'],
    title: 'Choosing an LED resistor',
    answer: `**Formula:** R = (V_supply \u2212 V_forward) / I_target

- V_forward depends on colour: **red \u2248 2 V, green/yellow \u2248 2.1 V, blue/white \u2248 3 V**
- Safe indicator current: **5\u201320 mA** (10 mA is a sweet spot)

**Example:** 5 V supply, red LED, 10 mA target:
R = (5 \u2212 2) / 0.01 = **300 \u03A9** \u2192 use the next standard value up (330 \u03A9).

**Why the resistor is non-negotiable:** an LED is a diode, not a resistor \u2014 once forward-biased it will pull whatever current the circuit allows until it overheats. The resistor sets that current.

**Common errors:**
1. No resistor \u2192 LED burns (sometimes instantly)
2. Reversed LED \u2192 stays dark (long leg = anode = towards +)
3. Supply minus V_f forgotten \u2192 resistor 2\u00D7 too big

The Virtual Lab circuit simulates exactly this \u2014 try 100 \u03A9 vs 1 k\u03A9 and compare brightness and current.`,
  },
  {
    id: 'logic-gates',
    keywords: ['logic gate', 'and gate', 'or gate', 'xor', 'not gate', 'truth table', 'nand', 'difference between and and xor'],
    title: 'Logic gates',
    answer: `**The four basic gates** (2-input unless noted):

| Gate | Rule | 1-line identity |
|------|------|-----------------|
| AND | 1 only when **all** inputs are 1 | "both keys" |
| OR | 1 when **any** input is 1 | "either key" |
| NOT | flips its single input | "the opposite" |
| XOR | 1 when inputs are **different** | "difference detector" |

**AND vs XOR \u2014 the classic confusion:**
- AND(1,1) = 1 AND XOR(1,1) = **0** \u2014 XOR wants inputs *different*
- XOR is the **sum bit** of binary addition: 1+1 = 10 (sum 0, carry 1)

**Fast facts:**
- A 2-input gate has 4 truth-table rows; 3 inputs \u2192 8 rows (2\u207F).
- NAND and NOR are *universal*: any circuit can be built from NANDs alone.
- XOR detects inequality \u2014 used in comparators and parity checks.

Open the **Virtual Lab \u2192 Logic Gates** tab: toggle inputs and watch each output and its truth table update live.`,
  },
  {
    id: 'transistor-switch',
    keywords: ['transistor', 'bjt', 'mosfet', 'switch transistor', 'how does a transistor work', 'base resistor', 'amplifier'],
    title: 'Transistors as switches',
    answer: `**The core idea:** a small current (BJT) or voltage (MOSFET) on the control terminal lets a much larger current flow through the load.

**NPN as a low-side switch (the classic pattern):**
1. Load (motor, relay, LED strip) from **+V to collector**
2. **Emitter to GND**
3. Microcontroller pin \u2192 **base resistor (1 k\u03A9 is a good default)** \u2192 base

Pin HIGH \u2192 base current flows \u2192 transistor saturates \u2192 load ON.

**Sizing the base resistor:** I\u1D2E \u2248 (V_pin \u2212 0.7) / R\u1D2E. Pick R\u1D2E so \u03B2 \u00D7 I\u1D2E comfortably exceeds your load current (saturate with \u03B2/5 margin).

**Why the resistor?** Without it, the pin would drive unlimited base current through the base-emitter diode junction and damage the pin or transistor.

**MOSFET alternative:** voltage-controlled gate, ~zero steady-state gate current \u2014 the modern choice for loads. Use *logic-level* MOSFETs for 3.3/5 V drive, and always check V_gs(threshold) in the datasheet.`,
  },
  {
    id: 'arduino-start',
    keywords: ['arduino', 'blink', 'setup loop', 'first program', 'digitalwrite', 'pinmode', 'getting started', 'arduino code'],
    title: 'Your first Arduino program',
    answer: `**The mandatory first sketch \u2014 Blink:**

\`\`\`cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);   // run once: pin 13 drives current
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH); // LED on
  delay(1000);                     // wait 1 s
  digitalWrite(LED_BUILTIN, LOW);  // LED off
  delay(1000);                     // wait 1 s
}
\`\`\`

**The three primitives:**
- \`pinMode(pin, mode)\` \u2014 direction: OUTPUT, INPUT, INPUT_PULLUP
- \`digitalWrite(pin, HIGH|LOW)\` \u2014 drive 5 V or 0 V
- \`delay(ms)\` \u2014 pause (blocks everything, fine for Blink)

**Why setup/loop?** \`setup()\` configures hardware once after reset; \`loop()\` runs forever \u2014 read inputs, decide, act. That read \u2192 decide \u2192 act cycle is every embedded program ever.

**Common first bugs:**
1. Forgot \`pinMode\` \u2192 LED glows faintly or not at all
2. Wrong pin number \u2192 code "works", nothing happens
3. \`digitalRead\` written where \`digitalWrite\` was meant

Hardware: pin 13 \u2192 220 \u03A9 \u2192 LED anode; cathode \u2192 GND. (Built-in LED already exists on pin 13.)`,
  },
  {
    id: 'pwm',
    keywords: ['pwm', 'analogwrite', 'duty cycle', 'dim led', 'motor speed', 'pulse width'],
    title: 'PWM \u2014 fake analog from digital pins',
    answer: `**PWM (Pulse Width Modulation)** switches a pin ON/OFF very fast and varies the **duty cycle** \u2014 the fraction of time it stays HIGH.

- \`analogWrite(pin, 0)\` \u2192 0% (always off)
- \`analogWrite(pin, 128)\` \u2192 ~50% \u2192 LED at half brightness
- \`analogWrite(pin, 255)\u2019 \u2192 100% (fully on)

The load responds to the **average**, not the pulses: your eye smooths a 490 Hz LED flicker into steady dim light; a motor smooths pulses into steady speed.

**Why PWM instead of a resistor for dimming?** The switch (transistor) is either fully ON or fully OFF, wasting almost no power as heat \u2014 that's why every DC motor driver and dimmer is PWM-based.

**Arduino notes:** \`analogWrite\` works only on pins marked \`~\` (UNO: 3, 5, 6, 9, 10, 11). It does **not** produce analog voltage \u2014 for that you add an RC low-pass filter after the pin.`,
  },
  {
    id: 'am-fm',
    keywords: ['am', 'fm', 'modulation', 'am vs fm', 'carrier', 'why fm sounds better', 'radio'],
    title: 'AM vs FM modulation',
    answer: `**Both put a low-frequency message onto a high-frequency carrier** \u2014 they differ in *what* the message changes.

**AM (Amplitude Modulation)**
- Message changes the carrier\u2019s **amplitude**
- Simple receivers, narrow bandwidth (~10 kHz)
- Weakness: amplitude noise (lightning, motors) passes straight through \u2192 crackle

**FM (Frequency Modulation)**
- Message changes the carrier\u2019s **frequency**
- Amplitude noise ignored by the demodulator \u2192 clean audio
- Cost: wide bandwidth (~200 kHz per station)

**Why "FM sounds better":** the information lives in frequency, so amplitude noise is naturally rejected. Trade-off confirmed: quality for spectrum.

**Modern twist:** digital systems (Wi-Fi, 4G) hop between discrete phase/amplitude states \u2014 QPSK, 64-QAM \u2014 squeezing more bits per symbol while tolerating noise.

Try the **Innovation Studio \u2192 Communication Network** sim: raise noise and watch signal quality and errors change.`,
  },
  {
    id: 'aliasing-sampling',
    keywords: ['aliasing', 'alias', 'sampling', 'nyquist', 'sample rate', 'sampling theorem', 'anti-aliasing'],
    title: 'Sampling & aliasing',
    answer: `**Sampling** = measuring a continuous signal at regular intervals to store it digitally.

**The Nyquist\u2013Shannon theorem:** sample **faster than 2\u00D7 the highest frequency** present.
- Audio to 20 kHz \u2192 CD samples at 44.1 kHz \u2713
- Voice to 3.4 kHz \u2192 phones sample at 8 kHz \u2713

**Aliasing** is what happens when you break the rule: high frequencies masquerade as false low ones and the data is corrupted *irreversibly*. The spinning-wheel-backwards effect in videos is aliasing: the camera samples slower than the spokes rotate.

**The defence:** an **anti-aliasing low-pass filter** on the analog signal *before* the ADC, cutting everything above half the sample rate. It must be analog \u2014 once aliased, no digital filter can undo it.

**In your projects:** \`analogRead\` in \`loop()\` with \`delay(100)\` = 10 Hz sampling \u2014 fine for room temperature, hopeless for audio or vibration. Choose the rate from the physics of the signal.`,
  },
  {
    id: 'filters',
    keywords: ['filter', 'low pass', 'high pass', 'band pass', 'notch', 'rc filter', 'cutoff', 'cutoff frequency'],
    title: 'Filters',
    answer: `**A filter passes some frequencies and blocks others.** Four families:

| Type | Passes | Typical use |
|------|--------|-------------|
| Low-pass | below cutoff | smoothing, anti-aliasing |
| High-pass | above cutoff | removing DC drift, mains hum |
| Band-pass | one band | radio tuning, ECG |
| Notch | everything except one narrow band | killing 50/60 Hz hum |

**The one formula to memorise \u2014 RC cutoff:**
f_c = 1 / (2\u03C0RC)

R = 1 k\u03A9, C = 1 \u00B5F \u2192 f_c \u2248 **159 Hz**. Below it, signals pass; above, each octave gets attenuated (~6 dB/octave for one RC stage).

**Intuition:** a capacitor resists voltage *changes*. Fast wiggles are shunted through it (lost); slow waves charge it gently and pass. That's also why a decoupling capacitor next to every chip works \u2014 it's a low-pass for supply noise.

**Software version:** a 10-sample moving average on an Arduino is a cheap digital low-pass for slow sensors.`,
  },
  {
    id: 'iot-architecture',
    keywords: ['iot', 'internet of things', 'iot architecture', 'mqtt', 'lora', 'iot layers', 'smart home architecture'],
    title: 'IoT architecture',
    answer: `**The four-layer IoT reference model:**

1. **Things** \u2014 sensor/actuator nodes (temperature node, door sensor)
2. **Connectivity** \u2014 Wi-Fi, BLE, LoRaWAN, NB-IoT
3. **Cloud/Backend** \u2014 ingestion, storage, rules, analytics
4. **Application** \u2014 dashboards, mobile apps, alerts

**Choosing the radio = choosing your power budget:**

| Radio | Range | Power | Best for |
|-------|-------|-------|----------|
| Wi-Fi | home | high | cameras, mains devices |
| BLE | ~10 m | very low | wearables, phone links |
| LoRaWAN | km-scale | tiny | agriculture, city sensors |
| NB-IoT | nationwide | low | meters, trackers |

Rule: **range, power, data rate \u2014 pick two.**

**Messaging:** **MQTT** publish/subscribe wins \u2014 devices publish to topics (\`home/livingroom/temp\`), dashboards subscribe. Tiny overhead, QoS options.

**Security baseline:** no default passwords, TLS to the cloud, signed OTA updates, per-device keys \u2014 and collect only the data you need.`,
  },
  {
    id: 'diode',
    keywords: ['diode', 'pn junction', 'forward voltage', '0.7v', 'rectifier', 'zener', 'reverse bias', 'forward bias'],
    title: 'Diodes & the PN junction',
    answer: `**A diode is a one-way valve for current.**

**Why:** doping silicon makes N-type (extra electrons, e.g. phosphorus) and P-type (missing electrons = holes, e.g. boron). At the PN junction a **depletion region** forms with an internal barrier of ~**0.7 V** (silicon).

- **Forward bias** (+ on P side): barrier pushed down \u2192 above 0.7 V, current flows freely
- **Reverse bias** (+ on N side): depletion widens \u2192 only tiny leakage flows

**Uses:**
- **Bridge rectifier** + smoothing cap \u2192 the DC supply inside most mains devices
- **Reverse-polarity protection** \u2014 one diode saves electronics from a backwards battery
- **Zener** \u2014 conducts in reverse at a precise voltage \u2192 cheap voltage reference
- **Schottky** \u2014 only ~0.3 V drop, fast \u2192 efficient converters
- **LED** \u2014 a forward-biased junction engineered to emit photons (~2 V red, ~3 V blue)

**Limits to respect:** max forward current (heat) and max reverse voltage (breakdown).`,
  },
  {
    id: 'sensors-adc',
    keywords: ['sensor', 'adc', 'analog read', 'thermistor', 'ldr', 'calibration', '10-bit', '4.9 mv'],
    title: 'Sensors & the ADC',
    answer: `**A sensor converts a physical quantity into an electrical signal.** Analog sensors need conditioning before the microcontroller:

1. **Voltage divider** \u2014 sensor resistance + fixed resistor turn resistance change into voltage change
2. **ADC** \u2014 Arduino UNO: 10-bit \u2192 1024 levels over 0\u20135 V \u2192 **~4.9 mV per count**
3. **Convert & smooth** \u2014 map counts to units; average 10 samples to tame noise
4. **Calibrate** \u2014 two known points (ice water / boiling water) turn counts into \u00B0C

**Digital sensors skip the maths:** they send clean readings over I2C/SPI (e.g. BME280) \u2014 immune to cable noise, slightly more expensive.

**ADC quick maths:** \`counts = V \u00D7 1023 / 5\`. So 2.5 V \u2248 count 512.

**Choosing sensors \u2014 the four questions:** range? accuracy? interface (analog pin vs I2C)? response speed? Match them to your application before buying anything.`,
  },
  {
    id: 'debug-circuit',
    keywords: ['debug', 'troubleshoot', 'circuit not working', 'does nothing', 'fault finding', 'circuit doctor', 'not working'],
    title: 'Debugging a dead circuit',
    answer: `**Work systematically, not randomly.** The order that finds 90% of faults:

1. **Power** \u2014 measure the supply rail at the board. Is it actually there and the right value?
2. **Loop** \u2014 trace the complete current path. One lifted wire stops everything (series rule).
3. **Polarity** \u2014 LEDs, electrolytic capacitors, diodes, IC pin 1. Flat rim = cathode.
4. **Values** \u2014 re-read colour codes under good light; brown/red confusion is legendary (100 \u03A9 vs 1 k\u03A9 = 10\u00D7 current error).
5. **Signals at destinations** \u2014 verify the signal arrives at the *destination pin*, not just at the source (wires land one row/pin off constantly).

**Toolkit mentality:** multimeter continuity mode is your best friend. Check switch continuity in both positions \u2014 levers click, contacts fail.

Then practice: the **Circuit Doctor** module has 5 guided faults (broken wire, dead switch, wrong resistor, reversed LED, wrong gate pin) with clues and feedback \u2014 it trains exactly this reasoning.`,
  },
  {
    id: 'series-parallel',
    keywords: ['series', 'parallel', 'series vs parallel', 'voltage divider', 'equivalent resistance'],
    title: 'Series vs parallel',
    answer: `**Series** \u2014 one path, same current through everything:
- R_total = R1 + R2 + \u2026
- Voltage divides proportionally: V_R2 = V_total \u00D7 R2/(R1+R2)
- One break (open component) kills the whole chain

**Parallel** \u2014 multiple paths, same voltage across each:
- 1/R_total = 1/R1 + 1/R2 + \u2026 (two equal resistors: R/n)
- Current divides (Kirchhoff\u2019s current law at each node)
- One open branch leaves the others running

**Memory hooks:** series = Christmas lights going dark together; parallel = your house \u2014 every lamp sees full mains voltage independently.

**Classic example:** two 10 \u03A9 in parallel = 5 \u03A9. Four 100 \u03A9 in series = 400 \u03A9.

**Voltage divider** (series pair) is *the* sensor interface: thermistor/LDR on top, fixed R below, read the midpoint.`,
  },
  {
    id: 'units-prefixes',
    keywords: ['units', 'ma', 'ka', 'kilo', 'milli', 'prefix', 'unit conversion', 'how many ma in'],
    title: 'Units & prefixes',
    answer: `**The prefixes that matter in electronics:**

| Prefix | Symbol | Meaning | Example |
|--------|--------|---------|---------|
| giga | G | 10\u2079 | 2.4 GHz clock |
| mega | M | 10\u2076 | 1 M\u03A9 resistor |
| kilo | k | 10\u00B3 | 10 k\u03A9 pull-up |
| milli | m | 10\u207B\u00B3 | 20 mA LED current |
| micro | \u00B5 | 10\u207B\u2076 | 100 \u00B5F capacitor |
| nano | n | 10\u207B\u2079 | 100 nF decoupling cap |

**The handiest pairing:** volts \u00F7 kilohms = **milliamps**. 5 V / 1 k\u03A9 = 5 mA. No powers of ten needed.

**Capacitor codes:** "104" = 10 \u00D7 10\u2074 pF = 100 nF = 0.1 \u00B5F. Three ways to write the same capacitor \u2014 datasheets mix them freely.

**Formula check:** P = V \u00D7 I \u2192 watts = volts \u00D7 amps. A 5 V, 2 A supply = 10 W maximum.`,
  },
  {
    id: 'practice-question',
    keywords: ['practice', 'quiz me', 'test me', 'give me a question', 'practice question', 'exercise'],
    title: 'Practice question',
    answer: `Here is a graduated practice set \u2014 answers below, try first!

**Q1 (easy):** A 12 V supply feeds a 2 k\u03A9 resistor. What current flows?

**Q2 (medium):** 5 V supply, red LED (V\u2091 \u2248 2 V), 150 \u03A9 resistor. Approximate current, and is it safe for an indicator LED?

**Q3 (hard):** Two 10 \u03A9 resistors in parallel sit in series with a 20 \u03A9 resistor across 12 V. Total current?

---

**Answers:**

**Q1:** I = V/R = 12/2000 = **6 mA**.

**Q2:** I = (5 \u2212 2)/150 = **20 mA** \u2014 upper edge of the safe zone (5\u201320 mA). Fine, but 330 \u03A9 (\u22489 mA) would run cooler.

**Q3:** Parallel pair = 5 \u03A9. Total = 5 + 20 = 25 \u03A9. I = 12/25 = **0.48 A**.

Scored yourself 3/3? Head to the **Challenge Arena** for timed modes and six question categories.`,
  },
]

/** Deterministic keyword match against the knowledge base. Returns null if no confident match. */
export function matchKnowledge(query: string): KnowledgeEntry | null {
  const q = query.toLowerCase()
  let best: { entry: KnowledgeEntry; score: number } | null = null
  for (const entry of NOVA_KNOWLEDGE) {
    let score = 0
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score }
  }
  return best?.entry ?? null
}

export const NOVA_FALLBACK_ANSWER = `I'm NOVA, your ENTC learning assistant \u2014 running on my **built-in offline knowledge base** right now (no external AI model is connected in this demo).

I can give solid, beginner-friendly answers on these topics:

- **Ohm's law, units and series/parallel circuits**
- **LEDs and resistor selection**
- **Logic gates and Boolean algebra**
- **Diodes, transistors and MOSFET switches**
- **Arduino basics, PWM and common code bugs**
- **Sensors, ADCs and calibration**
- **AM/FM and digital communication**
- **Sampling, aliasing and filters**
- **IoT architecture, MQTT and security**
- **How to debug a circuit that does nothing**

Try asking about one of those, or tap a suggested prompt below. For anything I don't recognise offline, I'll point you to the most relevant lesson in the Learn library.`

/** Suggest the most relevant lesson for an unmatched question. */
export function suggestLessonFor(query: string): { title: string; lessonId: string; moduleId: string } | null {
  const q = query.toLowerCase()
  const map: { keywords: string[]; title: string; lessonId: string; moduleId: string }[] = [
    { keywords: ['resistor', 'colour code', 'color code', 'led'], title: 'Resistors, LEDs & Component Basics', lessonId: 'basics-components', moduleId: 'basics' },
    { keywords: ['voltage', 'current', 'ohm'], title: 'Voltage, Current & Ohm\u2019s Law', lessonId: 'basics-ohms-law', moduleId: 'basics' },
    { keywords: ['gate', 'binary', 'truth'], title: 'Binary & the Basic Logic Gates', lessonId: 'digital-gates', moduleId: 'digital' },
    { keywords: ['adder', 'boolean', 'nand', 'algebra'], title: 'Combining Gates: Adders & Decision Circuits', lessonId: 'digital-combinational', moduleId: 'digital' },
    { keywords: ['diode', 'junction', 'rectifier', 'zener'], title: 'Diodes & the PN Junction', lessonId: 'semi-diode', moduleId: 'semiconductors' },
    { keywords: ['transistor', 'mosfet', 'amplif', 'bjt'], title: 'Transistors: Amplifiers & Switches', lessonId: 'semi-transistor', moduleId: 'semiconductors' },
    { keywords: ['sensor', 'adc', 'thermistor', 'ldr', 'transducer'], title: 'Sensors: How Machines Sense the World', lessonId: 'sensors-sensing', moduleId: 'sensors-mcu' },
    { keywords: ['arduino', 'pwm', 'sketch', 'gpio', 'microcontroller'], title: 'Arduino & the Microcontroller Workflow', lessonId: 'sensors-arduino', moduleId: 'sensors-mcu' },
    { keywords: ['am', 'fm', 'modulation', 'carrier', 'antenna', 'radio'], title: 'Modulation: Putting Information on a Carrier', lessonId: 'comm-modulation', moduleId: 'communications' },
    { keywords: ['snr', 'error', 'crc', 'fec', 'link', 'noise'], title: 'Digital Links, Noise & Reliability', lessonId: 'comm-digital-link', moduleId: 'communications' },
    { keywords: ['sample', 'alias', 'nyquist', 'quantis'], title: 'Signals, Sampling & Aliasing', lessonId: 'signals-sampling', moduleId: 'signals' },
    { keywords: ['filter', 'cutoff', 'frequency', 'fourier', 'spectrum'], title: 'Filters & Shaping Signals', lessonId: 'signals-filters', moduleId: 'signals' },
    { keywords: ['embedded', 'firmware', 'interrupt', 'watchdog', 'real-time'], title: 'Anatomy of an Embedded System', lessonId: 'embedded-anatomy', moduleId: 'embedded-iot' },
    { keywords: ['iot', 'mqtt', 'lora', 'cloud', 'smart'], title: 'IoT: Connecting Devices to the World', lessonId: 'embedded-iot', moduleId: 'embedded-iot' },
  ]
  for (const m of map) {
    if (m.keywords.some((k) => q.includes(k))) return { title: m.title, lessonId: m.lessonId, moduleId: m.moduleId }
  }
  return null
}
