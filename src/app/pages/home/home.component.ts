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
          this.createNewChart(1, eeg.rawEeg.length);
          this.createNewChart(2, eeg.rawEeg.length);
        } else {
          for (let chart of this.charts) {
            chart.data.labels.push("");
            eeg.rawEeg.forEach((e, i) => {
              chart.data.datasets[i].data.push(e);
            });
            if (chart.data.datasets[0].data.length > 25) {
              eeg.rawEeg.forEach((e, i) => {
                chart.data.datasets[i].data.shift();
              });
              chart.data.labels.shift();
            }
            chart.update(0);
          }
        }
      }
    });
  }

  createNewChart(index: number, channels) {
    const ctx = (<HTMLCanvasElement>(
      document.getElementById(`chart-${index}`)
    )).getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: JSON.parse(JSON.stringify(new Array(channels))).map(
          (_, i) => {
            return {
              label: `Ch${i + 1}`,
              data: [],
              backgroundColor: "rgba(0, 0, 0, 0.0)",
              // borderColor: 'rgba(0, 0, 0, 0.5)',
              borderWidth: 1,
              pointRadius: 0,
            };
          }
        ),
      },
      options: {
        plugins: {
          colorschemes: {
            scheme: "brewer.Paired12",
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                // min: -4500,
                // max: 4500,
                // beginAtZero: true,
                // stepSize: 10,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                // beginAtZero: true,
                // stepSize: 0.1,
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
