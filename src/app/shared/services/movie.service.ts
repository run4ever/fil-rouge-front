import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Movie } from '../models/movie.model';
import {map} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private API_BACK_URL = environment.API_BACK_URL
 
  movie$ = new BehaviorSubject([])
  viewingMovies$ = new BehaviorSubject([])

  constructor(private http: HttpClient) {
   
   }

   //sans besoin toker JWT pour accéder à API
   getAllMovie() {
     this.http
              .get(this.API_BACK_URL+'/movie/list')
              .subscribe((response:any) => {
                  console.log(response)
                  this.movie$.next(response)
              })
   }

   //récupérer la liste des visionnage qui a besoin un token JWT
   getViewingMovie() {

    
  

      this.http
              .get(this.API_BACK_URL+'/viewingserie/superman%40world.com')
              .subscribe(                
                (response:any)=>{
                  this.viewingMovies$.next(response)
                  console.log(response)
                }
                 )
   }
}
