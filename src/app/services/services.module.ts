import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryService } from './entry.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AuthenticationService } from './authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { CategoriesService } from './categories.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    AngularFireModule
  ],
  providers: [
    AngularFireAuth,
    AuthenticationService,
    EntryService,
    CategoriesService
  ],
  declarations: []
})
export class ServicesModule { }
