
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-usuario',
  imports: [],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class Usuario {

  auth = inject(Auth);
  private router = inject(Router);

  sair(): void {
    this.auth.sair();
    this.router.navigate(['/login']);
  }
}
