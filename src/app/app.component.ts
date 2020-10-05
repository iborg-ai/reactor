import { Component } from "@angular/core";
import { BridgeService } from "src/app/services/bridge.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  title = "reactor";
  constructor(private bridge: BridgeService) {
    this.bridge.connect();
  }
}
