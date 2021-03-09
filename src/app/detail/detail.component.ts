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
    
    this.media = this.mediaService.medias$.getValue()
                    .find( m => {
                      console.log(m.imdbId+this.mediaId)
                      console.log(m.typeMedia+this.mediaType)
                                 m.imdbId == this.mediaId
                                && m.typeMedia == this.mediaType
                                })

                                console.log(this.media)
  }


  goToMylistPage() {
      this.router.navigate(['/mylist'])
  }
}
