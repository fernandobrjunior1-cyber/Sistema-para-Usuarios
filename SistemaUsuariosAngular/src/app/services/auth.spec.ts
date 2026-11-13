
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Auth } from './auth';

describe('Serviço Auth', () => {

  let auth: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    auth = TestBed.inject(Auth);
  });

  it('deve iniciar sem usuário autenticado', () => {

    expect(auth.estaAutenticado()).toBe(false);

  });

  it('deve iniciar sem token JWT', () => {

    expect(auth.token()).toBeNull();

  });

  it('deve limpar os dados ao sair', () => {

    auth.usuarioLogado.set({
      id: 1,
      nome: 'junio',
      email: 'junio@teste.com',
      perfil: 'Usuario'
    });

    auth.token.set('token-de-teste');
    auth.perfilVerificado.set(true);

    auth.sair();

    expect(auth.token()).toBeNull();
    expect(auth.usuarioLogado()).toBeNull();
    expect(auth.estaAutenticado()).toBe(false);

  });

});
