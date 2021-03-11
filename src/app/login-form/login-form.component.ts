import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  sub
  email
  created
 
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.email = params['email'] || '';
        this.created = params['created'] || '';
      });
  }

  onLoginSubmit(loginForm) {
    console.log(loginForm.value);
    this.userService.login(loginForm.value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
