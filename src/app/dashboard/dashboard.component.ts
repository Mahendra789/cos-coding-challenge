import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { CosService } from '../services/cos.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private _subscription: Subscription;

  carDetailsList: any;
  email: any;
  timer: any;
  isLoading: boolean = false;

  constructor(
    private _router: Router,
    private _cosService: CosService

  ) {
    this.email = window.localStorage.getItem('email');

    const source = interval(10000);
    this._subscription = source.subscribe(res => {
      this.getAuctions();
    });


  }

  ngOnInit(): void {
    this.getAuctions();
  }

  logout(): void {
    window.localStorage.clear();
    this._router.navigate(['/login']);
  }

  getAuctions(): void {
    this.isLoading = true;
    this._subscription = this._cosService.getAuctions().subscribe(res => {
      this.carDetailsList = res;
      this.isLoading = false;
    }, err=>{
      this.isLoading = false;
    });
  }

  getFormattedDate(date: any) {
    return moment(date).format('HH:mm:ss');
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
