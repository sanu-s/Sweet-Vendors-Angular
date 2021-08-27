import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        const isLoggedIn = user && user.access_token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        const isrefresh = request.url.endsWith('/refresh')
        if (isLoggedIn && isApiUrl) {
            if(!isrefresh) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${user.access_token}` }
            });
        } else {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${user.refresh_token}` }
            });
        }
        }

        return next.handle(request);
    }
}