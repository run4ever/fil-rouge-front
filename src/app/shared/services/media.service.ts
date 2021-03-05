import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { MediaModel } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private API_URL = environment.apis.API_BACK_URL;
  
  medias$ = new BehaviorSubject([]);

  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }

  /*Load movies from backend*/
  //exemple avec movies, mais remplacer par viewingMovie
    getAllMovies(){
      this.http
      .get(this.API_URL+'/movie/list')
      //ajouter un mapping qui viendra renseigner la donnée type avec valeur movie via constructeur
      .subscribe((response:any) => {
        console.log(response)
        this.medias$.next(response)
      })
    }

//méthode pour les viewingserie, mettre le type valeur 'serie'
getAllViewingSeries(userEmail:string){
  this.http
  .get(this.API_URL+'/viewing-serie/'+userEmail)
  //ajouter un mapping qui viendra renseigner la donnée type avec valeur movie via constructeur (pipe / map)
  .pipe(
    map(//serie
        (data:any)=> data.map(
         s => new MediaModel('serie',s.status,
                             s.serieDto.imdbId,s.serieDto.title,s.serieDto.description,s.serieDto.category,
                             s.serieDto.startYear,s.serieDto.imdbRating,s.serieDto.imdbVotes,s.serieDto.actors,
                             s.serieDto.imageUrl,0,s.serieDto.endYear,s.serieDto.numberOfSeason,s.serieDto.statusSerie)
        )
    )
  )
  .subscribe((response:any) => {
    console.log(response)
    this.medias$.next(response)
  })
}

//méthode pour les viewingmovie, mettre le type valeur 'movie'
getAllViewingMovie(userEmail:string){
  this.http
  .get(this.API_URL+'/viewing-movie/'+userEmail)
  .pipe(
    map(//movie
        (data:any)=> data.map(
         m => new MediaModel('movie',m.status,m.movieDto.imdbId,m.movieDto.title,m.movieDto.description,m.movieDto.category,
                             m.movieDto.startYear,m.movieDto.imdbRating,m.movieDto.imdbVotes,m.movieDto.actors,
                             m.movieDto.imageUrl,m.movieDto.runtime,null,null,null)
        )
    )
  )
  .subscribe((response:any) => {
    console.log(response)
    let series = this.medias$.getValue() //récupérer les résultats Seris 
    this.medias$.next([...series, ...response]) //ajoute les series dans media$ avec les movies
  })
}

}
