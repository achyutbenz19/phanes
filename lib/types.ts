import { Server as SocketIoServer } from "socket.io";
import { Server as NextServer, Socket } from "net";
import { NextApiResponse } from "next";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NextServer & {
      io: SocketIoServer;
    };
  };
};

export type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

type SocketData = {
  thought: string;
  html: string;
};

export type PartialSocketData = Partial<SocketData>;
