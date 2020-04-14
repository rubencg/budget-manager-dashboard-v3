import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Transfer } from '../interfaces';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Injectable()
export class TransferService {
  private transfersUrl: string = 'transfers/';
  private transferRef;
  transfers: Transfer[];

  constructor(private db: AngularFireDatabase) {
    this.transferRef = db.list(this.transfersUrl).snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
  }

  saveTransfer(expense: Transfer): firebase.database.ThenableReference {
    return this.db.list(this.transfersUrl).push(expense);
  }

  deleteTransfer($key: string): Promise<void> {
    return this.db.list(this.transfersUrl).remove($key);
  }

  updateTransfer($key: string, be: Transfer): Promise<void> {
    return this.db.list(this.transfersUrl)
      .update($key, {
        amount: be.amount,
        fromAccount: be.fromAccount,
        toAccount: be.toAccount,
        date: be.date
      });
  }

  getAllTransfers(): Observable<Transfer[]> {
    this.transferRef.subscribe(a => {
      this.transfers = a;
    });

    return this.transferRef;
  }

  getLocalTransfers(): Transfer[] {
    return this.transfers;
  }

}