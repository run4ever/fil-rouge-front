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

}
