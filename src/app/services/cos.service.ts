import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CosService {
  baseUrl: string = 'https://api-core-dev.caronsale.de/api';
  currentUser:any;
  private userDetails = new Subject<any>();

  constructor(private http: HttpClient) {
  }


  setUserDetails(user: any) {
    this.currentUser = user;
    this.userDetails.next(user);
  }
  getUserDetails(): Observable<any> {
    return this.userDetails.asObservable();
  }


  isUserRegistered(creds: any): Observable<any> {
    const body = {
      "password": creds.password,
      "meta": creds.email
    }
    return this.http.put(
      `${this.baseUrl}/v1/authentication/${creds.email}`, body);
  }

  getAuctions(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'authtoken': this.currentUser?.token,
        'userid': this.currentUser?.userId
      })
    }
    return this.http.get(
      `${this.baseUrl}/v2/auction/buyer/?filter=null&count=false`, httpOptions);
  }

}
