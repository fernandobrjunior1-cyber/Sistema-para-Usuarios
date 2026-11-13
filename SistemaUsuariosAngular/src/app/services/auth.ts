
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';

import {
  UsuarioLogado,
  RespostaLogin,
  RespostaPerfil
} from './usuario-api';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5119/api/usuarios';

  usuarioLogado = signal<UsuarioLogado | null>(null);
  token = signal<string | null>(null);
  perfilVerificado = signal(false);

  // 1. Realizar login
  login(email: string, senha: string): Observable<RespostaLogin> {

    return this.http.post<RespostaLogin>(
      `${this.apiUrl}/login`,
      { email, senha }
    ).pipe(
      tap(resposta => {
        this.usuarioLogado.set(resposta.usuario);
        this.token.set(resposta.token);
        this.perfilVerificado.set(false);
      })
    );
  }

  // 2. Verificar perfil na API
  verificarPerfil(): Observable<RespostaPerfil> {

    const tokenAtual = this.token();

    if (!tokenAtual) {
      return throwError(
        () => new Error('Usuário não autenticado.')
      );
    }

    return this.http.get<RespostaPerfil>(
      `${this.apiUrl}/me`
    ).pipe(
      tap(() => this.perfilVerificado.set(true))
    );
  }

  // 3. Verificar se está autenticado
  estaAutenticado(): boolean {

    return this.usuarioLogado() !== null
      && this.token() !== null
      && this.perfilVerificado();
  }

  // 4. Verificar se é administrador
  ehAdministrador(): boolean {

    return this.estaAutenticado()
      && this.usuarioLogado()?.perfil === 'Administrador';
  }

  // 5. Encerrar sessão
  sair(): void {

    this.usuarioLogado.set(null);
    this.token.set(null);
    this.perfilVerificado.set(false);
  }
}
