import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  constructor(private http: HttpClient, private router: Router) { }

  login(credentials) {
    console.log(credentials);
    this.http.post('http://localhost:8080/authenticate', credentials)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
 //         this.alertService.show('Vous êtes connecté(e)');
          this.router.navigate(['/mylist']);
        },
        err => console.log(err));
  }

  
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
//    this.alertService.show('Vous êtes déconnecté(e)')
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
}
