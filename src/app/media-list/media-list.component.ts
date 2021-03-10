import { Component, OnInit } from '@angular/core';
import { MediaModel } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import { UserService } from '../shared/services/user.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  //pagination
  pageEvent: PageEvent;
  page:number;
  // datasource: null;
  pageIndex:number = 0;
  pageSize:number = 1;
  // length:number= 100;
  // pageSizeOptions= [5, 10, 25, 100];
  // pageNo:number =0;
  // postPerPage:number = 50;
  // pageNumber:number;


  

  movies:MediaModel[];
  series:MediaModel[];
  medialist:MediaModel[]
  isLoading:boolean
  userEmail:string  //email à récupérer dans le jeton JWT

  //liste status
  status_media = [['TO_WATCH', 'A regader'], ['IN_PROGRESS', 'En cours'], ['WATCHED', 'Vu']]

  constructor(private mediaService: MediaService, private routeur: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;
    let jetonDecode = this.userService.getDecodeJWT();
    this.page = 1;

    //userEmail est stocké dans le champ sub de jeton
    this.userEmail = jetonDecode.sub
    this.mediaService.getAllViewings(this.userEmail) //cette méthode retourne ViewingSerie/ViewingMovie dans medias$

    this.mediaService.medias$.subscribe((data: MediaModel[]) => {
      this.medialist = data;
      this.isLoading = false;
      console.log(this.medialist);
      this.movies = this.medialist.filter(movie => movie.typeMedia==='movie');
      this.series = this.medialist.filter(movie => movie.typeMedia==='serie');
    });

  }

  searchSeries(searchText: string) {
    console.log(searchText);
    if (searchText.trim().length < 3) {
      this.mediaService.search$.next([]);
    }
    else {
      this.mediaService.getAllViewingSeries(searchText);
    }
  }

  //méthode pour MAJ status de Serie ou Movie, la requete d'accès à API est dans media.service
  updateStatusMedia(imdbId: string, typeMedia: string, status: string) {
    //appel le service pour mettre à jour status de film ou serie
    //console.log("imdbId="+imdbId+";typeMedia:"+typeMedia+";status:"+status)
    this.mediaService.updateStatusMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia, status)
  }

  //méthode update la saison d'une série
  updateSeason(imdbId: string, status: string, numSeason: number) {
    // console.log("imdbId="+imdbId+";status:"+status+"; nouveau num saison"+numSeason)
    this.mediaService.updateSeasonSerieByEmailAndIdMedia(this.userEmail, imdbId, status, numSeason)
  }
  //méthode pour supprimer Serie ou Movie de Viewings
  deleteMedia(imdbId: string, typeMedia: string) {
    this.mediaService.deleteMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia)
  }

  loadNextMedia() {
    this.isLoading = true;
    this.mediaService.getAllSeries();

  }

  loadLastMedia(){

  }


 // search user text in Api and in his movie / serie list
 searchApiAndUserList(activeTab:number, searchText: string) {
   
 }

/**
   * Delete search text on userClickEvent
   * @param inputElt 
   */
  deleteSearchText(inputElt) {
    inputElt.value = '';
    this.mediaService.search$.next([]);
  }

  


onPageChanged(pageEvent: any) {

 this.page = pageEvent;
 console.log("page event", pageEvent);
 this.isLoading = true;
 this.mediaService.getAllViewingMovie(this.userEmail);

 
}
}
