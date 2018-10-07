import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryService } from './entry.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    AngularFireModule
  ],
  providers: [
    EntryService
  ],
  declarations: []
})
export class ServicesModule { }
