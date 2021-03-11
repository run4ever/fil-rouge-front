import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaModel } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  //pagination
  pageEvent: PageEvent;
  page: number;
  countItemSeries: number = 100;
  countItemMovies: number = 100;
  beginRange: number;
  endRange: number;
  pageSize: number = 6;

  //gestion selectedIndex pour gérer le retour de detail vers mylist
  selectedIndex:number
  results:MediaModel[];
  movies:MediaModel[];
  series:MediaModel[];
  medialist:MediaModel[]
  isLoading:boolean
  userEmail:string  //email à récupérer dans le jeton JWT
  activeTabLabel:string
  nbResults:number
  isLoadingResults: boolean;


  //liste status
  status_media = [['TO_WATCH', 'To watch'], ['IN_PROGRESS', 'In progress'], ['WATCHED', 'Watched']]


  constructor(private mediaService: MediaService, private routeur: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.page = 1;
    //this.isLoadingResults = false;
    let jetonDecode = this.userService.getDecodeJWT()

    //userEmail est stocké dans le champ sub de jeton
    this.userEmail = jetonDecode.sub

    this.mediaService.series$.subscribe(
      (dataSeries: MediaModel[]) => {
                                      this.series = dataSeries;
                                      this.countItemSeries = this.series.length;
                                      this.series.splice(0, this.beginRange);
                                      let countAfterSplice = this.series.length;
                                      let nbToDelete = countAfterSplice - this.pageSize;
                                      if (nbToDelete > 0) {
                                        this.series.splice(this.pageSize, nbToDelete);
                                        console.log('nb éléments supprimés : ' + nbToDelete);
                                      }
                                      // // else {
                                      // //   this.series.splice(this.pageSize, countAfterSplice);
                                      // // }
                                      // console.log(this.series);
                                      // }
      });

    this.mediaService.getAllViewingSeries(this.userEmail)  //récupérer les séries

    this.mediaService.movies$.subscribe(
      (dataMovies: MediaModel[]) => {
                                      this.movies = dataMovies;
                                      this.countItemMovies = this.movies.length;
                                      this.movies.splice(0, this.beginRange);
                                      let countAfterSplice = this.movies.length;
                                      let nbToDelete = countAfterSplice - this.pageSize;
                                      if (nbToDelete > 0) {
                                        this.movies.splice(this.pageSize, nbToDelete);
                                        console.log('nb éléments supprimés : ' + nbToDelete);
                                      } else {
                                        this.movies.splice(this.pageSize, countAfterSplice);
                                      }
                                      console.log(this.movies);
                                    }
    );
    this.mediaService.getAllViewingMovies(this.userEmail)  //récupérer les movies
    /*
    this.mediaService.getAllViewings(this.userEmail) //cette méthode retourne ViewingSerie/ViewingMovie dans medias$
    this.mediaService.medias$.subscribe((data: MediaModel[]) => {
      this.medialist = data;
      this.isLoading = false;
      console.log(this.medialist);
      this.movies = this.medialist.filter(movie => movie.typeMedia==='movie');
      this.series = this.medialist.filter(movie => movie.typeMedia==='serie');
    });
    */
    //gestion selectdIndex pour passage detail vers mylist
    this.mediaService.indexTab$.subscribe(
                      (data:any) =>
                          {
                            this.selectedIndex = data.choixIndex
                            console.log("selectedIndex=>"+this.selectedIndex)
                          }
    )
    //on vide d'abord search$
    this.mediaService.search$.next([])
    // on s'abonne à la source de données search$
    this.mediaService.search$.subscribe(data => this.results = data)

    this.mediaService.seachInProgress$.subscribe(
      (data:any) => {
        this.isLoadingResults = data.value
      }
    )

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
  deleteMedia(imdbId: string, typeMedia: string, inputElt) {
    this.mediaService.deleteMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia);
  //  this.deleteSearchText(inputElt);
  }

  //méthode pour ajouter Serie ou Movie dans Viewings
  addMedia(imdbId: string, typeMedia: string, inputElt,numSeason: number) {
    //changement : appel addSerieByEmailAndIdMedia ou addMovieByEmailAndIdMedia
    //this.mediaService.addMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia);
    if(typeMedia === 'serie') {
      this.mediaService.addSerieByEmailAndIdMedia(this.userEmail,imdbId,numSeason)
    }
    if(typeMedia === 'movie') {
      this.mediaService.addMovieByEmailAndIdMedia(this.userEmail,imdbId)
    }
    this.deleteSearchText(inputElt);
  }

  /*
  loadNextMedia() {
    this.isLoading = true;
   // this.mediaService.g();
  }
  */

  // search user text in Api and in his movie / serie list
 searchApiAndUserList(activeTab: number, searchText: string) {
  this.mediaService.search$.next([]);
  if (searchText.trim().length < 3) {
    this.mediaService.search$.next([]);
  }
  else {
    //this.isLoadingResults = true;
    this.mediaService.seachInProgress$.next({value:true})

    console.log('entree search: ', this.isLoadingResults);
    switch (activeTab) {
      case 1:
        this.activeTabLabel = 'movie';
        break;

      default:
        this.activeTabLabel = 'serie';
        break;
    }
    this.mediaService.getNbResults(searchText, this.activeTabLabel).subscribe(data => {this.nbResults = data;});
    this.mediaService.getSearchResults(this.userEmail, searchText, this.activeTabLabel);

    console.log('sortie search: ', this.isLoadingResults);

  }
}

/**
   * Delete search text on userClickEvent
   * @param inputElt
   */
  deleteSearchText(inputElt) {
    console.log('input', inputElt);
    inputElt.value = '';
    this.mediaService.search$.next([]);
    this.page = 1;
    this.nbResults = -1;
  }

  onPageMoviesChanged(pageEvent: any) {

   console.log('page event movies', pageEvent);
   this.isLoading = true;
   this.mediaService.getAllViewingMovies(this.userEmail);

  }

  onPageSeriesChanged(pageEvent: any) {

    console.log('page event Series', pageEvent);
    this.isLoading = true;
    this.mediaService.getAllViewingSeries(this.userEmail);


  }

  onPageChanged(pageEvent: any, selectedIndex: number) {

    this.page = pageEvent;
    this.beginRange = (this.page - 1) * this.pageSize;
    this.endRange = this.beginRange + this.pageSize;
    console.log('debut de range ' + this.beginRange);
    console.log('fin de range ' + this.endRange);
    if (selectedIndex === 0) {
      this.onPageSeriesChanged(pageEvent);
    }
    if (selectedIndex === 1) {
      this.onPageMoviesChanged(pageEvent);
    }
  }
}
