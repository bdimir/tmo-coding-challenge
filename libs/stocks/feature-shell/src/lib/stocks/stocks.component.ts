import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PriceQueryFacade} from '@coding-challenge/stocks/data-access-price-query';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  todayDate = new Date();

  filterFrom = (d: Date): boolean => {
    const dateTo = this.stockPickerForm.controls.dtpTo.value;
    if (dateTo) {
     return d < dateTo;
    }
    return d < this.todayDate;
  };

  filterTo = (d: Date): boolean => {
    const dateFrom = this.stockPickerForm.controls.dtpFrom.value;
    if (dateFrom) {
      return d >= dateFrom;
    }
    return d <= this.todayDate;
  };

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    {viewValue: 'All available data', value: 'max'},
    {viewValue: 'Five years', value: '5y'},
    {viewValue: 'Two years', value: '2y'},
    {viewValue: 'One year', value: '1y'},
    {viewValue: 'Year-to-date', value: 'ytd'},
    {viewValue: 'Six months', value: '6m'},
    {viewValue: 'Three months', value: '3m'},
    {viewValue: 'One month', value: '1m'},
    {viewValue: 'Date range', value: 'range'}
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      dtpFrom: [this.todayDate, Validators.required],
      dtpTo: [this.todayDate, Validators.required]
    });
  }

  ngOnInit() {
    this.stockPickerForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.fetchQuote();
    });
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const {symbol, period} = this.stockPickerForm.value;
      if(period == 'range') {
        const {dtpFrom, dtpTo} = this.stockPickerForm.value;
        this.priceQuery.fetchQuoteInRange(symbol, dtpFrom, dtpTo);
      } else {

        this.priceQuery.fetchQuote(symbol, period);
      }
    }
  }
}
