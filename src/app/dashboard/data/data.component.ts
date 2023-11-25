import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  constructor(public storeService: StoreService, private backendService: BackendService) {}
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  @Output() setPageSizeEvent = new EventEmitter<number>();

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage, this.pageSize);
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
        age--;
    }
    return age;
  }

  setPaginatorPage(event: PageEvent) {
    this.selectPageEvent.emit(event.pageIndex)
    this.backendService.getChildren(event.pageIndex, event.pageSize)
  }

  public getTotalChildCount() {
    return this.storeService.childrenTotalCount;
  }

  public cancelRegistration(childId: string) {
    this.backendService.deleteChildData(childId, this.currentPage, this.pageSize);
  }
}


