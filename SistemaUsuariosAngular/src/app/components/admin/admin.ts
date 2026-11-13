
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  auth = inject(Auth);
  private router = inject(Router);

  sair(): void {
    this.auth.sair();
    this.router.navigate(['/login']);
  }
}
