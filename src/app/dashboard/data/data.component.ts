import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {BackendService} from 'src/app/shared/backend.service';
import {StoreService} from 'src/app/shared/store.service';
import {PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ChildResponse} from "../../shared/interfaces/Child";
import {Kindergarden} from "../../shared/interfaces/Kindergarden";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatSnackBar} from "@angular/material/snack-bar";


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
    "registrationDate",
    "cancelRegistration"
  ]

  mediumScreenColumns = [
    "name",
    "kindergardenName",
    "age",
    "cancelRegistration"
  ]

  smallScreenColumns = [
    "name",
    "kindergardenName",
    "cancelRegistration"
  ]

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = this.allColumns;
  dataSource!: MatTableDataSource<ChildResponse>;
  kindergardens?: Kindergarden[];
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  @Output() setPageSizeEvent = new EventEmitter<number>();
  kindergardenFilter?: Kindergarden;


  constructor(public storeService: StoreService,
              private backendService: BackendService,
              private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.initKindergartenSource();
    this.fetchChildSource();
    this.setBreakpoints();
    this.storeService.childrenLoadError$.subscribe(err => {
      this.snackBar.open(err, "OK", {duration: 8000})
    })

  }



  fetchChildSource() {
    this.storeService.getChildren(this.currentPage, this.pageSize, this.kindergardenFilter?.id.toString())
      .subscribe({
        next: value => {
          this.dataSource = new MatTableDataSource(value);
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'kindergardenName':
                return item.kindergarden.name;
              default:
                return item[property];
            }
          }
          this.dataSource.sort = this.sort
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
    this.fetchChildSource()
  }

  public getTotalChildCount() {
    return this.storeService.childrenTotalCount;
  }

  public cancelRegistration(childId: string) {
    this.backendService.deleteChildData(childId)
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
    this.fetchChildSource()
  }
}

