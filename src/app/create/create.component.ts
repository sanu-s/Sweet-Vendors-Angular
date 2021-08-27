import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { OwnerService } from '../_services/owner.service';

import { NotificationsComponent } from '../notifications/notifications.component'

import { places } from '../_models/places'


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  adminForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  auth;
  state_dist = places
  valid
  user
  notification = new NotificationsComponent
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @Input('owner') 
  set owner(value) {
    this.user = value
    if(value) {
      this.adminForm = this.formBuilder.group({
        // name: ['', Validators.required],
        // email: ['', [Validators.required, Validators.email]],
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
    this.adminForm.setValue(value)
    this.adminForm.disable()
    } else {
      this.adminForm = this.formBuilder.group({
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
    }
  }
  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ownerService: OwnerService
  ) {}

  ngOnInit() {




  }

  // convenience getter for easy access to form fields
  get f() { return this.adminForm.controls; }

  onAdminSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.adminForm.invalid) {
      console.log(this.adminForm.invalid)
      return;
    }

    this.loading = true;
    let value = this.adminForm.value
    value.state = this.adminForm.controls.state.value.state
    
    this.ownerService.create(value).subscribe(x => {
      this.notification.showNotification('top', 'right', 'success', "Owner successfully created")
      this.onCreate.emit(x);
      this.closeBtn.nativeElement.click();
    }, error => {
      this.error = error
      this.notification.showNotification('top', 'right', 'danger', this.error)
    })
  }
}