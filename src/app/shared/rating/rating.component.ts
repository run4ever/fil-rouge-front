import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() rating: number;
  
  //Array pour utilisation du ngFor (on insère autant d'éléments que de points, pour boucler autant de fois)
  stars:Array<number>;

  constructor() { }

  ngOnInit(): void {
 //   console.log(this.rating);
    let roundedScore = Math.round(this.rating);
    this.stars = new Array(roundedScore).fill(1);
  }
}
