
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,AbstractControl,
ValidationErrors,
ValidatorFn
} from '@angular/forms';




function senhaComMaiuscula(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const senha = control.value as string;

    if (!senha) {
      return null;
    }

    const possuiMaiuscula = /[A-Z]/.test(senha);

    return possuiMaiuscula
      ? null
      : { semMaiuscula: true };
  };
}


@Component({
  selector: 'app-formulario-reativo',
  standalone: true,
  imports: [
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
],
  templateUrl: './formulario-reativo.html',
  styleUrl: './formulario-reativo.css'
})
export class FormularioReativo {

  private fb = inject(FormBuilder);

  formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    senha: ['', [
  Validators.required,
  Validators.minLength(6),
  senhaComMaiuscula()
]]
  });

cadastrar(): void {

  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    console.log('Formulário inválido!');
    return;
  }

  const dados = this.formulario.getRawValue();

  console.log('Formulário válido!');
  console.log('Nome:', dados.nome);
  console.log('E-mail:', dados.email);

  alert('Formulário validado com sucesso!');
}
}