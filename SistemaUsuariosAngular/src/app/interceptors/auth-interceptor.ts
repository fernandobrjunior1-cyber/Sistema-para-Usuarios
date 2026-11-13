import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(Auth);
  const token = auth.token();

  if (token && req.url.startsWith('http://localhost:5119/api/')) {

    const novaRequisicao = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(novaRequisicao);
  }

  return next(req);
};