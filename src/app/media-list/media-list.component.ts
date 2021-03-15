import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaModel } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { PageEvent } from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {
  debounceTime, distinctUntilChanged
} from 'rxjs/operators';

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

  searchWithDelay$ = new Subject<string>();
  searchString: string;

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

    this.mediaService.moviesAfterDelete$.subscribe(
      (dataMovies: MediaModel[]) => {
        this.movies = dataMovies.slice();
        this.countItemMovies = this.movies.length;
        // changement de la page courante si plus d'enregistrements, avec gestion de la liste vide
        if (this.countItemMovies > 0) {
          if ((this.page - 1) * this.pageSize >= this.countItemMovies) {
            this.page --;
            this.beginRange = (this.page - 1) * this.pageSize;
            this.endRange = this.beginRange + this.pageSize;
          }
        }
        this.calculPaginationMovies();
      }

    );

    this.mediaService.seriesAfterDelete$.subscribe(
      (dataSeries: MediaModel[]) => {
        this.series = dataSeries.slice();
        this.countItemSeries = this.series.length;
        // changement de la page courante si plus d'enregistrements, avec gestion de la liste vide
        if (this.countItemSeries > 0) {
          if ((this.page - 1) * this.pageSize >= this.countItemSeries) {
            this.page --;
            this.beginRange = (this.page - 1) * this.pageSize;
            this.endRange = this.beginRange + this.pageSize;
          }
        }
        this.calculPaginationSeries();
      }
    );

    this.mediaService.series$.subscribe(
      (dataSeries: MediaModel[]) => {
        this.series = dataSeries.slice();
        this.countItemSeries = this.series.length;
        this.calculPaginationSeries();
      });
     this.mediaService.getAllViewingSeries(this.userEmail);


    this.mediaService.movies$.subscribe(
      (dataMovies: MediaModel[]) => {
        this.movies = dataMovies.slice();
        this.countItemMovies = this.movies.length;
        this.calculPaginationMovies();
      }
    );
    this.mediaService.getAllViewingMovies(this.userEmail)  //récupérer les movies

    //gestion selectdIndex pour passage detail vers mylist
    this.mediaService.indexTab$.subscribe(
                      (data:any) =>
                          {
                            this.selectedIndex = data.choixIndex
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

    this.searchWithDelay$.pipe(
      debounceTime(800),
      //distinctUntilChanged(),
    ).subscribe( (value: string) => {
      if (this.searchString.length < 3) {
        this.nbResults = -1;
      } else {
        this.mediaService.getNbResults(this.searchString, this.activeTabLabel).subscribe(
          data => {
            this.nbResults = data;
          });
        this.mediaService.getSearchResults(this.userEmail, this.searchString, this.activeTabLabel);
      }
    });
  }

  updateMedia(media: MediaModel, updType: string, value: string) {
    let like: string;
    let season:number;
    let status:string;
    switch (updType) {
      case 'status':
        status = value;
        like = media.love;
        season = media.currentSeason;
        break;
      case 'like':
        status = media.status;
        if(value=='true'){like="false";}else{like="true";}
        season = media.currentSeason;
        break;
      case 'season':
        status = media.status;
        like = media.love;
        season = Number(value);
        break;
        }
      this.mediaService.updateViewing(this.userEmail, media.typeMedia, media.imdbId, status, like, season);
    }

  // méthode pour supprimer Serie ou Movie de Viewings
  deleteMedia(imdbId: string, typeMedia: string, inputElt) {
    this.mediaService.deleteMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia);
  }

  //méthode pour ajouter Serie ou Movie dans Viewings
  addMedia(imdbId: string, typeMedia: string, inputElt,numSeason: number) {
    //changement : appel addSerieByEmailAndIdMedia ou addMovieByEmailAndIdMedia
    //this.mediaService.addMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia);
    if(typeMedia === 'serie') {
      this.mediaService.addSerieByEmailAndIdMedia(this.userEmail,imdbId,numSeason)
    }
    if (typeMedia === 'movie') {
      this.mediaService.addMovieByEmailAndIdMedia(this.userEmail,imdbId)
    }
    this.deleteSearchText(inputElt);
  }

  // search user text in Api and in his movie / serie list
  // tslint:disable-next-line:typedef
 searchApiAndUserList(activeTab: number, searchText: string) {

   this.searchString = searchText;
   this.mediaService.search$.next([]);
   if (searchText.trim().length < 3) {
       this.mediaService.search$.next([]);
       this.nbResults = -1;
      }
  else {
     this.mediaService.seachInProgress$.next({value: true});
     switch (activeTab) {
       case 1:
         this.activeTabLabel = 'movie';
         break;

       default:
         this.activeTabLabel = 'serie';
         break;
     }
     this.searchWithDelay$.next(searchText);
   }
 }

    
/**
   * Delete search text on userClickEvent
   * @param inputElt
   */
  deleteSearchText(inputElt) {
    inputElt.value = '';
    this.mediaService.search$.next([]);
    this.nbResults = -1;
  }

  onPageMoviesChanged(pageEvent: any) {
   this.isLoading = true;
   this.mediaService.getAllViewingMovies(this.userEmail);
  }

  onPageSeriesChanged(pageEvent: any) {
    this.isLoading = true;
    this.mediaService.getAllViewingSeries(this.userEmail);
  }
  //gestion de pagination
  onPageChanged(pageEvent: any, selectedIndex: number) {

    this.page = pageEvent;
    this.beginRange = (this.page - 1) * this.pageSize;
    this.endRange = this.beginRange + this.pageSize;
    if (selectedIndex === 0) {
      this.onPageSeriesChanged(pageEvent);
    }
    if (selectedIndex === 1) {
      this.onPageMoviesChanged(pageEvent);
    }
  }

  calculPaginationSeries() {
    this.series.splice(0, this.beginRange);
    let countAfterSplice = this.series.length;
    let nbToDelete = countAfterSplice - this.pageSize;
    if (nbToDelete > 0) {
      this.series.splice(this.pageSize, nbToDelete);
    }
    else {
      this.series.splice(this.pageSize, countAfterSplice);
    }
  }

  calculPaginationMovies() {
    this.movies.splice(0, this.beginRange);
    let countAfterSplice = this.movies.length;
    let nbToDelete = countAfterSplice - this.pageSize;
    if (nbToDelete > 0) {
      this.movies.splice(this.pageSize, nbToDelete);
    } else {
      this.movies.splice(this.pageSize, countAfterSplice);
    }
  }

  boolToStr(b:boolean){
    switch (b) {
      case true:
        return "true";
        break;
      default:
        return "false";
        break;
    }
  }

}
