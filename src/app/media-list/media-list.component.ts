import { Component, OnInit } from '@angular/core';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  movieslist:MovieModel[]; 
  isLoading:boolean;

  constructor(private movieService: MovieService, private routeur:Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.movieService.getAllMovies();
    this.movieService.movies$.subscribe( (data: MovieModel[]) => {
      this.movieslist = data;
      this.isLoading = false;
    });
  }

}
