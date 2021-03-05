import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


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
getAllViewingSeries(){
  this.http
  .get(this.API_URL+'/viewingserie/superman%40world.com')
  //ajouter un mapping qui viendra renseigner la donnée type avec valeur movie via constructeur (pipe / map)
  //aplatir les objets d'objet (title = movieDto.title)
  .subscribe((response:any) => {
    console.log(response)
    this.medias$.next(response)
  })
}

}
