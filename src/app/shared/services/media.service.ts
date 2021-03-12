import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { MediaModel } from '../models/media.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private API_URL = environment.apis.API_BACK_URL;

  medias$ = new BehaviorSubject([]);
  series$ = new BehaviorSubject([]);
  seriesAfterDelete$ = new BehaviorSubject([]);
  moviesAfterDelete$ = new BehaviorSubject([]);
  movies$ = new BehaviorSubject([]);
  search$ = new BehaviorSubject<MediaModel[]>([]);

  // gestion selectedIndex pour gérer le retour de detail vers mylist
  indexTab$ = new BehaviorSubject({choixIndex:0})    //par défaut on affiche Série (tab)
  seachInProgress$ = new BehaviorSubject({value:false});

  constructor(private http:HttpClient, private sanitizer: DomSanitizer, private alertService: AlertService) { }

  /*Load movies from backend*/

// méthode pour les viewingserie, mettre le type valeur 'serie'
getAllViewingSeries(userEmail:string){
  this.http
  .get(this.API_URL+'/viewing-serie/'+userEmail)
  // ajouter un mapping qui viendra renseigner la donnée type avec valeur movie via constructeur (pipe / map)
  .pipe(
    map(// serie
        (data:any)=> data.map(
         s => new MediaModel('serie',s.status,s.serieDto.imdbId,s.serieDto.title,s.serieDto.description,s.serieDto.category,
                             s.serieDto.startYear,s.serieDto.imdbRating,s.serieDto.imdbVotes,s.serieDto.actors,
                             s.serieDto.imageUrl,0,s.serieDto.endYear,s.serieDto.numberOfSeason,s.currentSeason,s.serieDto.statusSerie, null, s.likeOrNot)
        )
    )
  )
  .subscribe((response:any) => {
    //this.medias$.next(response)
    this.series$.next(response);
  });
}

//méthode pour les viewingmovie, mettre le type valeur 'movie'
getAllViewingMovies(userEmail:string){
    this.http
    .get(this.API_URL+'/viewing-movie/'+userEmail)
    .pipe(
      map(// movie
          (data:any)=> data.map(
          m => new MediaModel('movie',m.status,m.movieDto.imdbId,m.movieDto.title,m.movieDto.description,m.movieDto.category,
                              (m.movieDto.startYear).substring(0,4),m.movieDto.imdbRating,m.movieDto.imdbVotes,m.movieDto.actors,
                              m.movieDto.imageUrl,m.movieDto.runtime,null,null,null,null, null, m.likeOrNot)

          )
      )
    )
    .subscribe((response:any) => {
      // console.log(response)
      // let series = this.medias$.getValue() //récupérer les résultats Seris
      // this.medias$.next([...series, ...response]) //ajoute les series dans media$ avec les movies
      this.movies$.next(response);
      });

  }

// méthode globale retourne une liste globale qui contient ViewingSerie et ViewingMovie
getAllViewings(userEmail:string) {
  this.getAllViewingSeries(userEmail)
  this.getAllViewingMovies(userEmail)
  }

  updateViewing(userEmail:string, typeMedia:string, imdbId:string, status:string, likeOrNot:string, currentSeason:number){
    let httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    let corpsBody;
    let like: boolean;
    
    switch (likeOrNot) {
      case 'true':
        like = true
        break;
      default:
        like = false
        break;
    }

    console.log(userEmail)
    console.log(typeMedia)
    console.log(imdbId)
    console.log(status)
    console.log(likeOrNot)
    console.log(currentSeason)

    switch (typeMedia) {
      case 'serie':
        corpsBody = {"email":userEmail,
                        "imdbId":imdbId,
                        "status":status,
                        "likeOrNot":likeOrNot,
                        "currentSeason":currentSeason,
                        "currentEpisode":"1"}
        break;
      case 'movie':
        corpsBody = {"email":userEmail,
                        "imdbId":imdbId,
                        "status":status,
                        "likeOrNot":likeOrNot}
        break;
      }

      console.log('corpsBody', corpsBody)

      this.http
      .put(this.API_URL+'/viewing-'+typeMedia+'/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { if(typeMedia==='serie') {
                      const tabMedias:any[] = this.series$.getValue()  //récupérer les valeurs de movies$
                      tabMedias.forEach((item, index) => {
                        //mettre à jour l'élément dans series
                        if (item.imdbId === imdbId) { 
                          item.status=status;
                          item.likeOrNot=like;
                          item.currentSeason=currentSeason;
                        }
                      })
                      this.series$.next(tabMedias);
                }
                else {
                      const tabMedias:any[] = this.movies$.getValue()  //récupérer les valeurs de movies$
                      tabMedias.forEach((item, index) => {
                        //mettre à jour l'élément dans movies$
                        if (item.imdbId === imdbId ) { 
                          item.status=status;
                          item.likeOrNot=like;
                         }
                      })
                  this.movies$.next(tabMedias);
                }
             },
             (error) => {console.log(error)}
      )
  }

