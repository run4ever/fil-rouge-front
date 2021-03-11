import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private URL_API_BASE = environment.apis.API_BACK_BASE
  private URL_API_URL  = environment.apis.API_BACK_URL
  user$ =new BehaviorSubject({lastname:'',firstname:'',birhdayDate:'',email:'',role:''})

  constructor(private http: HttpClient, private router: Router, private alertService:AlertService) { }

  login(credentials) {
    this.http.post(this.URL_API_BASE+'/authenticate', credentials)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          this.getUserInfos(credentials.username)
          this.router.navigate(['/mylist']);
        },
        err =>{console.log(err)
          this.alertService.show('Email or password is incorrect !!!'); }
        );
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  isLogged(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  //méthode pour décrypter le jeton JWT
  getDecodeJWT():any{
    let jetonJWT = localStorage.getItem('token')  
    let decodeJWT = jwt_decode(jetonJWT)
    return decodeJWT
  }

  getUserInfos(userEmail:string):any {
    this.http.get(this.URL_API_URL+'/appuser/'+userEmail)
    .subscribe(
              (response:any)=> this.user$.next(response)
    )
  }

}
