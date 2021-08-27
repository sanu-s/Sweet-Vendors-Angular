import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OwnerService {


    constructor(private http: HttpClient) {}

     create(data=null){
         return this.http.post<any>(`${environment.apiUrl}owner/account`,data)
      }

      view(data=null){
         return this.http.get<any>(`${environment.apiUrl}owner/account?id=${data}`)
      }

     list(page = 1){
        return this.http.get<any>(`${environment.apiUrl}owner/list?page=${page}`)
     }

}