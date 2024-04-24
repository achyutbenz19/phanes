import ReconnectingWebSocket from "reconnecting-websocket";
import { create } from "zustand";

export type SocketStore = {
  socket: null | ReconnectingWebSocket;
  setSocket: (socket: ReconnectingWebSocket) => void;
};

export const useSocket = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket: ReconnectingWebSocket) => set({ socket: socket }),
}));
