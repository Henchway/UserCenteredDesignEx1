import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {Child, ChildResponse} from './interfaces/Child';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) {
  }

  public getKindergardens() {
    return this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens')
  }

  public findKindergardenbyId(id: string) {
    return this.http.get<Kindergarden>(`http://localhost:5000/kindergardens/${id}`);
  }

  public getChildren(page: number, pageSize: number) {
    return this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page + 1}&_limit=${pageSize}`, {observe: 'response'})
  }

  public addChildData(child: Child, page: number, pageSize: number) {
    return this.http.post('http://localhost:5000/childs', child)
  }

  public deleteChildData(childId: string, page: number, pageSize: number) {
    return this.http.delete(`http://localhost:5000/childs/${childId}`)
  }
}
