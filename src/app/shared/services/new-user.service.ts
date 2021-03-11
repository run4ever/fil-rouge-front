import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class NewUserService {
  private API_URL = environment.apis.API_BACK_URL;
  newUser$ = new  BehaviorSubject<UserModel>({ firstname: '', lastname: '', birthdayDate: '', email: '',password:'' , role:''});

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  /**
   * Get user from database
   * 
   * endpoint backend : [GET] /appuser/'+userEmail
   * @param email
   */
  getUser(userEmail:string) {
    this.http.get(this.API_URL+'/appuser/'+userEmail)
      .subscribe((response: any) => {
        this.newUser$.next(response);
      });
  }

  /**
   * Create contact to api
   * 
   * endpoint backend : [POST] /contacts
   * @param contactObj 
   */
  postUser(UserObj: UserModel) {
    console.log('entree avec ', UserObj);
    UserObj.role = 'ROLE_USER';
    this.http.post(this.API_URL+'/appuser/add', UserObj).subscribe((responseApi: any) => {
      console.log(responseApi);
      if (responseApi.email == UserObj.email) {
        this.router.navigate(['/login'], { queryParams: { email: UserObj.email, created: 1 } });
      }
    });
  }
  
}