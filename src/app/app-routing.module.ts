import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MediaListComponent } from './media-list/media-list.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AuthGuard } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'logout', component: HomeComponent },
  { path: 'mylist', canActivate: [AuthGuard], component: MediaListComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'detail/:id/:type', canActivate: [AuthGuard], component: DetailComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
