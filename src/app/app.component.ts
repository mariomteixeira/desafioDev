import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showLogoutButton: boolean = false;
  username: string = '';
  userInitial: string = '';

  constructor(private cdRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showLogoutButton = event.url !== '/login';
        this.username = localStorage.getItem('username') || '';
        this.userInitial = this.username ? this.username.charAt(0).toUpperCase() : '';
      }
    });
  }

  logoutNavbar() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('username');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}