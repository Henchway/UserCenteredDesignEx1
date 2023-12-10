import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Kindergarden, Typ} from "../../shared/interfaces/Kindergarden";
import {StoreService} from "../../shared/store.service";
import {BackendService} from "../../shared/backend.service";

@Component({
  selector: 'app-kindergarden-detail',
  templateUrl: './kindergarden-detail.component.html',
  styleUrls: ['./kindergarden-detail.component.scss']
})
export class KindergardenDetailComponent implements OnInit {

  id!: string;
  kindergarden?: Kindergarden;

  constructor(private route: ActivatedRoute, private storeService: StoreService, private backendService: BackendService) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.kindergarden = this.storeService.findKindergardenById(this.id);
    if (this.id && !this.kindergarden) {
      this.backendService.findKindergardenbyId(this.id).subscribe(value => {
        this.kindergarden = value
      })
    }
  }


  protected readonly Typ = Typ;
}
