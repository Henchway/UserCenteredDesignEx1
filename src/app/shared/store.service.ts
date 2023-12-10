import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import { ChildResponse} from './interfaces/Child';
import {BehaviorSubject, from, Observable, of} from "rxjs";
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  @Output() childLoadEvent = new EventEmitter();
  @Output() kindergardenLoadEvent = new EventEmitter();

  constructor(private backendService: BackendService) {
  }

  // ngOnInit(): void {
  //   this.refreshKindergardens()
  // }


  private _kindergardens: Kindergarden[] = [];
  private _children = new BehaviorSubject<ChildResponse[]>([]);
  public childrenTotalCount: number = 0;
  public childrenLoading: boolean = true;


  public refreshKindergardens() {
    this.backendService.getKindergardens().subscribe({
      next: value => {
        this._kindergardens = value
        this.kindergardenLoadEvent.emit();
      },
      error: err => {
        console.log("Observable emitted an error " + err)
      }
    })
  }

  public refreshChildren(pageNumber: number, pageSize: number) {
    console.log("refreshing children")
    this.childrenLoading = true;
    this.backendService.getChildren(pageNumber, pageSize).subscribe({
      next: value => {
        this._children.next(value.body!)
        this.childrenTotalCount = Number(value.headers.get('X-Total-Count'));
        this.childrenLoading = false
      },
      error: err => {
        console.log("Observable emitted an error " + err)
        this.childrenLoading = false
      }
    })
  }

  get kindergardens(): Kindergarden[] {
    return this._kindergardens;
  }

  getChildren(pageNumber: number, pageSize: number, refresh: boolean): Observable<ChildResponse[]> {
    if (this._children.getValue().length === 0 || refresh) {
      this.refreshChildren(pageNumber, pageSize)
    }
    return this._children.asObservable();
  }


  findKindergardenById(id: string): Kindergarden | undefined {
    return this._kindergardens.find(x => x.id.toString() === id)
  }

}
