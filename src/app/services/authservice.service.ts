import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL =
    'https://gsm-hmg.centralitcloud.com.br/citsmart/services/login';
  private sessionToken: string = '';

  constructor(private http: HttpClient) {
    this.sessionToken = localStorage.getItem('sessionToken') || '';
  }

  login(userName: string, password: string): Observable<any> {
    const fullUserName = 'citsmart.local\\' + userName;

    const body = {
      clientID: 'API_PBI',
      language: 'pt_BR',
      userName: fullUserName,
      password: password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiURL, body, { headers }).pipe(
      map((response: any) => {
        if (response.sessionID) {
          this.sessionToken = response.sessionID;
          localStorage.setItem('sessionToken', this.sessionToken);
          localStorage.setItem('username', userName);
          this.startSessionTimer();
        }
        return response;
      })
    );
  }
  startSessionTimer() {
    setTimeout(() => {
      this.sessionToken = '';
      localStorage.removeItem('sessionToken');
      alert('Sua sessão expirou. Por favor, faça login novamente.');
    }, 10 * 60 * 1000);
  }
  getSessionToken(): string {
    return this.sessionToken;
  }
}
