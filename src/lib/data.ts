export type Topic = {
  id: string;
  title: string;
  category: "Digital" | "Microcontrollers" | "IoT" | "Communication" | "Signals";
  level: "Beginner" | "Intermediate";
  summary: string;
  points: string[];
  check: { q: string; options: string[]; answer: number };
};

export const TOPICS: Topic[] = [
  {
    id: "logic-gates", title: "Logic Gates & Truth Tables", category: "Digital", level: "Beginner",
    summary: "Gates are the building blocks of every digital circuit. Each gate maps binary inputs to one output.",
    points: ["AND outputs 1 only if all inputs are 1.", "OR outputs 1 if any input is 1.", "NAND and NOR are universal — any circuit can be built from them alone.", "XOR outputs 1 when inputs differ."],
    check: { q: "Which gate is called a universal gate?", options: ["XOR", "NAND", "AND", "Buffer"], answer: 1 },
  },
  {
    id: "flip-flops", title: "Flip-Flops & Counters", category: "Digital", level: "Intermediate",
    summary: "Flip-flops store one bit of state and change on a clock edge. Chained together they form counters and registers.",
    points: ["SR, D, JK and T are the common types.", "A D flip-flop copies D to Q on the clock edge.", "A T flip-flop toggles — perfect for ripple counters.", "n flip-flops count up to 2ⁿ states."],
    check: { q: "How many states can a 3-bit counter represent?", options: ["3", "6", "8", "9"], answer: 2 },
  },
  {
    id: "arduino-gpio", title: "Arduino GPIO Basics", category: "Microcontrollers", level: "Beginner",
    summary: "GPIO pins let a microcontroller read buttons and drive LEDs. Configure first, then read or write.",
    points: ["pinMode(pin, OUTPUT) configures a pin.", "digitalWrite(pin, HIGH) drives it to 5 V.", "digitalRead() returns HIGH or LOW.", "Use INPUT_PULLUP to avoid floating inputs."],
    check: { q: "Which function sets a pin as an output?", options: ["digitalRead()", "analogWrite()", "pinMode()", "Serial.begin()"], answer: 2 },
  },
  {
    id: "pwm", title: "PWM & Analog Output", category: "Microcontrollers", level: "Intermediate",
    summary: "Pulse Width Modulation fakes an analog voltage by switching a pin on and off quickly.",
    points: ["Duty cycle = ON time / period.", "analogWrite(pin, 0–255) sets duty cycle on Arduino.", "50% duty at 5 V averages to 2.5 V.", "Used for LED dimming and motor speed."],
    check: { q: "analogWrite(9, 128) gives roughly what duty cycle?", options: ["25%", "50%", "75%", "100%"], answer: 1 },
  },
  {
    id: "sensors-iot", title: "Sensors & IoT Nodes", category: "IoT", level: "Beginner",
    summary: "An IoT node senses the world, processes data, and sends it over a network.",
    points: ["Analog sensors (LDR, LM35) need an ADC.", "Digital sensors (DHT11) use a data protocol.", "ESP32/ESP8266 add Wi-Fi.", "MQTT is a lightweight publish/subscribe protocol."],
    check: { q: "Which protocol is lightweight publish/subscribe for IoT?", options: ["FTP", "MQTT", "SMTP", "HTTP/3"], answer: 1 },
  },
  {
    id: "modulation", title: "AM, FM & Digital Modulation", category: "Communication", level: "Beginner",
    summary: "Modulation places information onto a carrier wave so it can travel over a channel.",
    points: ["AM varies carrier amplitude.", "FM varies carrier frequency — better noise immunity.", "ASK, FSK, PSK are digital equivalents.", "QAM combines amplitude and phase."],
    check: { q: "Which analog modulation has better noise immunity?", options: ["AM", "FM", "Both equal", "Neither"], answer: 1 },
  },
  {
    id: "sampling", title: "Sampling & Nyquist Theorem", category: "Signals", level: "Intermediate",
    summary: "To digitize a signal without losing information, sample at least twice its highest frequency.",
    points: ["Nyquist rate = 2 × fmax.", "Undersampling causes aliasing.", "Anti-aliasing filters remove high frequencies first.", "Audio CDs sample at 44.1 kHz for ~20 kHz audio."],
    check: { q: "Minimum sampling rate for a 5 kHz signal?", options: ["2.5 kHz", "5 kHz", "10 kHz", "20 kHz"], answer: 2 },
  },
  {
    id: "filters", title: "RC Filters", category: "Signals", level: "Beginner",
    summary: "A resistor and capacitor form a simple filter that passes low or high frequencies.",
    points: ["Cut-off fc = 1 / (2πRC).", "Low-pass: output across capacitor.", "High-pass: output across resistor.", "Roll-off is −20 dB/decade for first order."],
    check: { q: "Increasing R in an RC low-pass filter makes fc…", options: ["Higher", "Lower", "Unchanged", "Zero"], answer: 1 },
  },
];

