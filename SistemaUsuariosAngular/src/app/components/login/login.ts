
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap, finalize } from 'rxjs';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  auth = inject(Auth);
  private router = inject(Router);

  email = '';
  senha = '';

  mensagem = signal('');
  carregando = signal(false);

  // Mantém compatibilidade com o HTML da Aula 10
  usuarioLogado = this.auth.usuarioLogado;
  perfilVerificado = this.auth.perfilVerificado;

  entrar(): void {

    if (this.carregando()) {
      return;
    }

    if (!this.email.trim() || !this.senha) {
      this.mensagem.set('Preencha e-mail e senha.');
      return;
    }

    this.carregando.set(true);
    this.mensagem.set('');

    this.auth.login(this.email.trim(), this.senha)
      .pipe(
        switchMap(() => this.auth.verificarPerfil()),
        finalize(() => this.carregando.set(false))
      )
      .subscribe({

        next: () => {

          this.senha = '';

          if (this.auth.ehAdministrador()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/usuario']);
          }
        },

        error: (erro) => {

          // Remove qualquer sessão parcialmente criada
          this.auth.sair();

          if (erro.status === 401) {
            this.mensagem.set('E-mail ou senha inválidos.');
          } else {
            this.mensagem.set(
              'Não foi possível autenticar. Verifique a API.'
            );
          }
        }
      });
  }

  sair(): void {
    this.auth.sair();
    this.email = '';
    this.senha = '';
    this.mensagem.set('');
    this.router.navigate(['/login']);
  }
}
