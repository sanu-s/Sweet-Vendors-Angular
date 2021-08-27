import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { NotificationsComponent } from "../notifications/notifications.component"

@Component({ templateUrl: 'login.component.html', styleUrls: ['./login.component.css'] })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    fpwd = false;
    success = ''
    notification = new NotificationsComponent

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.userValue) { 
            this.router.navigate(['']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        if(this.fpwd) {
            this.authenticationService.resetPassword(this.f.username.value).subscribe(x=>{
                this.success = x.detail
                this.notification.showNotification('top','right','success', this.success)
                this.fpwd = !this.fpwd
            },error=>{
                this.error = error;
                this.notification.showNotification('top','right','danger', this.error)
            })
        } else {
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate([this.returnUrl]);
                },
                error: error => {
                    this.error = error;
                    this.notification.showNotification('top','right','danger', this.error)
                    this.loading = false;
                }
            });
    }

}
}