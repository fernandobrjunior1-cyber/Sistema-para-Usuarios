import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(

    catchError((erro: HttpErrorResponse) => {

      switch (erro.status) {

        case 0:
          console.error('Não foi possível conectar à API.');
          break;

        case 401:
          console.error('Usuário não autenticado.');
          break;

        case 403:
          console.error('Acesso negado.');
          break;

        case 404:
          console.error('Recurso não encontrado.');
          break;

        case 500:
          console.error('Erro interno do servidor.');
          break;

        default:
          console.error('Erro HTTP:', erro.status);
      }

      return throwError(() => erro);
    })
  );
};