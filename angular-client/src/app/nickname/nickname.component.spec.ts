import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';

import { LobbyComponent } from '../lobby/lobby.component';
import { NicknameComponent } from './nickname.component';

import { ChatService } from '../chat.service';
import { UIModule } from '../ui.module';

describe('NicknameComponent', () => {
  let component: NicknameComponent;
  let fixture: ComponentFixture<NicknameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NicknameComponent, LobbyComponent ],
      providers: [ ChatService, { provide: APP_BASE_HREF, useValue: '/' }],
      imports: [ UIModule, FormsModule, RouterModule.forRoot([ { path: 'lobby', component: LobbyComponent } ])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NicknameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
