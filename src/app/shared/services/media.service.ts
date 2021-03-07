import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
         s => new MediaModel('serie',s.status,s.serieDto.imdbId,s.serieDto.title,s.serieDto.description,s.serieDto.category,
                             s.serieDto.startYear,s.serieDto.imdbRating,s.serieDto.imdbVotes,s.serieDto.actors,
                             s.serieDto.imageUrl,0,s.serieDto.endYear,s.serieDto.numberOfSeason,s.currentSeason,s.serieDto.statusSerie)
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
                             (m.movieDto.startYear).substring(0,4),m.movieDto.imdbRating,m.movieDto.imdbVotes,m.movieDto.actors,
                             m.movieDto.imageUrl,m.movieDto.runtime,null,null,null,null)
        )
    )
  )
  .subscribe((response:any) => {
    console.log(response)
    let series = this.medias$.getValue() //récupérer les résultats Seris 
    this.medias$.next([...series, ...response]) //ajoute les series dans media$ avec les movies
  })
}

//méthode globale retourne une liste globale qui contient ViewingSerie et ViewingMovie
getAllViewings(userEmail:string) {
  this.getAllViewingSeries(userEmail)
  this.getAllViewingMovie(userEmail)
  }

//méthode pour mettre à jour status d'un film ou série dans ViewingSerie/ViewingMovie
  updateStatusMediaByEmailAndIdMedia(userEmail:string,imdbId:string,typeMedia:string,status:string) {

    let httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    //si dans email on a %40 alors update ne passe, il faut remplacer %40 par @
    let userEmailTrt = userEmail.replace('%40','@')
    let corpsBody = {"email":userEmailTrt,"imdbId":imdbId,"status":status}
    console.log(corpsBody)
    if(typeMedia === "serie") {
      this.http
      .put(this.API_URL+'/viewing-serie/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { console.log('Change status serie terminé')},
        (error)=> {console.log(error)}
      )
    }
    else {
      this.http
      .put(this.API_URL+'/viewing-movie/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { console.log('Change status movie terminé')},
        (error)=> {console.log(error)}
      )
    }
    
  }

  //méthode pour mettre à jour numéro saison d'une série
  updateSeasonSerieByEmailAndIdMedia(userEmail:string,imdbId:string,status:string,numSeason:number) {
    let httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    //si dans email on a %40 alors update ne passe, il faut remplacer %40 par @
    let userEmailTrt = userEmail.replace('%40','@')
    let corpsBody = {"email":userEmailTrt,"imdbId":imdbId,"status":status,"currentSeason":numSeason,"currentEpisode":1}
    console.log(corpsBody)
      this.http
      .put(this.API_URL+'/viewing-serie/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { console.log('Change saison pour une série terminé')},
        (error)=> {console.log(error)}
      )
   
  }

//méthode pour supprimer Serie ou Movie de Viewings
deleteMediaByEmailAndIdMedia(userEmail: string,imdbId: string,typeMedia: string) {
      //si dans email on a %40 alors update ne passe, il faut remplacer %40 par @
      let userEmailTrt = userEmail.replace('%40','@')
      console.log("Email:"+userEmailTrt+" imbdId:"+imdbId+" typeMedia:"+typeMedia)

      let deleteOK = 'KO'   //variable pour savori si la suppression est OK ou pas

      //normalement pas besoin de passer status, saison et epison pour supprimer serie
      let corpsBody = {"email":userEmailTrt,"imdbId":imdbId}
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), 
        body:corpsBody
      }

    if(typeMedia === "serie") {
      this.http.delete(this.API_URL+'/viewing-serie/delete',httpOptions)
      .subscribe(
        ()=> { console.log('Suppression série terminée')
              //si la suppression est OK dans la base de données et on doit supprimer l'élément medias$
              //**** code dupliqué !!!!!!!! */
                //if(deleteOK=='OK') 
                const tabMedias:any[] = this.medias$.getValue()  //récupérer les valeurs de medias$
                tabMedias.forEach((item, index) => {
                  //supprimer l'élément dans medias$
                  if (item.imdbId === imdbId ) { tabMedias.splice(index, 1); }
                  this.medias$.next(tabMedias)
                })
              },
        (error)=> {console.log(error)}
      )
    }
    else {
      this.http.delete(this.API_URL+'/viewing-movie/delete',httpOptions)
      .subscribe(
        ()=> { console.log('Suppression movie terminée')
              //si la suppression est OK dans la base de données et on doit supprimer l'élément medias$
              //**** code dupliqué !!!!!!!! */
                //if(deleteOK=='OK') 
                  const tabMedias:any[] = this.medias$.getValue()  //récupérer les valeurs de medias$
                  tabMedias.forEach((item, index) => {
                    //supprimer l'élément dans medias$
                    if (item.imdbId === imdbId ) { tabMedias.splice(index, 1); }
                    this.medias$.next(tabMedias)
                  })
              },
        (error)=> {console.log(error)}
      )
    }
   /* =>> ça passe pas si je mets ici la suppresison dans medias$
    //si la suppression est OK dans la base de données et on doit supprimer l'élément medias$
    if(deleteOK=='OK') {
      const tabMedias:any[] = this.medias$.getValue()  //récupérer les valeurs de medias$
      tabMedias.forEach((item, index) => {
        //supprimer l'élément dans medias$
        if (item.imdbId === imdbId ) { tabMedias.splice(index, 1); }
        this.medias$.next(tabMedias)
      })
    }
    */
    
}

}
