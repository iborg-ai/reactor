import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class BridgeService {
  private socket;
  private coreSocket: WebSocket;
  private data = new BehaviorSubject<{ rawEeg: number[] }>(null);
  private coreData = new BehaviorSubject<{ rawEeg: number[] }>(null);

  constructor() {}

  connect() {
    this.socket = io("ws://127.0.0.1:8080");
    this.socket.on("data", (data) => {
      this.data.next(data);
    });

    this.coreSocket = new WebSocket(
      "wss://iborg.ai:9443?type=web&token=" + new Date().getTime()
    );
    this.coreSocket.onmessage = (message) => {
      this.coreData.next(JSON.parse(message.data));
    };
  }

  disconnect() {
    this.socket.disconnect();
    this.coreSocket.close();
  }

  get eeg() {
    return this.data.asObservable();
  }

  get averageEeg() {
    return this.coreData.asObservable();
  }
}
