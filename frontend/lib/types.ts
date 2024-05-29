import { Dispatch } from "react";

export type MicrophoneProps = {
  onTranscription?: (transcription: string) => void;
};

export type ClickProps = {
  handleClick: (input: string) => void;
};

export type ChatsProps = {
  messages: any;
  setMessages: Dispatch<any>;
};

export type ChatInputProps = {
  messages: any;
};
