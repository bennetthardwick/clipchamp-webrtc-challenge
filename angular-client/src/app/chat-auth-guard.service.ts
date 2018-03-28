import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { ChatService } from './chat.service';

@Injectable()
export class ChatAuthGuard implements CanActivate {

  constructor(private chatService: ChatService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.chatService.isRemoteNicknameSet()) {
      return true;
    } else {
      this.router.navigate(['/lobby']);
      return false;
    }

  }

}

@Injectable()
export class LobbyAuthGuard implements CanActivate {

  constructor(private chatService: ChatService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.chatService.isNicknameSet()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}