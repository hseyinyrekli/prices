import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any;
  stroke: any;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[] | number[];

  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

declare global {
  interface Window {
    Apex: any;
  }
}

const sparkLineData = [
  47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61,
  27, 54, 43, 19, 46,
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isChange = true;
  exchangeData!: any;
  activeExchange = 'USD';
  activeCategories = 'all';
  api!: any;
  baseApi!: any;

  ngOnInit(): void {
    this.getApi();
    this.getExchange();
    setInterval(() => {
      this.updatePercentValues();
      this.bindChartData();
    }, 5000);
  }

  getApi() {
    this.activeExchange = 'USD';
    this.activeCategories = 'all';
    this.http.get<any>('assets/json/api.json').subscribe((data) => {
      this.api = data;
      this.baseApi = data;
      this.bindChartData();
    });
  }
  getExchange() {
    this.http.get<any>('assets/json/exchange.json').subscribe((data) => {
      this.exchangeData = data;
    });
  }

  changeActive(name: any) {
    this.activeExchange = name;
    this.activeCategories = 'all';

    if (name === 'USD') {
      this.getApi();
    } else {
      let exchangeRate = 1;

      for (let i = 0; i < this.api.length; i++) {
        const data = this.api[i];

        const priceName = data.price + ' USDCent';
      }

      if (name === 'CNY') {
        exchangeRate = this.exchangeData.CNY;
        this.changePrices([2, 5], exchangeRate);
      } else if (name === 'INR') {
        exchangeRate = this.exchangeData.INR;
        this.changePrices([3], exchangeRate);
      } else if (name === 'PKR') {
        exchangeRate = this.exchangeData.PKR;
        this.changePrices([7], exchangeRate);
      }
    }
  }

  changePrices(ids: number[], exchangeRate: number) {
    for (let i = 0; i < this.api.length; i++) {
      const data = this.api[i];
      if (ids.includes(data.id)) {
        const priceValue = parseFloat(data.price);
        const newPriceValue = priceValue * exchangeRate;
        data.price = newPriceValue.toFixed(2);
      }
    }
  }
  updatePercentValues() {
    for (let i = 0; i < this.api.length; i++) {
      const data = this.api[i];
      const randomPercent = this.generateRandomPercent();
      data.percent = randomPercent;

      const priceValue = parseFloat(data.price);
      const percentValue = parseFloat(randomPercent);

      const newPriceValue = priceValue + (priceValue * percentValue) / 100;
      data.price = newPriceValue.toFixed(2);
    }
  }

  generateRandomPercent(): string {
    const randomNum = Math.random() * 5;
    const randomPercent = (randomNum > 3 ? '+' : '-') + randomNum.toFixed(2);
    return randomPercent;
  }

  sortData() {
    this.api.sort((a: any, b: any) => {
      const percentA = parseFloat(a.percent);
      const percentB = parseFloat(b.percent);

      if (this.isChange) {
        return percentB - percentA;
      } else {
        return percentA - percentB;
      }
    });
  }
  filter() {
    this.isChange = !this.isChange;
    this.sortData();
  }
  bindChartData() {
    for (let i = 0; i < this.api.length; i++) {
      const data = this.api[i];
      const randomPercent = this.generateRandomPercent();
      data.percent = randomPercent;
      const chartOptions: Partial<ChartOptions> = {
        series: [
          {
            name: `chart-line-sparkline${i + 1}-${data.name.replace(
              /[^a-zA-Z0-9]/g,
              ''
            )}`,
            data: this.randomizeArray(sparkLineData.slice(0, 10)),
          },
        ],
      };
      data.series = chartOptions;
    }
  }
  changeForFilter(name: any) {
    this.activeCategories = name;
    this.activeExchange = 'USD';
    this.api = this.baseApi.filter((x: any) => x.category == name);
  }
  public chartLineSparkline1Options: Partial<ChartOptions>;
  public chartLineSparkline2Options: Partial<ChartOptions>;
  public chartLineSparkline3Options: Partial<ChartOptions>;
  public chartLineSparkline4Options: Partial<ChartOptions>;
  public chartBarSparkline1Options: Partial<ChartOptions>;
  public chartBarSparkline2Options: Partial<ChartOptions>;
  public chartBarSparkline3Options: Partial<ChartOptions>;
  public chartBarSparkline4Options: Partial<ChartOptions>;
  public commonAreaSparlineOptions: Partial<ChartOptions> = {
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'straight',
    },
    fill: {
      opacity: 0.3,
    },
    yaxis: {
      min: 0,
    },
  };
  public commonLineSparklineOptions: Partial<ChartOptions> = {
    chart: {
      type: 'line',
      width: 55,
      height: 30,
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#323330'],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };
  public commonBarSparklineOptions: Partial<ChartOptions> = {
    chart: {
      type: 'bar',
      width: 55,
      height: 30,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  constructor(private http: HttpClient) {
    window.Apex = {
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        fixed: {
          enabled: true,
        },
        fillSeriesColor: true,
        theme: false,
      },

      colors: ['#adf251'],
    };

    this.chartLineSparkline1Options = {
      series: [
        {
          name: 'chart-line-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartLineSparkline2Options = {
      series: [
        {
          name: 'chart-line-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartLineSparkline3Options = {
      series: [
        {
          name: 'chart-line-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartLineSparkline4Options = {
      series: [
        {
          name: 'chart-line-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartBarSparkline1Options = {
      series: [
        {
          name: 'chart-bar-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartBarSparkline2Options = {
      series: [
        {
          name: 'chart-bar-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartBarSparkline3Options = {
      series: [
        {
          name: 'chart-bar-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };

    this.chartBarSparkline4Options = {
      series: [
        {
          name: 'chart-bar-sparkline',
          data: this.randomizeArray(sparkLineData.slice(0, 10)),
        },
      ],
    };
  }

  public randomizeArray(arg: any): number[] {
    var array = arg.slice();
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
