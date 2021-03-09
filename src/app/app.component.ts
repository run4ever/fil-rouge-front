import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Fil-rouge-front';
  private userFirstname:string

  constructor(public userService:UserService) {
   
  }

  ngOnInit() {
    this.userService.user$.subscribe(
      (data:any)=> {this.userFirstname=data.firstname}
    )
  }

  logoutAction() {
    this.userService.logout()
  }

}
