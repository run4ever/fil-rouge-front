import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  
  private URL_API_BASE = environment.apis.API_BACK_BASE
  private URL_API_URL = environment.apis.API_BACK_URL

  cloneReq: HttpRequest<unknown>;
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes(this.URL_API_BASE)) {
      if (request.url !== this.URL_API_BASE+'/authenticate' && request.url !== this.URL_API_URL+'/appuser/add') {
      this.cloneReq = request.clone({ 
        headers: request.headers.set('Authorization', 'Bearer ' +localStorage.getItem('token')) 
      });
      }
      else {
        this.cloneReq = request;
      }
    }
    return next.handle(this.cloneReq);
  }
}
