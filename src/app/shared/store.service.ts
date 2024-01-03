import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {ChildResponse} from './interfaces/Child';
import {BehaviorSubject, from, Observable, of, Subject} from "rxjs";
import {BackendService} from "./backend.service";
import {Filter} from "./interfaces/Filter";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  @Output() childLoadEvent = new EventEmitter();
  @Output() kindergardenLoadEvent = new EventEmitter();

  constructor(private backendService: BackendService) {
  }

  private _kindergardens: Kindergarden[] = [];
  private _children = new BehaviorSubject<ChildResponse[]>([]);
  public childrenTotalCount: number = 0;
  public childrenLoading: boolean = true;
  public childrenLoadError$ = new Subject<string>();


  public refreshKindergardens() {
    this.backendService.getKindergardens().subscribe({
      next: value => {
        this._kindergardens = value
        this.kindergardenLoadEvent.emit();
      },
      error: err => {
        console.log("Observable emitted an error " + err.message)
      }
    })
  }

  public refreshChildren(pageNumber: number, pageSize: number, filterValue?: string, sort?: string, sortDir?: string) {
    this.childrenLoading = true;
    this.backendService.getChildren(pageNumber, pageSize, filterValue, sort, sortDir).subscribe({
      next: value => {
        this._children.next(value.body!)
        this.childrenTotalCount = Number(value.headers.get('X-Total-Count'));
        this.childrenLoading = false
      },
      error: err => {
        console.log("Observable emitted an error " + err.message)
        this.childrenLoading = false
        this.childrenLoadError$.next("Die Liste an Kindern konnte nicht geladen werden, bitte versuchen Sie es später erneut.");
      }
    })
  }

  get kindergardens(): Kindergarden[] {
    return this._kindergardens;
  }

  getChildren(pageNumber: number, pageSize: number, filter?: string, sort?: string, sortDir?: string): Observable<ChildResponse[]> {
    if (this._children.getValue().length === 0 || filter || sort) {
      this.refreshChildren(pageNumber, pageSize, filter, sort, sortDir)
    }
    return this._children.asObservable();
  }


  findKindergardenById(id: string): Kindergarden | undefined {
    return this._kindergardens.find(x => x.id.toString() === id)
  }

}
