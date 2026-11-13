
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { UsuarioApi } from '../../services/usuario-api';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  private usuarioApi = inject(UsuarioApi);

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';

  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro'>('erro');
  salvando = signal(false);

  cadastrar(): void {

    if (this.salvando()) {
      return;
    }

    this.mensagem.set('');

    const nome = this.nome.trim();
    const email = this.email.trim();

    if (
      !nome ||
      !email ||
      !this.senha ||
      !this.confirmarSenha
    ) {
      this.mostrarErro('Preencha todos os campos.');
      return;
    }

    if (nome.length < 3) {
      this.mostrarErro(
        'O nome deve ter pelo menos 3 caracteres.'
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      this.mostrarErro('Informe um e-mail válido.');
      return;
    }

    if (this.senha.length < 8) {
      this.mostrarErro(
        'A senha deve ter pelo menos 8 caracteres.'
      );
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.mostrarErro('As senhas não são iguais.');
      return;
    }

    this.salvando.set(true);

    this.usuarioApi.cadastrar({
      nome,
      email,
      senha: this.senha
    })
    .pipe(
      finalize(() => {
        this.salvando.set(false);
      })
    )
    .subscribe({

      next: (resposta) => {

        this.tipoMensagem.set('sucesso');
        this.mensagem.set(resposta.mensagem);

        // Limpar dados do cadastro
        this.nome = '';
        this.email = '';
        this.senha = '';
        this.confirmarSenha = '';
      },

      error: (erro) => {

        console.error('Erro ao cadastrar:', erro);

        if (erro.status === 409) {
          this.mostrarErro(
            'Este e-mail já está cadastrado.'
          );
        } else if (erro.status === 400) {
          this.mostrarErro(
            'Dados inválidos. Verifique o cadastro.'
          );
        } else if (erro.status === 0) {
          this.mostrarErro(
            'Não foi possível conectar à API.'
          );
        } else {
          this.mostrarErro(
            'Não foi possível cadastrar o usuário.'
          );
        }
      }
    });
  }

  mostrarErro(texto: string): void {
    this.tipoMensagem.set('erro');
    this.mensagem.set(texto);
  }
}
