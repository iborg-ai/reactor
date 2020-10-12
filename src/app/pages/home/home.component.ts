import { Component, OnInit } from "@angular/core";
import { BridgeService } from "src/app/services/bridge.service";
declare let Chart: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public charts = [];

  constructor(private bridge: BridgeService) {}

  ngOnInit(): void {
    this.bridge.eeg.subscribe((eeg: any) => {
      if (eeg && eeg.rawEeg) {
        if (this.charts.length === 0) {
          this.createNewChart(1);
          this.createNewChart(2);
        } else {
          for (let chart of this.charts) {
            chart.data.labels.push("");
            chart.data.datasets[0].data.push(eeg.rawEeg);
            if (chart.data.datasets[0].data.length > 25) {
              chart.data.datasets[0].data.shift();
              chart.data.labels.shift();
            }
            chart.update(0);
          }
        }
      }
    });
  }

  createNewChart(index: number) {
    const ctx = (<HTMLCanvasElement>(
      document.getElementById(`chart-${index}`)
    )).getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Ch1",
            data: [],
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: -1500,
                max: 1500,
                beginAtZero: false,
                stepSize: 20,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 0.1,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
    this.charts.push(chart);
  }
}
