import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}user/login`, { email, password })
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.userSubject.next(user);
                // this.startRefreshTokenTimer();
                return user;
            }));
    }

    logout() {
        console.log('hiii')
        this.http.delete<any>(`${environment.apiUrl}user/logout`).subscribe();
        // this.stopRefreshTokenTimer();
        this.userSubject.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('currentUser');
    }

    refreshToken() {
        return this.http.post<any>(`${environment.apiUrl}user/refresh`, {})
            .pipe(map((user) => {
                this.userSubject.next(user);
                // this.startRefreshTokenTimer();
                return user;
            }));
    }

    resetPassword(email){
       return this.http.post<any>(`${environment.apiUrl}user/reset-password`, {email})
    }

    changePassword(key, password1,password2){
        return this.http.put<any>(`${environment.apiUrl}user/reset-password`, {key, password1,password2});
    }

    chechPasswordvalid(key){
        return this.http.get<any>(`${environment.apiUrl}user/reset-password?key=${key}`);
    }
    // helper methods

    // private refreshTokenTimeout;

    // private startRefreshTokenTimer() {
    //     // parse json object from base64 encoded jwt token
    //     const jwtToken = JSON.parse(atob(this.userValue.access_token.split('.')[1]));

    //     // set a timeout to refresh the token a minute before it expires
    //     const expires = new Date(Date.now() + 7*24*60*60*1000)
    //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
    //     this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    // }

    // private stopRefreshTokenTimer() {
    //     clearTimeout(this.refreshTokenTimeout);
    // }
}