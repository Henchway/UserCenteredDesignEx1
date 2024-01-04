import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {ChildResponse} from './interfaces/Child';
import {BehaviorSubject, filter, from, map, Observable, of, Subject} from "rxjs";
import {BackendService} from "./backend.service";
import {Filter} from "./interfaces/Filter";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  @Output() childLoadEvent = new EventEmitter();

  constructor(private backendService: BackendService) {
  }

  public kindergardens$ = new BehaviorSubject<Kindergarden[]>([]);
  private children$ = new BehaviorSubject<ChildResponse[]>([]);
  public childrenTotalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public childrenLoading: boolean = true;


  public getKindergardens() {
    this.backendService.getKindergardens().subscribe({
      next: value => {
        this.kindergardens$.next(value)
      },
      error: err => {
        console.log("Observable emitted an error " + err.message)
        this.kindergardens$.error("Die Liste an Kindergärten konnte nicht geladen werden, bitte versuchen Sie es später erneut.")
      }
    })
    return this.kindergardens$
  }

  public getChildren(pageNumber: number, pageSize: number, filterValue?: string, sort?: string, sortDir?: string) {
    this.childrenLoading = true;
    this.backendService.getChildren(pageNumber, pageSize, filterValue, sort, sortDir).subscribe({
      next: value => {
        this.children$.next(value.body!)
        this.childrenTotalCount$.next(Number(value.headers.get('X-Total-Count')));
        this.childrenLoading = false
      },
      error: err => {
        console.log("Observable emitted an error " + err.message)
        this.childrenLoading = false
        this.children$.error("Die Liste an Kindern konnte nicht geladen werden, bitte versuchen Sie es später erneut.")
      }
    })
    return this.children$
  }

  findKindergardenById(id: string): Observable<Kindergarden | undefined> {
    return this.kindergardens$.pipe(map(obj => obj.find(x => x.id.toString() === id) ))
  }

}
