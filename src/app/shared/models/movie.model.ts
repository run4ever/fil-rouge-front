export class Movie {
    idapiMovieId: string;
    title: string;
    desc: string;
   
    constructor(idapiMovieId: string, title: string, desc: string) {
       this.idapiMovieId = idapiMovieId;
       this.title = title;
       this.desc = desc;
    }
 }