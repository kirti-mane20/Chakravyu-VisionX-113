import type { LearningModule } from '../types'

export const communicationsModule: LearningModule = {
  id: 'communications',
  title: 'Communication Systems',
  tagline: 'How voice, data and video ride on electromagnetic waves.',
  description:
    'Modulation puts information onto a carrier; the link budget decides whether it arrives. From AM radio to modern digital links.',
  icon: 'RadioTower',
  lessons: [
    {
      id: 'comm-modulation',
      moduleId: 'communications',
      title: 'Modulation: Putting Information on a Carrier',
      difficulty: 'medium',
      minutes: 10,
      summary:
        'Low-frequency information cannot travel far by itself. Modulation lifts it onto a high-frequency carrier wave that can.',
      sections: [
        {
          heading: 'Why we need a carrier',
          body: [
            'A voice signal contains energy from roughly 300 Hz to 3.4 kHz. Antennas radiate efficiently only when their size is comparable to the wavelength, and wavelength = speed of light \u00F7 frequency. At 1 kHz the wavelength is 300 km \u2014 an impossible antenna. At 100 MHz the wavelength is 3 m \u2014 easy.',
            'So we impress the low-frequency information onto a high-frequency carrier wave. The carrier\u2019s amplitude, frequency or phase carries the message; the receiver extracts it again (demodulation). This also enables many stations to share the air: each transmits on a different carrier frequency, and tuned circuits select one at a time \u2014 that is what the numbers on a radio dial mean.',
          ],
        },
        {
          heading: 'AM and FM',
          body: [
            'Amplitude Modulation (AM) varies the carrier\u2019s amplitude with the message. It is simple and its bandwidth is modest (about twice the audio bandwidth), but any noise that changes the received amplitude \u2014 lightning, motors, ignition \u2014 rides straight into the output. That is why AM radio crackles.',
            'Frequency Modulation (FM) varies the carrier\u2019s frequency instead. Amplitude noise does not affect the instantaneous frequency, so FM rejects most of it \u2014 hence FM music sounds clean. The cost is bandwidth: commercial FM uses ~200 kHz per station versus ~10 kHz for AM, trading spectrum for quality.',
            'Digital systems modulate in discrete steps: shift the carrier between frequencies (FSK), phases (PSK) or amplitude/phase combinations (QAM). Wi-Fi uses OFDM \u2014 hundreds of closely spaced QAM subcarriers \u2014 to pack high data rates into its channel while resisting multipath echoes.',
          ],
        },
        {
          heading: 'The path from transmitter to receiver',
          body: [
            'A transmitter chain: source \u2192 modulator \u2192 power amplifier \u2192 antenna. A receiver chain: antenna \u2192 filter \u2192 low-noise amplifier \u2192 demodulator \u2192 output. Between them lies the channel \u2014 free space, cable or fibre \u2014 which adds loss, noise and distortion.',
            'How well the message survives depends on the signal-to-noise ratio (SNR) at the receiver: signal power divided by noise power, usually quoted in decibels. Higher SNR means more reliable, faster communication. You will explore this relationship directly in the Innovation Studio\u2019s Communication Network simulator, where raising noise visibly corrupts transmissions.',
          ],
        },
      ],
      terms: [
        { term: 'Carrier', definition: 'High-frequency wave whose parameter (A, f or \u03C6) is varied to carry information.' },
        { term: 'Modulation', definition: 'The process of encoding information onto a carrier.' },
        { term: 'AM', definition: 'Amplitude Modulation \u2014 message changes carrier amplitude. Simple, noise-prone.' },
        { term: 'FM', definition: 'Frequency Modulation \u2014 message changes carrier frequency. More bandwidth, rejects amplitude noise.' },
        { term: 'SNR', definition: 'Signal-to-Noise Ratio in dB \u2014 higher is better; sets reliability and data rate.' },
        { term: 'QAM', definition: 'Quadrature Amplitude Modulation \u2014 digital scheme varying both amplitude and phase (Wi-Fi, cable modems).' },
      ],
      takeaways: [
        'Antennas work when sized to the wavelength \u2014 hence high-frequency carriers.',
        'AM = amplitude varies (simple, noisy); FM = frequency varies (clean, wider).',
        'Digital schemes (FSK/PSK/QAM) hop between discrete states.',
        'SNR at the receiver decides how well the message survives.',
      ],
      application: {
        title: 'Why radio has station numbers',
        body: 'The "98.5" on a radio is the carrier frequency in MHz. Every station modulates a different carrier; the receiver\u2019s tuned filter isolates one, demodulates it, and you hear only that station. Two stations on the same frequency in the same city would interfere \u2014 spectrum is shared by giving carriers different slots, the same principle behind 4G/5G channels.',
      },
      diagram: 'am-modulation',
      diagramCaption:
        'AM in one picture: a slow message wave changes the amplitude of a fast carrier. The envelope is the message.',
      quiz: [
        {
          id: 'comm-mod-q1',
          question: 'Why do radio stations use high-frequency carriers?',
          options: [
            'High frequencies sound louder',
            'Efficient antennas need sizes comparable to the wavelength',
            'Low frequencies are illegal',
            'High frequencies carry more power',
          ],
          correctIndex: 1,
          explanation: 'At kilohertz frequencies, wavelengths are kilometres long \u2014 impractical antennas. High carriers shrink the antenna to a manageable size.',
        },
        {
          id: 'comm-mod-q2',
          question: 'FM resists amplitude noise better than AM because\u2026',
          options: [
            'FM uses more power',
            'The information is in frequency, not amplitude',
            'FM signals travel shorter distances',
            'FM filters out the message',
          ],
          correctIndex: 1,
          explanation: 'Amplitude noise does not change the carrier\u2019s instantaneous frequency, so the FM demodulator ignores most of it.',
        },
        {
          id: 'comm-mod-q3',
          question: 'SNR improves from 10 dB to 30 dB. Communication reliability will\u2026',
          options: ['Worsen', 'Stay similar', 'Improve markedly', 'Drop to zero'],
          correctIndex: 2,
          explanation: '+20 dB means 100\u00D7 more signal power relative to noise \u2014 far fewer errors and higher possible data rates.',
        },
      ],
    },
    {
      id: 'comm-digital-link',
      moduleId: 'communications',
      title: 'Digital Links, Noise & Reliability',
      difficulty: 'hard',
      minutes: 11,
      summary:
        'Bits through a noisy channel: why errors happen, how protocols catch them, and what engineers trade off to deliver data reliably.',
      sections: [
        {
          heading: 'Anatomy of a digital link',
          body: [
            'A digital transmitter takes data, adds structure (framing, error-detection codes), modulates bits onto the carrier, and radiates it. The receiver does the mirror image: amplify, demodulate, check errors, deliver clean data. Between the two, the channel adds attenuation (signal weakens with distance) and noise (random energy from thermal sources, interference, other users).',
            'Attenuation is predictable and fixed by physics \u2014 free-space loss grows with distance and frequency. Noise is random. Their ratio, SNR, decides how many distinct amplitude/phase states the receiver can reliably distinguish, which is why poor coverage drops your phone from 256-QAM to QPSK and finally to "no service".',
          ],
        },
        {
          heading: 'Detecting and correcting errors',
          body: [
            'Errors are inevitable, so digital systems expect them. A checksum or CRC appended to each frame detects corruption: the receiver recomputes it and discards/requests retransmission on mismatch. Forward error correction (FEC) goes further, adding redundancy that lets the receiver repair a limited number of bit errors without asking again \u2014 essential for deep-space probes and live video, where a retransmit round-trip is impractical.',
            'These protections cost bandwidth or power: every parity bit, CRC byte or FEC symbol is overhead. Network design is the art of choosing just enough redundancy so the delivered error rate meets the application\u2019s needs \u2014 a chat message and a pacemaker telemetry link have very different budgets.',
          ],
        },
        {
          heading: 'Why some links fail',
          body: [
            'Real deployments fail for engineering reasons you can reason about: link budget (transmit power + antenna gains \u2212 losses \u2212 required SNR) closing or not; interference from other transmitters in the same band; multipath, where reflections arrive late and scramble high-rate symbols; and obstruction \u2014 2.4 GHz Wi-Fi sails through drywall but 60 GHz barely crosses a wall.',
            'When a link misbehaves, engineers debug in this order: check power and antennas (link budget), check spectrum (interference), check SNR and error counters, then check protocol behaviour. The Innovation Studio network simulator follows exactly this logic with adjustable signal strength and noise.',
          ],
        },
      ],
      terms: [
        { term: 'Link budget', definition: 'Power accounting from transmitter to receiver; must leave enough SNR margin.' },
        { term: 'Attenuation', definition: 'Signal power loss over distance/cables, quoted in dB.' },
        { term: 'CRC', definition: 'Cyclic Redundancy Check \u2014 a computed code that detects corrupted frames.' },
        { term: 'FEC', definition: 'Forward Error Correction \u2014 redundancy that lets the receiver fix errors without retransmission.' },
        { term: 'Multipath', definition: 'Reflections arriving at different times, distorting high-speed symbols.' },
        { term: 'Bit Error Rate (BER)', definition: 'Fraction of received bits that are wrong \u2014 the basic quality metric of a digital link.' },
      ],
      takeaways: [
        'Channels attenuate and add noise; SNR decides how many symbols are distinguishable.',
        'CRC detects corrupted frames; FEC corrects them without a retransmit.',
        'All reliability features cost bandwidth or power \u2014 design to the need.',
        'Debug links in order: power \u2192 interference \u2192 SNR/errors \u2192 protocol.',
      ],
      application: {
        title: 'Wi-Fi speed dropping in a far room',
        body: 'Two rooms away, your Wi-Fi drops from 866 Mb/s to 65 Mb/s or less. The router and phone have negotiated down the modulation (256-QAM \u2192 QPSK) because the received SNR fell: more distance means more free-space loss. Lower-order modulations are far more noise-tolerant. The fix follows the link budget: closer access point, better antenna placement, or a mesh node \u2014 not "more megabits" at the router.',
      },
      diagram: 'digital-link',
      diagramCaption:
        'A digital link: data \u2192 framing/CRC \u2192 modulator \u2192 noisy channel \u2192 demodulator \u2192 error check \u2192 data out.',
      quiz: [
        {
          id: 'comm-dl-q1',
          question: 'A CRC allows a receiver to\u2026',
          options: [
            'Increase transmit power',
            'Detect that a frame was corrupted',
            'Remove noise from the channel',
            'Compress the data',
          ],
          correctIndex: 1,
          explanation: 'A CRC is an error-detecting code: recompute and compare; mismatch means discard or retransmit.',
        },
        {
          id: 'comm-dl-q2',
          question: 'As received SNR falls, a modern radio typically\u2026',
          options: [
            'Switches to a more robust, lower-rate modulation',
            'Raises the carrier frequency',
            'Removes its error correction',
            'Stops transmitting entirely',
          ],
          correctIndex: 0,
          explanation: 'Adaptive modulation trades speed for robustness \u2014 fewer constellation points survive low SNR.',
        },
        {
          id: 'comm-dl-q3',
          question: 'Which duty belongs to forward error correction (FEC)?',
          options: [
            'Amplifying the received signal',
            'Correcting bit errors without retransmission',
            'Filtering out interference',
            'Choosing the carrier frequency',
          ],
          correctIndex: 1,
          explanation: 'FEC adds redundant structure so the receiver can repair limited errors on its own \u2014 vital when round-trips are costly.',
        },
      ],
    },
  ],
}
