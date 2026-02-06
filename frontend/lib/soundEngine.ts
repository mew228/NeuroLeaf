export class SoundEngine {
    private ctx: AudioContext | null = null;
    private oscnodes: OscillatorNode[] = [];
    private gainNode: GainNode | null = null;
    private noiseNode: AudioBufferSourceNode | null = null;
    private isPlaying: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.gainNode = this.ctx.createGain();
                this.gainNode.connect(this.ctx.destination);
            }
        }
    }

    // Simple noise generators
    private playNoise(type: 'white' | 'pink' | 'brown') {
        if (!this.ctx || !this.gainNode) return;
        this.stop();

        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168981;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11;
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5;
            }
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filter for smoother sound
        const filter = this.ctx.createBiquadFilter();
        if (type === 'brown') {
            filter.type = 'lowpass';
            filter.frequency.value = 400;
        } else {
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
        }

        noise.connect(filter);
        filter.connect(this.gainNode);
        noise.start();
        this.noiseNode = noise;
        this.isPlaying = true;
    }

    playBinaural(baseFreq: number = 200, beatFreq: number = 5) {
        if (!this.ctx || !this.gainNode) return;
        this.stop();

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const pan1 = this.ctx.createStereoPanner();
        const pan2 = this.ctx.createStereoPanner();

        osc1.type = 'sine';
        osc2.type = 'sine';

        osc1.frequency.value = baseFreq;
        osc2.frequency.value = baseFreq + beatFreq;

        pan1.pan.value = -1; // Left
        pan2.pan.value = 1;  // Right

        osc1.connect(pan1);
        pan1.connect(this.gainNode);

        osc2.connect(pan2);
        pan2.connect(this.gainNode);

        osc1.start();
        osc2.start();

        this.oscnodes = [osc1, osc2];
        this.isPlaying = true;
    }

    setVolume(val: number) {
        if (this.gainNode) {
            this.gainNode.gain.setTargetAtTime(val, this.ctx?.currentTime || 0, 0.1);
        }
    }

    play(type: string) {
        if (this.ctx?.state === 'suspended') {
            this.ctx.resume();
        }

        switch (type) {
            case 'rain':
                this.playNoise('pink');
                break;
            case 'wind':
                this.playNoise('brown');
                break;
            case 'forest':
                // Mix of brown and low white - simplified to white for now but filtered
                this.playNoise('white'); // Filter will make it sound likedistant leaves
                break;
            case 'night':
                this.playBinaural(150, 4); // Theta waves
                break;
        }
    }

    stop() {
        this.oscnodes.forEach(o => o.stop());
        this.oscnodes = [];
        if (this.noiseNode) {
            this.noiseNode.stop();
            this.noiseNode = null;
        }
        this.isPlaying = false;
    }
}

export const soundEngine = new SoundEngine();
