import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabelaUsuarios } from './tabela-usuarios';

describe('TabelaUsuarios', () => {
  let component: TabelaUsuarios;
  let fixture: ComponentFixture<TabelaUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
