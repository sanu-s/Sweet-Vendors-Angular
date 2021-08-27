import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';

import { NotificationsComponent } from '../notifications/notifications.component'


@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})
export class ResetPwdComponent implements OnInit {
    pwdForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    success = '';
    auth;
    mode;
    valid
    notification = new NotificationsComponent
    private sub: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService:UserService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.userValue) { 
            this.router.navigate(['']);
        }
    }

    ngOnInit() {
      this.sub = this.route.queryParams.subscribe(params => {
        this.auth = params['auth']; // (+) converts string 'id' to a number
        if(this.router.url.includes('/activate-account?auth')){
          this.mode ="activate"
          this.valid =true
        } else {
          this.authenticationService.chechPasswordvalid(this.auth).subscribe(x=>{
            this.valid = true
          })        
        }

   
        if(!this.auth){
          this.router.navigate(['/login'])
        }
        // In a real app: dispatch action to load the details here.
     });
        this.pwdForm = this.formBuilder.group({
            password1: ['', Validators.required],
            password2: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    }

    // convenience getter for easy access to form fields
    get f() { return this.pwdForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.pwdForm.invalid) {
            return;
        }

        this.loading = true;
        if(this.mode == 'activate') {
        this.userService.activate(this.auth, this.f.password1.value, this.f.password2.value).subscribe(x=>{
          this.success = x.detail
          this.notification.showNotification('top','right','success', this.success)
          this.router.navigate(['/login'])
        },error=>{
          this.error = error
          this.notification.showNotification('top','right','danger', this.error)
        })
      } else {
        this.authenticationService.changePassword(this.auth, this.f.password1.value, this.f.password2.value).subscribe(x=>{
          this.success = x.detail
          this.notification.showNotification('top','right','success', this.success)
          this.router.navigate(['/login'])
        },error=>{
          this.error = error
          this.notification.showNotification('top','right','danger', this.error)
        })
      }
    }
}