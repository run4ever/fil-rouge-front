import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class NewUserService {
  private API_URL = environment.apis.API_BACK_URL;
  newUsers$ = new BehaviorSubject<UserModel[]>([]);
  newUser$ = new  BehaviorSubject<UserModel>({ firstname: '', lastname: '', birthdayDate: '', email: '',password:'' });

  constructor(private http: HttpClient, private router: Router) { }


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
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('token') })
    this.http.post(this.API_URL+'/appuser/add', UserObj).subscribe((responseApi: any) => {
      console.log(responseApi);
      if (responseApi.email) {
        // Ajouter le contact dans contacts$
        this.newUsers$.next([...this.newUsers$.getValue(), responseApi]);
        // Message et navigation vers la page /contacts
        // this.alertService.show('contact ajouté');
        this.router.navigate(['/appuser/add']);
      }
    });
  }
  
}