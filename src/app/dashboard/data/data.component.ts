import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BackendService} from 'src/app/shared/backend.service';
import {CHILDREN_PER_PAGE} from 'src/app/shared/constants';
import {StoreService} from 'src/app/shared/store.service';
import {PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ChildResponse} from "../../shared/interfaces/Child";
import {Kindergarden} from "../../shared/interfaces/Kindergarden";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  allColumns = [
    "name",
    "kindergardenName",
    "kindergardenAddress",
    "age",
    "birthDate",
    "cancelRegistration",
    "registrationDate"
  ]

  mediumScreenColumns = [
    "name",
    "kindergardenName",
    "Age",
    "cancelRegistration"
  ]

  smallScreenColumns = [
    "name",
    "kindergardenName",
    "cancelRegistration"
  ]

  displayedColumns = this.allColumns;


  constructor(public storeService: StoreService, private backendService: BackendService, private breakpointObserver: BreakpointObserver) {
  }

  initChildSource() {
    this.storeService.getChildren(this.currentPage, this.pageSize, false)
      .subscribe({
        next: value => {
          console.log(value)
          this.dataSource = new MatTableDataSource(value);
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'kindergardenName':
                return item.kindergarden.name;
              default: // @ts-ignore
                return item[property];
            }
          }
          this.dataSource!.sort = this.sort
          this.dataSource.filterPredicate = (data: ChildResponse, filter: string) => {
            return data.kindergardenId.toString().includes(filter)
          }
          this.filterHandler(this.kindergardenFilter)
        }
      })
  }

  initKindergartenSource() {
    this.storeService.refreshKindergardens();
    this.storeService.kindergardenLoadEvent.subscribe({
      next: () => {
        this.kindergardens = this.storeService.kindergardens.slice()
        const noFilter: Kindergarden = {name: "Kein Filter", id: -1, address: "", typ: 1, betreiber: "", images: [""]}
        this.kindergardens.unshift(noFilter)
        this.kindergardenFilter = this.kindergardens[0];
      }
    })
  }


  dataSource?: MatTableDataSource<ChildResponse>;
  kindergardens?: Kindergarden[];
  @ViewChild(MatSort) sort!: MatSort;
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  @Output() setPageSizeEvent = new EventEmitter<number>();
  kindergardenFilter?: Kindergarden;


  ngOnInit(): void {
    this.initKindergartenSource();
    this.initChildSource();
    this.setBreakpoints();

  }

  private setBreakpoints() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.matches) {
        this.displayedColumns = this.smallScreenColumns
      }
    });

    this.breakpointObserver.observe([
      Breakpoints.Medium,
    ]).subscribe(result => {
      if (result.matches) {
        this.displayedColumns = this.mediumScreenColumns
      }
    });

    this.breakpointObserver.observe([
      Breakpoints.Large, Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        this.displayedColumns = this.allColumns
      }
    });
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
    this.setPageSizeEvent.emit(event.pageSize)
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.storeService.refreshChildren(this.currentPage, this.pageSize);
  }

  public getTotalChildCount() {
    return this.storeService.childrenTotalCount;
  }

  public cancelRegistration(childId: string) {
    // this.dataSource = undefined; // <- Forces the loading spinner to appear
    this.backendService.deleteChildData(childId, this.currentPage, this.pageSize)
      .subscribe(() => {
        this.storeService.refreshChildren(this.currentPage, this.pageSize)
      })
  }


  filterHandler(element?: Kindergarden) {
    if (element && element.id != -1) {
      this.dataSource!.filter = element!.id.toString()
    } else {
      this.dataSource!.filter = ""
    }
  }
}

