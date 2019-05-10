import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PriceQueryResponse} from "../../../../../../stocks/data-access-price-query/src/lib/+state/price-query.type";

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<PriceQueryResponse[]>;
  private chartData: PriceQueryResponse[];

  private chart: {
    title: string;
    type: string;
    data: [];
    columnNames: string[];
    options: {};
  };

  constructor() {
  }

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: {title: `Stock price`, width: '600', height: '400'}
    };

    this.data$.subscribe(newData => (this.chartData = newData));
  }
}
