import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '../shared/services/media.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  mediaId:string
  mediaType:string
  media

  constructor(private router:Router,private route:ActivatedRoute,private mediaService:MediaService) { }

  ngOnInit(): void {
    this.mediaId = this.route.snapshot.params.id
    this.mediaType = this.route.snapshot.params.type
    if(this.mediaType=== 'serie') {
      this.media = this.mediaService.series$.getValue()
      .find( m => m.imdbId == this.mediaId)
    }
    else {
      this.media = this.mediaService.movies$.getValue()
      .find( m => m.imdbId == this.mediaId)
    }
    
    //console.log(this.media)
  }


  goToMylistPage() {
    let selectedIndex 
    if(this.mediaType==='serie') {
      selectedIndex=0
    }
    if(this.mediaType==='movie') {
      selectedIndex=1
    }
      //choixIndex sera utilisé par media-list pour afficher Serie ou Movie
      this.mediaService.indexTab$.next({choixIndex:selectedIndex})
      //vider le résultats de search de mylist
      this.mediaService.search$.next([])
      this.router.navigate(['/mylist'])
  }
}
