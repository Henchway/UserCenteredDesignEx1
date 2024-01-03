import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {Child, ChildResponse} from './interfaces/Child';
import {Filter} from "./interfaces/Filter";
import {BACKEND_URL} from "./constants";

@Injectable({
  providedIn: 'root'
})
export class BackendService {


  constructor(private http: HttpClient) {
  }

  public getKindergardens() {
    return this.http.get<Kindergarden[]>(`${BACKEND_URL}/kindergardens`)
  }

  public findKindergardenbyId(id: string) {
    return this.http.get<Kindergarden>(`${BACKEND_URL}/kindergardens/${id}`);
  }

  public getChildren(page: number, pageSize: number, filterValue?: string, sort?: string, sortDir?: string) {
    let url = `${BACKEND_URL}/childs?_expand=kindergarden&_page=${page + 1}&_limit=${pageSize}`;
    if (filterValue && filterValue !== "-1") {
      url += `&kindergardenId=${filterValue}`
    }
    if (sort) {
      url += `&_sort=${sort}&_order=${sortDir}`
    }
    return this.http.get<ChildResponse[]>(url, {observe: 'response'})
  }

  public addChildData(child: Child) {
    return this.http.post(`${BACKEND_URL}/childs`, child)
  }

  public deleteChildData(childId: string) {
    return this.http.delete(`${BACKEND_URL}/childs/${childId}`)
  }
}
