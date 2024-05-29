export type MicrophoneProps = {
  onTranscription?: (transcription: string) => void;
};

export type ClickProps = {
  handleClick: (input: string) => void;
};
