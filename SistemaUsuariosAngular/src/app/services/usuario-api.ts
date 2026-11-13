
import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

// Dados enviados para cadastro
export interface CadastroUsuario {
  nome: string;
  email: string;
  senha: string;
}

// Usuário retornado pela API
export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

// Resposta do cadastro
export interface RespostaCadastro {
  mensagem: string;
  usuario: UsuarioLogado;
}

// Resposta do login com JWT
export interface RespostaLogin {
  mensagem: string;
  token: string;
  usuario: UsuarioLogado;
}

// Resposta do endpoint protegido /me
export interface RespostaPerfil {
  mensagem: string;
  nome: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioApi {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:5119/api/usuarios';

  // Cadastrar usuário
  cadastrar(
    usuario: CadastroUsuario
  ): Observable<RespostaCadastro> {

    return this.http.post<RespostaCadastro>(
      `${this.apiUrl}/cadastrar`,
      usuario
    );
  }

  // Fazer login e receber JWT
  login(
    email: string,
    senha: string
  ): Observable<RespostaLogin> {

    return this.http.post<RespostaLogin>(
      `${this.apiUrl}/login`,
      { email, senha }
    );
  }

  // Consultar endpoint protegido
 meuPerfil(): Observable<RespostaPerfil> {

  return this.http.get<RespostaPerfil>(
    `${this.apiUrl}/me`
  );

}
}