// méthode pour mettre à jour status d'un film ou série dans ViewingSerie/ViewingMovie
  updateStatusMediaByEmailAndIdMedia(userEmail:string,imdbId:string,typeMedia:string,status:string) {

    let httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    let corpsBody = {"email":userEmail,"imdbId":imdbId,"status":status}

      this.http
      .put(this.API_URL+'/viewing-'+typeMedia+'/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { console.log('Change status terminé')
                if(typeMedia==='serie') {
                      const tabMedias:any[] = this.series$.getValue()  //récupérer les valeurs de movies$
                      tabMedias.forEach((item, index) => {
                        //mettre à jour status dans l'élément dans series
                        if (item.imdbId === imdbId ) { item.status=status }
                      })
                      this.series$.next(tabMedias);
                }
                else {
                      const tabMedias:any[] = this.movies$.getValue()  //récupérer les valeurs de movies$
                      tabMedias.forEach((item, index) => {
                        //mettre à jour status dans l'élément dans movies$
                        if (item.imdbId === imdbId ) { item.status=status }
                      })
                  this.movies$.next(tabMedias);
                }
             },
             (error) => {console.log(error)}
      )
  }

  //méthode pour mettre à jour numéro saison d'une série
  updateSeasonSerieByEmailAndIdMedia(userEmail:string,imdbId:string,status:string,numSeason:number) {
    let httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    let corpsBody = {"email":userEmail,"imdbId":imdbId,"status":status,"currentSeason":numSeason,"currentEpisode":1}
    console.log(corpsBody)
      this.http
      .put(this.API_URL+'/viewing-serie/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { console.log('Change saison pour une série terminé')
                const tabMedias: MediaModel[] = this.series$.getValue()  //récupérer les valeurs de series$
                console.log('tab médias update season ' + tabMedias);
                console.log(tabMedias)
                tabMedias.forEach((item, index) => {
                  //mettre à jour Num saison dans l'élément dans medias$
                  if (item.imdbId === imdbId ) {
                        item.currentSeason=numSeason
                      }
                });
              this.series$.next(tabMedias);
             },
        (error)=> {console.log(error)}
      )

  }

