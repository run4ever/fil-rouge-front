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
  //exemple avec movies, mais remplacer par viewingMovie dans un service "media.service.ts"
    getAllMovies(){
      this.http
      .get(this.API_URL+'/movie/list')
      //ajouter un mapping qui viendra renseigner la donnée type avec valeur movie via constructeur
      .subscribe((response:any) => {
        console.log(response)
        this.medias$.next(response)
    })
}

//dupliquer cette méthode pour les viewingserie, en mettant le type valeur 'serie'
}
