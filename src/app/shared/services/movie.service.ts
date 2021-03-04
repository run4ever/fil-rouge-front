import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private API_URL = environment.apis.API_BACK_URL;
  
  movies$ = new BehaviorSubject([]);

  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }

  /*Load movies from backend*/
    getAllMovies(){
      this.http
      .get(this.API_URL+'/movie/list')
      .subscribe((response:any) => {
        console.log(response)
        this.movies$.next(response)
    })
}
}
