import { Component, OnInit } from '@angular/core';
import { MediaModel } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  medialist:MediaModel[]
  isLoading:boolean
  //userEmail à récupérer quand authentification OK
  userEmail="fabien%40tcl.com"

  //liste status
  status_media=[['TO_WATCH','A regader'],['IN_PROGRESS','En cours'],['WATCHED','Vu']]
  
  constructor(private mediaService: MediaService, private routeur:Router) { }

  ngOnInit(): void {
    this.isLoading = true;
   
    this.mediaService.getAllViewings(this.userEmail) //cette méthode retourne ViewingSerie/ViewingMovie dans medias$

    this.mediaService.medias$.subscribe( (data: MediaModel[]) => {
      this.medialist = data;
      this.isLoading = false;
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
  updateStatusMedia(imdbId:string,typeMedia:string,status:string) {
    //appel le service pour mettre à jour status de film ou serie
    console.log("imdbId="+imdbId+";typeMedia:"+typeMedia+";status:"+status)
    this.mediaService.updateStatusMediaByEmailAndIdMedia(this.userEmail,imdbId,typeMedia,status)
  }

  //méthode update la saison d'une série
  updateSeason(imdbId:string,status:string,numSeason:number) {
    console.log("imdbId="+imdbId+";status:"+status+"; nouveau num saison"+numSeason)
    this.mediaService.updateSeasonSerieByEmailAndIdMedia(this.userEmail,imdbId,status,numSeason)
  }
  //méthode pour supprimer Serie ou Movie de Viewings
  deleteMedia(imdbId: string,typeMedia: string){
    this.mediaService.deleteMediaByEmailAndIdMedia(this.userEmail,imdbId,typeMedia)
  }

}