//méthode pour supprimer Serie ou Movie de Viewings
deleteMediaByEmailAndIdMedia(userEmail: string,imdbId: string,typeMedia: string) {
      //normalement pas besoin de passer status, saison et epison pour supprimer serie
      let corpsBody = {"email":userEmail,"imdbId":imdbId}
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body:corpsBody
      }

      this.http.delete(this.API_URL+'/viewing-'+typeMedia+'/delete',httpOptions)
      .subscribe(
        ()=> { console.log('Suppression terminée')
                    if(typeMedia === 'serie') {
                        const tabMedias:any[] = this.series$.getValue()  //récupérer les valeurs de series$
                        console.log('Behavior Subject Series : ' + tabMedias);
                        tabMedias.forEach((item, index) => {
                          //supprimer l'élément dans series$
                          if (item.imdbId === imdbId ) { tabMedias.splice(index, 1); }
                          this.alertService.show('This serie has been deleted from your list');
                        });
                      this.seriesAfterDelete$.next(tabMedias);
                      console.log('tabMedias - Série : ' + tabMedias);
                    }
                    else {
                      const tabMedias:any[] = this.movies$.getValue()  //récupérer les valeurs de movies$
                      console.log('Behavior Subject Movies : ' + tabMedias);
                      tabMedias.forEach((item, index) => {
                        //supprimer l'élément dans movies$
                        if (item.imdbId === imdbId ) { tabMedias.splice(index, 1); }
                        this.alertService.show('This movie has been deleted from your list');
                      });
                      this.moviesAfterDelete$.next(tabMedias);
                      console.log('tabMedias - Movie : ' + tabMedias);
                    }
              },
        (error)=> {console.log(error)}
      )
  }

  getNbResults(searchText:string, mediaType:string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        title: searchText
      }
    });

    return this.http.get<string>(this.API_URL + '/' + mediaType + '/external/search-nb-results', { params }) //.pipe(map(data => {return data;}));

  }

  getSearchResults(userEmail: string, searchText:string, mediaType:string): void {
    const body = {"email": userEmail,
                  "title": searchText,
                  "page": '1'};

    const httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // On fait la requête http.post(url, body)
    this.http.post(this.API_URL + '/viewing-' + mediaType + '/search', JSON.stringify(body), httpOptions)
      .pipe(map(
        (apiResponse: any) =>
          apiResponse.map(movie => this.createMedia(movie, mediaType))
      ))
      .subscribe(response => {
        console.log(response);
        this.search$.next(response);
        this.seachInProgress$.next({value:false})
              },
                (error) => this.seachInProgress$.next({value:false})
               )
  }

  //ajouter serie dans ViewingSerie
  addSerieByEmailAndIdMedia(userEmail: string,imdbId: string,numSeason: number){
    let body = {"email":userEmail,"imdbId":imdbId,"status":'TO_WATCH',"currentSeason":numSeason, "like":'false'}
      const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
      this.http.post(this.API_URL+'/viewing-serie/create',JSON.stringify(body), httpOptions)
                .subscribe( (response:any) => {
                              //si on a réussi ajouté dans la base, alors il faut ajouter aussi la série dans series$
                              //pour ajouter dans series$ on a besoin un objet MediaModel qui nécessite autres données !!!!
                              //le plus simple c'est de rappel API pour avoir la liste
                              this.getAllViewingSeries(userEmail)
                              this.alertService.show('This serie has been added to your list with status \"To watch\"');
                            },
                            (error)=> {console.log(error)}
                          )
  }

   //ajouter movie dans ViewingMovie
   addMovieByEmailAndIdMedia(userEmail: string,imdbId: string){
    let body = {"email":userEmail,"imdbId":imdbId,"status":'TO_WATCH', "like":'false'}
      const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
      this.http.post(this.API_URL+'/viewing-movie/create',JSON.stringify(body), httpOptions)
              .subscribe((response:any) => {
                    //this.movies$.next(response)
                    this.getAllViewingMovies(userEmail)
                    this.alertService.show('This movie has been added to your list with status \"To watch\"');
                   },
                   (error)=> {console.log(error)}
                   )
    }

    //recupérer données d'une video sur API
    getVideoDataFromApi(imdbId: string, mediaType: string){
      return this.http.get(this.API_URL + '/' + mediaType + '/external/show?externalId=' + imdbId);
    }

  /**
   * Instanciate movie
   * @param movie:any
   * @returns MovieModel
   */
  createMedia(item: any, type:string): MediaModel {

    if (type == 'movie') {

      return new MediaModel(
        'movie',
        item.status,
        item.movieDto.imdbId,
        item.movieDto.title,
        item.movieDto.description,
        item.movieDto.category,
        item.movieDto.startYear,
        item.movieDto.imdbRating,
        item.movieDto.imdbVotes,
        item.movieDto.actors,
        item.movieDto.imageUrl,
        item.movieDto.runtime,
        null,
        null,
        null,
        null,
        item.alreadyInUserList,
        item.likeOrNot
      )

    } else {

      return new MediaModel(
        'serie',
        item.status,
        item.serieDto.imdbId,
        item.serieDto.title,
        item.serieDto.description,
        item.serieDto.category,
        item.serieDto.startYear,
        item.serieDto.imdbRating,
        item.serieDto.imdbVotes,
        item.serieDto.actors,
        item.serieDto.imageUrl,
        item.serieDto.runtime,
        null,
        Number(item.serieDto.numberOfSeason),
        Number(item.currentSeason),
        null,
        item.alreadyInUserList,
        item.likeOrNot
      )
    }
  }

  // méthode pour mettre à jour status d'un film ou série dans ViewingSerie/ViewingMovie
  updateLikeMediaByEmailAndIdMedia(userEmail:string,imdbId:string,typeMedia:string,like:boolean) {

    let httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    let corpsBody = {"email":userEmail,"imdbId":imdbId,"likeOrNot":like}

      this.http
      .put(this.API_URL+'/viewing-'+typeMedia+'/update',JSON.stringify(corpsBody),httpOptions)
      .subscribe(
        ()=> { if(typeMedia==='serie') {
                      const tabMedias:any[] = this.series$.getValue()  //récupérer les valeurs de movies$
                      tabMedias.forEach((item, index) => {
                        //mettre à jour dans l'élément dans series
                        if (item.imdbId === imdbId ) { item.likeOrNot=like }
                      })
                      this.series$.next(tabMedias);
                }
                else {
                      const tabMedias:any[] = this.movies$.getValue()  //récupérer les valeurs de movies$
                      tabMedias.forEach((item, index) => {
                        //mettre à jour status dans l'élément dans movies$
                        if (item.imdbId === imdbId ) { item.likeOrNot=like }
                      })
                  this.movies$.next(tabMedias);
                }
             },
             (error) => {console.log(error)}
      )
  }
}
