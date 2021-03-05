export class MediaModel {
    id: number;
    imdbId: string;
    duration: number;
    releaseYear: string;
    imdbRating: number;
    imdbVotes: number;
    actors: string;
    category: string;
    title: string;
    synopsis: string;
    imageUrl: string;
    type:string;
 
    constructor(id: number,imdbId: string,duration: number,releaseYear: string,averageRating: number,numberOfVotes: number,actors: string,category: string,title: string,description: string,imageUrl: string) {
        this.id = id;
        this.imdbId = imdbId;
        this.duration = duration;
        this.releaseYear = releaseYear;
        this.imdbRating = averageRating;
        this.imdbVotes = numberOfVotes;
        this.actors = actors;
        this.category = category;
        this.title = title;
        this.synopsis = description;
        this.imageUrl = imageUrl;
    }


 }