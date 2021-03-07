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
    statusSerie: string;
    
 
    constructor(typeMedia: string,status:string,imdbId: string,title: string,description: string, category: string, startYear: number, imdbRating: number, imdbVotes:number,actors: string, imageUrl: string,runtime: number, endYear:number,numberOfSeason: number,statusSerie: string) {
        this.typeMedia      = typeMedia     ;
        this.status         = status        ;
        this.imdbId         = imdbId        ;
        this.title          = title         ;
        this.description    = description   ;
        this.category       = category      ;
        this.startYear      = startYear     ;
        this.imdbRating     = imdbRating    ;
        this.imdbVotes      = imdbVotes     ;
        this.actors         = actors        ;
        this.imageUrl       = imageUrl      ;
        this.runtime        = runtime       ;
        this.endYear        = endYear       ;
        this.numberOfSeason = numberOfSeason;
        this.statusSerie    = statusSerie   ;
        
    }


 }