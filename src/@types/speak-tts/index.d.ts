declare module 'speak-tts' {
  export default class {
    constructor();
    init(): void;
    setVoice(voice: any): void;
    setLanguage(lang: any): void;
    speak(data: any): void;
  }
}