export type Fault = {
  id: string;
  title: string;
  symptom: string;
  readings: { label: string; value: string }[];
  options: { text: string; correct: boolean; why: string }[];
  hint: string;
  fix: string;
};

export const FAULTS: Fault[] = [
  {
    id: "led-reversed", title: "LED won't light", symptom: "A 5 V supply, 220 Ω resistor and red LED are connected in series. The switch is ON, but the LED stays dark.",
    readings: [{ label: "Supply", value: "5.00 V" }, { label: "Across LED", value: "5.00 V" }, { label: "Current", value: "0 mA" }],
    options: [
      { text: "Resistor value too high", correct: false, why: "A higher resistor would still allow some current and a dim glow, and voltage would drop across it." },
      { text: "LED inserted in reverse polarity", correct: true, why: "A reverse-biased LED blocks current, so the full supply voltage appears across it with 0 mA." },
      { text: "Power supply is dead", correct: false, why: "The meter reads 5 V at the supply, so it is working." },
    ],
    hint: "Full supply voltage is appearing across a single component with no current flowing.",
    fix: "Flip the LED: the longer leg (anode) goes towards +5 V.",
  },
  {
    id: "led-burnt", title: "LED flashed then died", symptom: "A student connected an LED directly across a 9 V battery. It flashed brightly once and now never lights.",
    readings: [{ label: "Supply", value: "9.00 V" }, { label: "Series resistor", value: "none" }, { label: "Current now", value: "0 mA" }],
    options: [
      { text: "Missing current-limiting resistor burnt the LED", correct: true, why: "Without a resistor, current far exceeded the ~20 mA rating and destroyed the junction." },
      { text: "Battery voltage too low", correct: false, why: "9 V is far above the LED's ~2 V forward voltage, not too low." },
      { text: "LED needs AC", correct: false, why: "LEDs are diodes and run on DC." },
    ],
    hint: "What normally limits current in an LED circuit?",
    fix: "Replace the LED and add a resistor: R = (9 − 2) / 0.02 ≈ 350 Ω (use 390 Ω).",
  },
  {
    id: "floating-input", title: "Button reads random values", symptom: "An Arduino reads a push-button on pin 2 using pinMode(2, INPUT). The serial monitor flickers between HIGH and LOW even when nobody touches it.",
    readings: [{ label: "Pin 2 (idle)", value: "0.8–3.9 V (unstable)" }, { label: "Pull resistor", value: "none" }],
    options: [
      { text: "Faulty Arduino board", correct: false, why: "This is classic behaviour of an unconnected input, not a broken board." },
      { text: "Floating input — no pull-up/pull-down", correct: true, why: "Without a reference, the pin picks up noise. A pull-up or pull-down gives a defined idle state." },
      { text: "Baud rate mismatch", correct: false, why: "A baud mismatch shows garbage characters, not clean HIGH/LOW flicker." },
    ],
    hint: "When the button is released, what is the pin actually connected to?",
    fix: "Use pinMode(2, INPUT_PULLUP) and wire the button to GND (logic inverted).",
  },
  {
    id: "regulator-hot", title: "7805 regulator overheating", symptom: "A 7805 supplies a 5 V, 800 mA load from a 12 V adapter. The regulator gets too hot to touch and the output drops out.",
    readings: [{ label: "Input", value: "12.0 V" }, { label: "Output", value: "5.0 V → 3.1 V" }, { label: "Load", value: "800 mA" }],
    options: [
      { text: "Excess power dissipation, no heatsink", correct: true, why: "P = (12 − 5) × 0.8 = 5.6 W, far too much without a heatsink. Thermal shutdown kicks in." },
      { text: "Output capacitor too large", correct: false, why: "A larger output capacitor does not cause heating." },
      { text: "Input voltage too low", correct: false, why: "12 V is above the ~7 V dropout requirement." },
    ],
    hint: "Calculate the power the regulator must burn: (Vin − Vout) × I.",
    fix: "Add a heatsink, lower input to ~8 V, or use a buck (switching) converter.",
  },
];

