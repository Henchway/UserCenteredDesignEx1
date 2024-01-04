import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public currentPage: number = 0;
  public pageSize: number = 5;
  public sort?: string;
  public sortDir? : string;
  public filter?: string;
  public showAddData = true;

  setPage(newPageCount: number) {
    this.currentPage = newPageCount;
  }

  setPageSize(newPageSize: number) {
    this.pageSize = newPageSize;
  }
  setSort(newSort: string) {
    this.sort = newSort;
  }
  setSortDir(newSortDir: string) {
    this.sortDir = newSortDir;
  }
  setFilter(newFilter: string) {
    this.filter = newFilter;
  }

  toggleButtonClicked(showAddData: boolean) {
    this.showAddData = showAddData;
  }

}
