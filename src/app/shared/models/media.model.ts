export class MediaModel {
    typeMedia:string;
    status:string;
    imdbId: string;
    title: string;
    description: string;
    category: string
    startYear: number;
    imdbRating: number;
    imdbVotes: number;
    actors: string;
    imageUrl: string
    runtime: number;
    endYear: number
    numberOfSeason: number;	
    currentSeason:number;
    statusSerie: string;
    alreadyInUserList:boolean;
    likeOrNot:string;
    
    constructor(typeMedia: string,status:string,imdbId: string,title: string,description: string, category: string, startYear: number, imdbRating: number, imdbVotes:number,actors: string, imageUrl: string,runtime: number, endYear:number,numberOfSeason: number,currentSeason:number,statusSerie: string, alreadyInUserList:boolean, likeOrNot:string) {
        this.typeMedia              = typeMedia         ;
        this.status                 = status            ;
        this.imdbId                 = imdbId            ;
        this.title                  = title             ;
        this.description            = description       ;
        this.category               = category          ;
        this.startYear              = startYear         ;
        this.imdbRating             = imdbRating        ;
        this.imdbVotes              = imdbVotes         ;
        this.actors                 = actors            ;
        if(imageUrl==null || imageUrl=="N/A") {this.imageUrl="https://jogging-plus.com/wp-content/uploads/2021/03/no-image.png"}
        else this.imageUrl          = imageUrl          ;
        this.runtime                = runtime           ;
        this.endYear                = endYear           ;
        this.numberOfSeason         = numberOfSeason    ;
        this.currentSeason          = currentSeason        ;
        this.statusSerie            = statusSerie       ;
        this.alreadyInUserList      = alreadyInUserList ;
        this.likeOrNot              = likeOrNot         ;
    }
 }