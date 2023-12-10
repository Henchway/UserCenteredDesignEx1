import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {StoreService} from './store.service';
import {Child, ChildResponse} from './interfaces/Child';
import {CHILDREN_PER_PAGE} from './constants';
import {MatSort, Sort} from "@angular/material/sort";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) {
  }

  public getKindergardens() {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
      this.storeService.kindergardens = data;
    });
  }

  public findKindergardenbyId(id: string) {
    return this.http.get<Kindergarden>(`http://localhost:5000/kindergardens/${id}`);
  }

  public getChildren(page: number, pageSize: number) {
    this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page + 1}&_limit=${pageSize}`,
      {observe: 'response'}).subscribe(data => {
      this.storeService.children = data.body!;
      this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
    });
  }

  public addChildData(child: Child, page: number, pageSize: number) {
    this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
      this.getChildren(page, pageSize);
    })
  }

  public deleteChildData(childId: string, page: number, pageSize: number) {
    this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(_ => {
      this.getChildren(page, pageSize);
    })
  }
}
