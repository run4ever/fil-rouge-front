import { Component, OnInit } from '@angular/core';
import { MediaModel } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  results:MediaModel[];
  movies:MediaModel[];
  series:MediaModel[];
  medialist:MediaModel[]
  isLoading:boolean
  userEmail:string  //email à récupérer dans le jeton JWT
  activeTabLabel:string

  //liste status
  status_media = [['TO_WATCH', 'A regader'], ['IN_PROGRESS', 'En cours'], ['WATCHED', 'Vu']]

  constructor(private mediaService: MediaService, private routeur: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;
    let jetonDecode = this.userService.getDecodeJWT()

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

    // on s'abonne à la source de données search$
    this.mediaService.search$.subscribe(data => this.results = data)

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
    this.deleteSearchText(inputElt);
  }
  
  //méthode pour ajouter Serie ou Movie dans Viewings
  addMedia(imdbId: string, typeMedia: string, inputElt) {
    this.mediaService.addMediaByEmailAndIdMedia(this.userEmail, imdbId, typeMedia);
    this.deleteSearchText(inputElt);
  }

  loadNextSeries() {
    this.isLoading = true;
    this.mediaService.getAllSeries();
  }

 // search user text in Api and in his movie / serie list
 searchApiAndUserList(activeTab:number, searchText: string) {
  if (searchText.trim().length < 3) {
    this.mediaService.search$.next([]);
  }
  else {
    switch (activeTab) {
      case 1:
        this.activeTabLabel = 'movie'
        break;
    
      default:
        this.activeTabLabel = 'serie'
        break;
    }
    this.mediaService.getNbResults(searchText, this.activeTabLabel);
    this.mediaService.getSearchResults(this.userEmail, searchText, this.activeTabLabel);
  }
}

/**
   * Delete search text on userClickEvent
   * @param inputElt 
   */
  deleteSearchText(inputElt) {
    inputElt.value = '';
    this.mediaService.search$.next([]);
  }

}
