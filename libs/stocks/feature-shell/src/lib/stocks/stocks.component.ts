import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {PriceQueryResponse} from "../../../../data-access-price-query/src/lib/+state/price-query.type";


@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() data$: Observable<PriceQueryResponse[]>;
  private chartData: PriceQueryResponse[];
  private subscription: Subscription;

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

    this.subscription = this.data$.subscribe(newData => (this.chartData = newData));
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
