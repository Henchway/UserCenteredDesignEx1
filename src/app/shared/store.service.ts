import {EventEmitter, Injectable, Output} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {Child, ChildResponse} from './interfaces/Child';
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  @Output() childLoadEvent = new EventEmitter();

  @Output() kindergardenLoadEvent = new EventEmitter();

  constructor() {
  }


  private _kindergardens: Kindergarden[] = [];
  private _children: ChildResponse[] = []
  public childrenTotalCount: number = 0;

  get kindergardens(): Kindergarden[] {
    return this._kindergardens;
  }

  set kindergardens(value: Kindergarden[]) {
    this._kindergardens = value;
    this.kindergardenLoadEvent.emit()
  }

  get children(): ChildResponse[] {
    return this._children;
  }

  set children(value: ChildResponse[]) {
    this._children = value;
    this.childLoadEvent.emit()
  }

  findKindergardenById(id: string): Kindergarden | undefined {
    return this._kindergardens.find(x => x.id.toString() === id)
  }

}
