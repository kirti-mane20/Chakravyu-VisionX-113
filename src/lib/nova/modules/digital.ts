import type { LearningModule } from '../types'

export const digitalModule: LearningModule = {
  id: 'digital',
  title: 'Digital Electronics & Logic Gates',
  tagline: 'From 0s and 1s to the gates that build every processor.',
  description:
    'How binary numbers represent the real world, how AND/OR/NOT/XOR gates decide, and how simple gates combine into circuits that compute.',
  icon: 'Binary',
  lessons: [
    {
      id: 'digital-gates',
      moduleId: 'digital',
      title: 'Binary & the Basic Logic Gates',
      difficulty: 'easy',
      minutes: 10,
      summary:
        'Digital electronics only knows two voltages: LOW (0) and HIGH (1). Meet the gates that decide between them.',
      sections: [
        {
          heading: 'Why two states?',
          body: [
            'Analog signals vary continuously, like a dimmer knob, but analog voltages are easily corrupted by noise. Digital electronics instead uses just two well-separated voltage levels \u2014 LOW (near 0 V, called logic 0) and HIGH (near the supply, called logic 1). Noise must be huge to push a 5 V signal down to where the circuit would read it as 0 V, which is why digital systems are so reliable.',
            'Everything a computer stores or computes \u2014 numbers, text, photos, music \u2014 is ultimately a long sequence of these 0s and 1s. Eight bits make one byte, enough to store one number from 0 to 255 or one ASCII character. Counting in binary works exactly like counting in decimal, except each place is worth twice the previous one (1, 2, 4, 8, 16\u2026) instead of ten times.',
          ],
        },
        {
          heading: 'The four gates you must know',
          body: [
            'A logic gate is a tiny circuit whose output depends on its inputs according to a fixed rule. AND outputs 1 only when all inputs are 1 \u2014 like a door needing two keys turned at once. OR outputs 1 when at least one input is 1 \u2014 like a room light controlled by two switches in parallel. NOT (an inverter) simply flips its single input: 0 becomes 1, 1 becomes 0.',
            'XOR (exclusive-OR) outputs 1 when its inputs are different. Think of a staircase light controlled by switches at the top and bottom: flicking either one changes the light. XOR is also the gate of comparison (are these equal?) and of binary addition \u2014 the sum bit of two bits is exactly A XOR B.',
            'Each gate is fully described by its truth table: a complete list of output for every input combination. A 2-input gate has 2\u00B2 = 4 rows; the truth table is the contract \u2014 memorise the rules, and you can predict any circuit made of gates. Try each one interactively in the Virtual Lab\u2019s logic gate simulator.',
          ],
        },
        {
          heading: 'From gates to real machines',
          body: [
            'Gates chain together into bigger blocks. An adder adds two bits and a carry. A multiplexer selects one of several inputs. Flip-flops store single bits, and registers line up flip-flops to store bytes and words. Put tens of thousands of such blocks together and you have a CPU.',
            'When you debug digital hardware, you reason gate by gate: check the inputs of the misbehaving gate, compute what the output should be, and compare with what you measure. The Circuit Doctor module drills exactly this skill with a gate wired to the wrong input.',
          ],
        },
      ],
      terms: [
        { term: 'Bit', definition: 'One binary digit \u2014 a single 0 or 1, stored as a LOW or HIGH voltage.' },
        { term: 'Truth table', definition: 'A table listing a gate\u2019s output for every possible input combination.' },
        { term: 'AND', definition: 'Outputs 1 only when all inputs are 1. A \u00B7 B.' },
        { term: 'OR', definition: 'Outputs 1 when at least one input is 1. A + B.' },
        { term: 'NOT', definition: 'Inverter \u2014 outputs the opposite of its input.' },
        { term: 'XOR', definition: 'Exclusive-OR: outputs 1 when inputs differ. The sum bit of binary addition.' },
      ],
      takeaways: [
        'Digital = two clean voltage levels, immune to small noise.',
        'AND = all inputs 1; OR = any input 1; NOT = flip; XOR = inputs differ.',
        'The truth table fully defines a gate \u2014 learn it, don\u2019t guess.',
        'Complex circuits are just gates chained together.',
      ],
      application: {
        title: 'Seatbelt warning system',
        body: 'A car\u2019s warning buzzer is logic in action: the buzzer sounds when (engine is ON) AND (seatbelt is UNFASTENED) AND (car is MOVING). Each sensor gives a 0/1 signal, and a 3-input AND gate combines them. Airbag deployment logic is similar but far more safety-critical, using redundant sensors and dedicated logic to decide in milliseconds.',
      },
      diagram: 'logic-gates',
      diagramCaption:
        'The four basic gates with their IEEE symbols. Try them live in the Virtual Lab gate simulator.',
      quiz: [
        {
          id: 'digital-gates-q1',
          question: 'An AND gate has inputs A = 1, B = 0. Output?',
          options: ['1', '0', 'Depends on the previous state', 'Undefined'],
          correctIndex: 1,
          explanation: 'AND needs all inputs = 1. Since B = 0, the output is 0.',
        },
        {
          id: 'digital-gates-q2',
          question: 'Which gate outputs 1 when its two inputs are different?',
          options: ['AND', 'OR', 'XOR', 'NOT'],
          correctIndex: 2,
          explanation: 'XOR (exclusive-OR) is 1 exactly when the inputs differ \u2014 it is the "difference detector".',
        },
        {
          id: 'digital-gates-q3',
          question: 'How many rows does the truth table of a 3-input gate have?',
          options: ['3', '6', '8', '9'],
          correctIndex: 2,
          explanation: '2\u207F rows for n inputs: 2\u00B3 = 8 combinations for 3 inputs.',
        },
      ],
    },
    {
      id: 'digital-combinational',
      moduleId: 'digital',
      title: 'Combining Gates: Adders & Decision Circuits',
      difficulty: 'medium',
      minutes: 11,
      summary:
        'See how a handful of gates becomes a binary adder \u2014 the heart of every arithmetic unit \u2014 and how designers describe circuits with Boolean algebra.',
      sections: [
        {
          heading: 'The half adder \u2014 gates that can count',
          body: [
            'Add two single bits by hand: 0+0 = 00, 0+1 = 01, 1+0 = 01, 1+1 = 10. Each result has a sum bit and a carry bit. Look closely: the sum bit is 1 exactly when the inputs differ, which is A XOR B. The carry bit is 1 only when both inputs are 1, which is A AND B.',
            'So a "half adder" is just two gates: XOR for the sum, AND for the carry. This is the smallest circuit that can truly compute arithmetic. Chain a half adder with carry logic to build a full adder, and connect eight full adders to add two 8-bit numbers \u2014 exactly what the ALU inside a microcontroller does.',
            'This pattern \u2014 small gates composing into a meaningful block \u2014 is the essence of digital design. Multiplexers (selectors), decoders (one-of-n activators) and comparators are all built the same way from a truth table.',
          ],
        },
        {
          heading: 'Boolean algebra \u2014 maths for circuits',
          body: [
            'George Boole\u2019s algebra describes logic with symbols: \u00B7 for AND, + for OR, an overbar (or \u2032) for NOT. Identities like A + 0 = A, A \u00B7 1 = A, and De Morgan\u2019s laws ( (A \u00B7 B)\u2032 = A\u2032 + B\u2032 ) let designers simplify circuits before building them \u2014 fewer gates means lower cost, less power and fewer things to break.',
            'De Morgan\u2019s law deserves special attention: it shows an AND gate with inverted inputs behaves like an OR gate with inverted output (a NAND in disguise). Real chip libraries are dominated by NAND and NOR precisely because they are "universal" \u2014 any logic function can be built from NANDs alone.',
          ],
        },
        {
          heading: 'Timing matters',
          body: [
            'Real gates take a few nanoseconds to switch, so signals arriving via different paths can briefly disagree \u2014 causing momentary glitches called hazards. In synchronous design, a clock line tells registers to sample only when everything has settled, which is why "clock speed" defines how fast a processor runs its logic.',
            'For your projects, the practical rule is: keep combinational logic for decisions, use clocked storage (flip-flops) when a value must persist between steps, and never assume outputs update instantly.',
          ],
        },
      ],
      terms: [
        { term: 'Half adder', definition: 'XOR (sum) + AND (carry) circuit that adds two bits.' },
        { term: 'ALU', definition: 'Arithmetic Logic Unit \u2014 the part of a CPU built from adders and logic that performs calculations.' },
        { term: 'Boolean algebra', definition: 'Algebra of logic: AND, OR, NOT operations and their identities.' },
        { term: 'De Morgan\u2019s laws', definition: '(A\u00B7B)\u2032 = A\u2032 + B\u2032 and (A+B)\u2032 = A\u2032 \u00B7 B\u2032 \u2014 swap AND/OR and invert.' },
        { term: 'NAND', definition: 'NOT-AND: 0 unless all inputs are 1\u2026 inverted. Universal gate \u2014 can build any logic function.' },
        { term: 'Multiplexer', definition: 'A gate-controlled switch that forwards one of several inputs to the output.' },
      ],
      takeaways: [
        'Sum = A XOR B, Carry = A AND B \u2014 two gates make an adder.',
        'Boolean algebra simplifies circuits: fewer gates, lower cost.',
        'NAND/NOR are universal \u2014 any function can be built from them.',
        'Real gates have delay; clocks keep big circuits synchronised.',
      ],
      application: {
        title: 'Overflow alarm in a water tank',
        body: 'Two float sensors: HIGH (H) and PUMP (P). Rule: sound an alarm if the tank is high while the pump is still running \u2014 H AND P. A second rule \u2014 alarm also if both a high sensor and a low sensor read at once (impossible = sensor fault) \u2014 is XOR logic detecting inconsistency. A few gates implement a genuinely useful safety monitor.',
      },
      diagram: 'half-adder',
      diagramCaption:
        'Half adder: the XOR gate produces the sum bit, the AND gate produces the carry bit.',
      quiz: [
        {
          id: 'digital-comb-q1',
          question: 'In a half adder, which gate produces the carry bit?',
          options: ['XOR', 'AND', 'OR', 'NOT'],
          correctIndex: 1,
          explanation: 'Carry is 1 only when both inputs are 1 (1+1=10), so it is A AND B.',
        },
        {
          id: 'digital-comb-q2',
          question: 'Simplify: (A \u00B7 B)\u2032 using De Morgan\u2019s law.',
          options: ['A\u2032 \u00B7 B\u2032', 'A\u2032 + B\u2032', 'A + B', 'A\u2032 \u00B7 B'],
          correctIndex: 1,
          explanation: 'De Morgan: the complement of A\u00B7B becomes A\u2032 + B\u2032 \u2014 AND becomes OR, both inputs invert.',
        },
        {
          id: 'digital-comb-q3',
          question: 'Why are NAND gates called universal?',
          options: [
            'They are the cheapest to manufacture',
            'Any logic function can be built using only NAND gates',
            'They work with any supply voltage',
            'They have universal truth tables',
          ],
          correctIndex: 1,
          explanation: 'NAND (and NOR) can implement NOT, AND, OR and XOR by suitable wiring, so any digital circuit can be built from NANDs alone.',
        },
      ],
    },
  ],
}
