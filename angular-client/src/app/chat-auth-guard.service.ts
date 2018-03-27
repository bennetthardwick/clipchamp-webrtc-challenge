import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { ChatService } from './chat.service';

@Injectable()
export class ChatAuthGuardService implements CanActivate {

  constructor(private chatService: ChatService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

}