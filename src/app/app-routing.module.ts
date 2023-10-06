import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TicketComponent  } from './components/tickets/tickets.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tickets', component: TicketComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
