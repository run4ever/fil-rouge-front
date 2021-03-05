import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

 
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onLoginSubmit(loginForm) {
    console.log(loginForm.value);
    this.userService.login(loginForm.value);
  }

  // setForm(loginForm) {
  //   console.log(loginForm.form.controls);
  //   loginForm.form.controls.identifier.setValue('fred')
  //   loginForm.form.controls.password.setValue('Fred2021')
  // }


}
