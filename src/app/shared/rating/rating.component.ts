import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() rating: number;
  @Input() votes: number;
  @Input() loves: string;
  
  //Array pour utilisation du ngFor (on insère autant d'éléments que de points, pour boucler autant de fois)
  stars:Array<number>;
  greyStars:Array<number>;

  constructor() { }

  ngOnInit(): void {
    let roundedScore = Math.round(this.rating);
    let reste = 5 - roundedScore;
    this.stars = new Array(roundedScore).fill(1);
    this.greyStars = new Array(reste).fill(1);
  }
}
