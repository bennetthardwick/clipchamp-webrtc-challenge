import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';

import { LobbyComponent } from './lobby.component';
import { ChatComponent } from '../chat/chat.component';

import { ChatService } from '../chat.service';
import { UIModule } from '../ui.module';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyComponent, ChatComponent ],
      imports: [ UIModule, FormsModule, RouterModule.forRoot([{ path: 'chat', component: ChatComponent }])],
      providers: [ ChatService, { provide: APP_BASE_HREF, useValue: '/' } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
