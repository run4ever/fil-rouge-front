import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Import des components MaterialAngular*/
// import { MaterialModule } from './shared/material/material.module'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { LoginFormComponent } from './login-form/login-form.component';
import { MediaListComponent } from './media-list/media-list.component';
import { DetailComponent } from './detail/detail.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './shared/interceptors/api.interceptor';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RatingComponent } from './shared/rating/rating.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {NgxPaginationModule} from 'ngx-pagination'; 



@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    MediaListComponent,
    DetailComponent,
    RegisterFormComponent,
    HomeComponent,
    RatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    /* Import des components MaterialAngular*/
    //MaterialModule
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule, FormsModule,
    HttpClientModule,
    MatTabsModule,
    NgxPaginationModule
    
  
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true},
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
