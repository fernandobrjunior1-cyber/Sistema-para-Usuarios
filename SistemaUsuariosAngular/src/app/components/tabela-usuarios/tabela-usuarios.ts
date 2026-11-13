
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './tabela-usuarios.html',
  styleUrl: './tabela-usuarios.css'
})
export class TabelaUsuarios {

  colunas: string[] = ['id', 'nome', 'email', 'perfil'];

 usuarios = new MatTableDataSource<Usuario>([
  { id: 1, nome: 'Antonio', email: 'antonio@teste.com', perfil: 'Administrador' },
  { id: 2, nome: 'Leia', email: 'leia@teste.com', perfil: 'Usuario' },
  { id: 3, nome: 'Carlos', email: 'carlos@teste.com', perfil: 'Usuario' },
  { id: 4, nome: 'Maria', email: 'maria@teste.com', perfil: 'Usuario' }
]);

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit(): void {
  this.usuarios.paginator = this.paginator;
}
}
