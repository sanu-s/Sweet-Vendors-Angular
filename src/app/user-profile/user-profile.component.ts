
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';

import { UserService } from '../_services/user.service';

import { NotificationsComponent } from "../notifications/notifications.component"
import { DomSanitizer} from '@angular/platform-browser';

import { places } from '../_models/places'
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    pwdForm: FormGroup;
    profileForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    success = '';
    imageUrl:any;
    auth;
    state_dist = places
    profile; 
    notification


    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private cd: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) { 
        // redirect to home if already logged in
        this.notification = new NotificationsComponent
        
    } 

    ngOnInit() {

        this.pwdForm = this.formBuilder.group({
            oldpassword:['', Validators.required],
            password1: ['', Validators.required],
            password2: ['', Validators.required]
        });


        this.profileForm = this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', Validators.required],
          company: ['', Validators.required],
          website: ['', Validators.required],
          address: ['', Validators.required],
          country: ['India'],
          state: ['', Validators.required],
          district: ['', Validators.required],
          city: ['', Validators.required],
          postalcode: ['', Validators.required],
          aadhar: ['', Validators.required],
        });

        this.userService.profile().subscribe(x=>{
            this.profile = Object.assign({}, x);
            delete x.admin_type
            delete x.icon
            this.profileForm.setValue(x)
            let objectURL = 'data:image/jpeg;base64,' + this.profile.icon;
            this.imageUrl = this.profile.icon ? this.sanitizer.bypassSecurityTrustStyle(`url(${objectURL})`): this.sanitizer.bypassSecurityTrustStyle(`url(assets/img/user.png)`);
        })

    }

    // convenience getter for easy access to form fields
    get f() { return this.pwdForm.controls; }

    get g() { return this.profileForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.pwdForm.invalid) {
            return;
        }
        this.loading = true;
        this.userService.changepwd(this.f.oldpassword.value, this.f.password1.value, this.f.password2.value).subscribe(x=>{
          this.success = x.detail
          // this.closeBtn.nativeElement.click()
          this.pwdForm.reset()
          this.submitted = false
          this.notification.showNotification('top','right','success', this.success)


        },error=>{
          this.pwdForm.reset()
          this.submitted = false
          Object.keys(this.pwdForm.controls).forEach(key => {
            this.pwdForm.controls[key].setErrors(null)
          });
          this.error = error
          this.notification.showNotification('top','right','danger', this.error)
        })
      
    }

    onProfileSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.profileForm.invalid) {
            return;
        }
        this.loading = true;
        this.userService.profile('PUT',this.profileForm.value).subscribe(x=>{
          this.notification.showNotification('top','right','success', 'Successfully updated')
          this.profile = Object.assign({}, x);
        },error=>{
          this.error = error
          this.notification.showNotification('top','right','danger', this.error)
        })
       
    }

    @ViewChild('fileInput') el: ElementRef;
    // editFile: boolean = true;
    // removeUpload: boolean = false;
  
    uploadFile(event) {
      let reader = new FileReader(); // HTML5 FileReader API
      let file = event.target.files[0];
      const formData: FormData = new FormData();
      formData.append('file', file);
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);
  
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.userService.pic(formData).subscribe(x=>{
            this.notification.showNotification('top','right','success', 'Image upload success')
            let objectURL = 'data:image/jpeg;base64,' + x.detail;
            this.imageUrl = x.detail ? this.sanitizer.bypassSecurityTrustStyle(`url(${objectURL})`): 'assets/img/user.png';
          }, error => {
            this.notification.showNotification('top','right','danger', error)
          })
        }
        // ChangeDetectorRef since file is loading outside the zone
        this.cd.markForCheck();        
      }
    }
  
    // // Function to remove uploaded file
    // removeUploadedFile() {
    //   let newFileList = Array.from(this.el.nativeElement.files);
    //   this.imageUrl = '';
    //   this.editFile = true;
    //   this.removeUpload = false;
    //   this.uploadForm.patchValue({
    //     file: [null]
    //   });
    // }
    
    // Submit Registration Form
    // onuploadSubmit() {
    //   this.submitted = true;
    //   if(!this.uploadForm.valid) {
    //     alert('Please fill all the required fields to create a super hero!')
    //     return false;
    //   } else {
    //     console.log(this.uploadForm.value)
    //   }
    // }
}