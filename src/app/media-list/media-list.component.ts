import { Component, OnInit } from '@angular/core';
import { Movie } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  movies:Movie[]


  constructor(private movieService:MovieService) {
    
    //this.movieService.getAllMovie()
  //  this.movieService.movie$.subscribe(
  //      (data : Movie[]) => {this.movies = data}
  //  )
    
   this.movieService.getViewingMovie()
  this.movieService.viewingMovies$.subscribe(
    (data:any)=> console.log(data)
  )

   }

  ngOnInit(): void {
  }

}
