import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Fil-rouge-front';
  private userFirstname: string;

  constructor(public userService: UserService) {

  }

  ngOnInit() {
    this.userService.user$.subscribe(
      (data: any) => { this.userFirstname = data.firstname }
    )
    if (this.userService.user$.getValue().firstname === '') {
      if (this.userService.isLogged()) {
        let token = this.userService.getDecodeJWT()
        this.userService.getUserInfos(token.sub);
      }
    }
  }

  logoutAction() {
    this.userService.logout()
  }

}
