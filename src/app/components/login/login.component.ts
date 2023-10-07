import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }
  
  get passwordControl() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    if (this.authService.getSessionToken()) {
      this.router.navigate(['/tickets']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe(
      (response) => {
        if (response.sessionID) {
          console.log('Login bem-sucedido. SessionID:', response.sessionID);
          this.router.navigate(['/tickets']);
        } else {
          console.error('Erro de login. Não foi possível obter o SessionID.');
          this.loginFailed = true;
        }
      },
      (error) => {
        console.error('Erro de login:', error);
        this.loginFailed = true;
      }
    );
  }
}