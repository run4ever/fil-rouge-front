import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) { }

  show(message, action = 'Fermer') {
    this._snackBar.open(message, action, {
      duration: 3500,
      verticalPosition: 'top'
    });
  }
}