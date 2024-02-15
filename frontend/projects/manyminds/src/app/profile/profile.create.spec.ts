import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCreate } from './profile.create';

describe('ProfileCreate', () => {
  let component: ProfileCreate;
  let fixture: ComponentFixture<ProfileCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCreate]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
