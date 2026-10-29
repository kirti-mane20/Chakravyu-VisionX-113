import type { LearningModule } from '../types'

export const signalsModule: LearningModule = {
  id: 'signals',
  title: 'Signal Processing',
  tagline: 'Waves, samples and spectra \u2014 the maths that turns raw signals into information.',
  description:
    'Signals as sums of sine waves, the sampling theorem that links analog and digital worlds, and filters that keep what matters and remove what does not.',
  icon: 'AudioWaveform',
  lessons: [
    {
      id: 'signals-sampling',
      moduleId: 'signals',
      title: 'Signals, Sampling & Aliasing',
      difficulty: 'medium',
      minutes: 10,
      summary:
        'How a continuous wave becomes numbers \u2014 and the one theorem you must respect so the numbers still mean the same wave.',
      sections: [
        {
          heading: 'Signals and their spectrum',
          body: [
            'A signal is a quantity varying over time \u2014 a microphone voltage, a radio wave, a heart-rate trace. Joseph Fourier\u2019s great insight: any periodic signal, however complicated, is a sum of sine waves of different frequencies, amplitudes and phases. Instead of plotting amplitude against time, plot it against frequency and you get the spectrum.',
            'The spectrum view is powerful because many operations are easier to understand there. A "bass boost" is raising the amplitude of low-frequency components; a radio filter selects one station\u2019s band; noise often spreads across frequencies you can simply cut. Time and frequency are two views of the same information.',
          ],
        },
        {
          heading: 'Sampling \u2014 the bridge to digital',
          body: [
            'To store or process a signal digitally we measure it at regular intervals \u2014 sampling \u2014 and store each measurement as a number (quantisation). The sampling theorem (Nyquist\u2013Shannon) sets the rule: sample at more than twice the highest frequency present. For audio up to 20 kHz, CD quality samples at 44.1 kHz.',
            'Violate the rule and high frequencies disguise themselves as low ones \u2014 aliasing \u2014 permanently corrupting the data. The classic demo: in a video, a spinning wheel appears to slow or reverse because the camera samples frames slower than the spokes rotate. The fix is always the same: filter out frequencies above half the sample rate before sampling (an anti-aliasing filter).',
            'Quantisation adds its own small error: a 10-bit ADC has 1024 steps, so \u00B1half a step of uncertainty. More bits = finer steps = lower quantisation noise, but slower and costlier converters \u2014 another engineering trade-off.',
          ],
        },
        {
          heading: 'Sampling in your projects',
          body: [
            'When you analogRead() a sensor in loop() with delay(100), you are sampling at 10 Hz. That is fine for room temperature (which changes in seconds) but hopeless for audio or vibration. Choose the sample rate from the physics of the signal, then budget processor time to keep up \u2014 missed samples are a form of distortion no filter can repair afterwards.',
          ],
        },
      ],
      terms: [
        { term: 'Spectrum', definition: 'Signal content viewed by frequency instead of time \u2014 which sine waves are present and how strong.' },
        { term: 'Fourier theorem', definition: 'Any periodic signal is a sum of sine waves of different frequency, amplitude and phase.' },
        { term: 'Sampling rate', definition: 'How many measurements per second, in Hz (samples/s).' },
        { term: 'Nyquist rate', definition: 'Minimum sample rate: more than twice the highest frequency in the signal.' },
        { term: 'Aliasing', definition: 'High frequencies masquerading as low ones when sampled too slowly \u2014 irreversible distortion.' },
        { term: 'Quantisation', definition: 'Rounding each sample to the nearest digital level; source of quantisation noise.' },
      ],
      takeaways: [
        'Every signal has two views: time and frequency.',
        'Sample faster than twice the highest frequency \u2014 or data is corrupted.',
        'Anti-aliasing filters must act before sampling.',
        'More ADC bits = finer resolution, at a cost in speed and price.',
      ],
      application: {
        title: 'Why phone calls sample at 8 kHz',
        body: 'Telephone speech is band-limited to 3.4 kHz because intelligibility lives below that. Nyquist demands > 6.8 kHz, so 8 kHz sampling was chosen \u2014 enough for clear voice, cheap enough for the whole phone network for a century. Music wants 20 kHz, hence CD\u2019s 44.1 kHz. The sample rate on the box always encodes the Nyquist maths of the application.',
      },
      diagram: 'sine-sampling',
      diagramCaption:
        'Sampling a sine wave (dots). Sample slowly enough and the reconstructed signal (staircase) no longer matches \u2014 aliasing.',
      quiz: [
        {
          id: 'signals-samp-q1',
          question: 'A signal contains frequencies up to 4 kHz. The minimum sampling rate to capture it faithfully is\u2026',
          options: ['4 kHz', 'Just above 8 kHz', '16 kHz exactly', '2 kHz'],
          correctIndex: 1,
          explanation: 'Nyquist: sample > 2\u00D7 the highest frequency = > 8 kHz for a 4 kHz signal.',
        },
        {
          id: 'signals-samp-q2',
          question: 'A car wheel in a video appears to spin backwards. This is\u2026',
          options: [
            'A camera defect',
            'Aliasing \u2014 frames sample the rotation too slowly',
            'Wheel imbalance',
            'Motion blur',
          ],
          correctIndex: 1,
          explanation: 'The frame rate undersamples spoke rotation, so the wheel\u2019s apparent frequency aliases to a slower/reversed value.',
        },
        {
          id: 'signals-samp-q3',
          question: 'What does an anti-aliasing filter do and where does it act?',
          options: [
            'Removes noise after digitisation',
            'Removes frequencies above half the sample rate, before sampling',
            'Boosts high frequencies before sampling',
            'Smooths quantisation error in software',
          ],
          correctIndex: 1,
          explanation: 'It must act on the analog signal before the ADC, cutting everything above the Nyquist frequency so nothing aliases.',
        },
      ],
    },
    {
      id: 'signals-filters',
      moduleId: 'signals',
      title: 'Filters & Shaping Signals',
      difficulty: 'hard',
      minutes: 11,
      summary:
        'Filters pass some frequencies and block others. Meet the four classic types and the RC circuit behind them.',
      sections: [
        {
          heading: 'The four filter families',
          body: [
            'A low-pass filter passes frequencies below its cutoff and attenuates those above \u2014 smoothing, removing hiss, anti-aliasing. A high-pass filter is the opposite: it blocks DC and slow drift, letting through fast changes \u2014 removing hum from an audio line or extracting a heartbeat from a drifting baseline.',
            'Band-pass filters pass only a chosen band \u2014 the radio tuner selecting one station, an ECG amplifier isolating the QRS frequencies. Band-stop (notch) filters remove one narrow band while passing everything else \u2014 killing 50/60 Hz mains hum that contaminates nearly every measurement taken near power lines.',
          ],
        },
        {
          heading: 'The simplest real filter: RC',
          body: [
            'One resistor and one capacitor make a first-order low-pass filter. The cutoff is f_c = 1/(2\u03C0RC). With R = 1 k\u03A9 and C = 1 \u00B5F, f_c \u2248 159 Hz: below 159 Hz signals pass nearly untouched; above, each octave is attenuated more (about \u22126 dB per octave for this simplest form). Swap R and C\u2019s positions in the divider and the same parts make a high-pass.',
            'The physics is intuitive: the capacitor resists voltage changes. Fast (high-frequency) wiggles get shunted through the capacitor and lost; slow ones charge it gently and appear at the output. That is also why a big capacitor across a supply is a low-pass for noise \u2014 and why decoupling caps sit next to every chip.',
          ],
        },
        {
          heading: 'Analog and digital filters work together',
          body: [
            'Real systems combine both: an analog anti-aliasing filter protects the ADC, then software applies digital filters \u2014 FIR/IIR, moving averages, median filters \u2014 with perfect repeatability and no component tolerance. On an Arduino, a 10-sample moving average is often all the "filtering" a hobby sensor needs, and costs almost nothing in code.',
            'Design thinking: identify in the spectrum what you must keep and what you must kill, choose the filter type, then choose the cutoff between them \u2014 as far from what you keep as possible. The Innovation Studio projects apply this mindset to noisy sensor streams.',
          ],
        },
      ],
      terms: [
        { term: 'Cutoff frequency (f_c)', definition: 'The half-power boundary of a filter. For RC: f_c = 1/(2\u03C0RC).' },
        { term: 'Low-pass', definition: 'Passes low frequencies, attenuates high ones \u2014 smoothing/anti-alias.' },
        { term: 'High-pass', definition: 'Passes high frequencies, blocks DC and slow drift.' },
        { term: 'Band-pass', definition: 'Passes only a chosen frequency band \u2014 radio tuners, ECG leads.' },
        { term: 'Notch filter', definition: 'Removes one narrow band \u2014 e.g. 50/60 Hz mains hum.' },
        { term: 'Roll-off', definition: 'How steeply a filter attenuates beyond cutoff, e.g. \u22126 dB/octave per RC stage.' },
      ],
      takeaways: [
        'Four families: low-pass, high-pass, band-pass, notch.',
        'One RC pair = one filter; f_c = 1/(2\u03C0RC).',
        'Capacitors shunt fast wiggles \u2014 that intuition explains half of analog design.',
        'Analog filter first (anti-alias), digital filter after \u2014 they complement.',
      ],
      application: {
        title: 'Decoupling capacitors on every chip',
        body: 'Every IC on a PCB has a 100 nF capacitor from its supply pin to ground. It is a low-pass filter for the power line: the chip\u2019s fast current pulses are absorbed locally, and high-frequency supply noise is shunted away. Billions of these one-cent filters keep fast digital chips from talking to each other through their shared power rail.',
      },
      diagram: 'filter-response',
      diagramCaption:
        'Frequency response of a low-pass filter: gain stays flat below the cutoff f_c, then rolls off.',
      quiz: [
        {
          id: 'signals-filt-q1',
          question: 'R = 1 k\u03A9, C = 1 \u00B5F. The RC cutoff is closest to\u2026',
          options: ['16 Hz', '159 Hz', '1590 Hz', '15.9 kHz'],
          correctIndex: 1,
          explanation: 'f_c = 1/(2\u03C0RC) = 1/(2\u03C0 \u00D7 1000 \u00D7 0.000001) \u2248 159 Hz.',
        },
        {
          id: 'signals-filt-q2',
          question: 'Your sensor reading drifts slowly but is corrupted by fast noise. You want to keep the slow signal. Use a\u2026',
          options: ['High-pass filter', 'Low-pass filter', 'Notch filter', 'No filter'],
          correctIndex: 1,
          explanation: 'Keep slow (low frequency) signal, kill fast (high frequency) noise \u2192 low-pass \u2014 or a moving average in software.',
        },
        {
          id: 'signals-filt-q3',
          question: 'Which filter removes 50 Hz mains hum from a wide-band measurement?',
          options: ['Low-pass', 'High-pass', '50 Hz notch', 'Band-pass at 50 Hz'],
          correctIndex: 2,
          explanation: 'A notch filter removes only that narrow band, leaving the rest of the signal intact.',
        },
      ],
    },
  ],
}
