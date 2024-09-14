import { Component, signal } from '@angular/core';
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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  public readonly logoUrl = 'assets/logo.png';
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
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
  }

  onHidePassword(event: Event) {
    event.preventDefault();
    this.hidePassword.set(!this.hidePassword());
  }

  onHideConfirmPassword(event: Event) {
    event.preventDefault();
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
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
