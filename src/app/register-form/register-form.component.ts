import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../shared/services/alert.service';
import { NewUserService } from '../shared/services/new-user.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  newUserForm: FormGroup
  
  constructor(private fb: FormBuilder, private newUserService: NewUserService, private alertService: AlertService) { }

    ngOnInit(): void {
      this.newUserForm= this.fb.group({
        firstname: ['', Validators.minLength(4)],
        email: ['', Validators.required, Validators.email],
        password: ['', Validators.required, Validators.minLength(8)]
      })
    }
  
   
  onSubmit(form){
    if (form.status === 'VALID') {
      this.newUserService.postUser(form.value);
    }
    else {
       this.alertService.show('Oops... Please verify information');
    }
  }
}
