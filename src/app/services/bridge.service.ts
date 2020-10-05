import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class BridgeService {
  private socket;
  private data = new BehaviorSubject<{ rawEeg: number[] }>(null);

  constructor() {}

  connect() {
    this.socket = io("ws://127.0.0.1:8080");
    this.socket.on("data", (data) => {
      this.data.next(data);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  get eeg() {
    return this.data.asObservable();
  }
}
