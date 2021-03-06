import { Component, OnInit } from '@angular/core';
import { MediaModel } from '../shared/models/media.model';
import { MediaService } from '../shared/services/media.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  medialist:MediaModel[]; 
  isLoading:boolean;

  constructor(private mediaService: MediaService, private routeur:Router) { }

  ngOnInit(): void {
    this.isLoading = true;
   // this.mediaService.getAllViewingSeries('fabien%40tcl.com');//liste ViewingSerie
   // this.mediaService.getAllViewingMovie('fabien%40tcl.com');//liste ViewingMovie
    this.mediaService.getAllViewings('fabien%40tcl.com') //cette méthode retourne ViewingSerie/ViewingMovie dans medias$
    this.mediaService.medias$.subscribe( (data: MediaModel[]) => {
      this.medialist = data;
      this.isLoading = false;
    });
  }

}
