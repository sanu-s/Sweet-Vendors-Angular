import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {


    constructor(private http: HttpClient) {}
    info(){
       return this.http.get<any>(`${environment.apiUrl}user/detail`)
    }

    changepwd(passwordold, password1, password2){
        return this.http.put<any>(`${environment.apiUrl}profile/change-passsword`, {passwordold, password1, password2})
     }

     profile(type="GET", data=null){
      return this.http.request<any>(type,`${environment.apiUrl}profile/detail`,{body:data})
     }
     pic(data=null){
         return this.http.post<any>(`${environment.apiUrl}profile/picture`,data)
      }

    activate(key, password1, password2){
      return this.http.put<any>(`${environment.apiUrl}user/activate`, {key, password1, password2})
   }
      

}