export type Question = { id: string; cat: "Digital" | "Boolean" | "Arduino"; q: string; code?: string; options: string[]; answer: number; explain: string };

export const QUESTIONS: Question[] = [
  { id: "d1", cat: "Digital", q: "What is the binary equivalent of decimal 13?", options: ["1011", "1101", "1110", "1001"], answer: 1, explain: "13 = 8 + 4 + 1 → 1101." },
  { id: "d2", cat: "Digital", q: "A 4:1 multiplexer needs how many select lines?", options: ["1", "2", "3", "4"], answer: 1, explain: "2² = 4 inputs, so 2 select lines." },
  { id: "d3", cat: "Digital", q: "Which flip-flop has no invalid state and toggles when J=K=1?", options: ["SR", "D", "JK", "Latch"], answer: 2, explain: "JK removes SR's invalid state and toggles when both inputs are 1." },
  { id: "d4", cat: "Digital", q: "Hexadecimal 0x1F equals decimal…", options: ["15", "31", "32", "17"], answer: 1, explain: "1×16 + 15 = 31." },
  { id: "b1", cat: "Boolean", q: "Simplify: A + A·B", options: ["A·B", "B", "A", "A + B"], answer: 2, explain: "Absorption law: A + AB = A(1 + B) = A." },
  { id: "b2", cat: "Boolean", q: "By De Morgan's theorem, (A·B)' equals…", options: ["A' · B'", "A' + B'", "A + B", "(A + B)'"], answer: 1, explain: "The complement of a product is the sum of complements." },
  { id: "b3", cat: "Boolean", q: "Output of A XOR B when A=1, B=1?", options: ["0", "1", "Undefined", "Z"], answer: 0, explain: "XOR is 1 only when inputs differ." },
  { id: "b4", cat: "Boolean", q: "Simplify: A·A'", options: ["A", "1", "0", "A'"], answer: 2, explain: "Complement law: a variable ANDed with its complement is 0." },
  { id: "a1", cat: "Arduino", q: "What does this code do?", code: "void loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}", options: ["LED always on", "Blinks LED every 1 s", "Reads pin 13", "Nothing"], answer: 1, explain: "On for 1 s, off for 1 s — the classic Blink sketch." },
  { id: "a2", cat: "Arduino", q: "analogRead() on an Uno returns a value in which range?", options: ["0–255", "0–1023", "0–5", "0–4095"], answer: 1, explain: "The Uno has a 10-bit ADC: 2¹⁰ = 1024 levels." },
  { id: "a3", cat: "Arduino", q: "Find the bug:", code: "void setup() {\n  Serial.begin(9600)\n}", options: ["Wrong baud rate", "Missing semicolon", "setup must return int", "No bug"], answer: 1, explain: "Serial.begin(9600) needs a terminating semicolon." },
  { id: "a4", cat: "Arduino", q: "Which function runs only once at power-up?", options: ["loop()", "main()", "setup()", "init()"], answer: 2, explain: "setup() runs once; loop() repeats forever." },
];
