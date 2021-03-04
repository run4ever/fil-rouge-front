export class Movie {
    id: number;
    title: string;
    desc: string;
    image: string;
    date: Date;
    score: number;
 
    constructor(id: number, title: string, overview: string, backdrop: string, release_date: string, vote_average: number) {
       this.id = id;
       this.title = title;
       this.desc = overview;
       this.image = backdrop;
       this.date = new Date(release_date);
       this.score = vote_average;
    }
 }