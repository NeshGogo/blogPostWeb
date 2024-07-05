import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginFrom = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  hidePassword = signal(true);
  constructor(private authService: AuthService, private route: Router) {}

  login(event: Event) {
    event.preventDefault();

    if (this.loginFrom.invalid) return;
    const model = { ...this.loginFrom.value };
    this.authService
      .login(model.email as string, model.password as string)
      .subscribe({
        next: () => this.route.navigate(['/home']),
      });
  }

  onClickHide(event: Event){
    event.preventDefault();
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }
}
