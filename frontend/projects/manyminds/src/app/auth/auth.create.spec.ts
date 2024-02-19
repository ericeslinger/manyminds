import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCreate } from './auth.create';

describe('AuthCreate', () => {
  let component: AuthCreate;
  let fixture: ComponentFixture<AuthCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCreate]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
