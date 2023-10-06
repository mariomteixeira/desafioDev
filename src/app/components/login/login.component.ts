import { Component } from '@angular/core';
import { AuthService } from '../../services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  sessionToken: string = '';

  sessionTimer?: ReturnType<typeof setTimeout>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.getSessionToken()) {
      this.router.navigate(['/tickets']);
    }
  }

  ngOnDestroy() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.sessionID) {
          console.log('Login bem-sucedido. SessionID:', response.sessionID);
          this.router.navigate(['/tickets']);
        } else {
          console.error('Erro de login. Não foi possível obter o SessionID.');
        }
      },
      (error) => {
        console.error('Erro de login:', error);
      }
    );
  }
}