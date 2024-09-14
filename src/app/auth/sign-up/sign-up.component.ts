import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { equal } from '../../validators/equal.validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserForCreation } from '../../models/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  public readonly logoUrl = 'assets/logo.png';
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  route = inject(Router);
  signUpForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    userName: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [
      Validators.required,
      equal('password'),
    ]),
  });

  signUp(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.signUpForm.invalid) return;
    const userForCreation: UserForCreation = this.signUpForm
      .value as UserForCreation;
    this.authService
      .signup(userForCreation)
      .pipe(
        switchMap((user) =>
          this.authService.login(user.email, userForCreation.password)
        )
      )
      .subscribe({
        next: () => this.route.navigate(['/home']),
        error: this.handleError,
      });
  }

  onHidePassword(event: Event) {
    event.preventDefault();
    this.hidePassword.set(!this.hidePassword());
  }

  onHideConfirmPassword(event: Event) {
    event.preventDefault();
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  private handleError(err: any) {
    ''.startsWith;
    if (err?.status.toString().startsWith('4')) {
      this.snackBar.open(err?.error?.message, undefined, {
        duration: 5000,
      });
    } else {
      this.snackBar.open(
        'Oops! Something went wrong. Please give it another shot.',
        undefined,
        {
          duration: 5000,
        }
      );
    }
  }

  get email() {
    return this.signUpForm.controls.email;
  }

  get password() {
    return this.signUpForm.controls.password;
  }

  get confirmPassword() {
    return this.signUpForm.controls.confirmPassword;
  }

  get userName() {
    return this.signUpForm.controls.userName;
  }

  get name() {
    return this.signUpForm.controls.name;
  }
}
