import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  //TOKEN devait être géré par Interceptor plus tard après l'authentification réussite
  //en attendant on met un token généré via swagger valable 5h, donc à modifier au bout de 5h
  private TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYWJpZW5AdGNsLmNvbSIsImV4cCI6MTYxNTA2ODE3MiwiaWF0IjoxNjE1MDUwMTcyfQ.BRDVOR6u4J63GSb8oJulAhT6i36Rvwo1GIcaTdBiqk_tnE4I68XnbhduwOC7A3GA1JkG4Acqal9p_9396rfFhw";
  
  cloneReq: HttpRequest<unknown>;
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request);
    if (request.url.includes('http://localhost:8080')) {
      if (request.url !== 'http://localhost:8080/authenticate') {
      //code origine de prof, après authentification on met jeton JWT dans localStorage  
      //this.cloneReq = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token')) });
      //en attendant d'avoir authentification on met en dure jeton JWT ici
      this.cloneReq = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' +this.TOKEN) });
      console.log("après ajout JWT dans header")
      console.log(this.cloneReq)
      }
      else {
        this.cloneReq = request;
      }
    }
    return next.handle(this.cloneReq);
  }
}
