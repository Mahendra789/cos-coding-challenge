import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { CosService } from '../services/cos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  isLoading: boolean = false;

  constructor(
    private _router: Router,
    private _cosService: CosService,
    private _snackBar: MatSnackBar,
  ) {
    if (window.localStorage.getItem('email')) {
      this._router.navigateByUrl('/dashboard');
    }
  }

  ngOnInit(): void {
  }

  login(): void {
    const creds = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value,
    }

    this.isLoading = true;
    this._cosService.isUserRegistered(creds).subscribe(res => {

      if (res.privileges == '{SALESMAN_USER}') {
        window.localStorage.setItem("privileges", res.privileges);
        window.localStorage.setItem("email", this.emailFormControl.value);
        this._cosService.setUserDetails(res);

        this._router.navigate(['/dashboard']);
      } else {
        this._snackBar.open('Registered buyers can only login');
      }

      this.isLoading = false;

    }, err => {
      this._snackBar.open('Username and password not correct');
      this.isLoading = false;
    });
  }

}
