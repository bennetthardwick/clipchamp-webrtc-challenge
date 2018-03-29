import { NgModule } from '@angular/core';

// Material UI Components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

let materialModules: any[] = [
  BrowserAnimationsModule,
  MatInputModule,
  MatButtonModule,
  MatDividerModule,
  MatListModule
]

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class UIModule { }