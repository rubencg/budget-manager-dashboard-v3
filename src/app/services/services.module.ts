import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryService } from './entry.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AuthenticationService } from './authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';

@NgModule({
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    AngularFireModule
  ],
  providers: [
    AngularFireAuth,
    AuthenticationService,
    EntryService
  ],
  declarations: []
})
export class ServicesModule { }
