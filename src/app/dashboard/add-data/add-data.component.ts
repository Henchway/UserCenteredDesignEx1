import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {BackendService} from 'src/app/shared/backend.service';
import {StoreService} from 'src/app/shared/store.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              public storeService: StoreService,
              public backendService: BackendService,
              private snackBar: MatSnackBar) {
  }

  public addChildForm!: FormGroup;
  @Input() currentPage!: number;
  @Input() pageSize!: number;

  ngOnInit(): void {
    this.addChildForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: [null, [Validators.required, this.minAgeValidator()]],
      kindergardenId: ['', Validators.required],
      registrationDate: ['']
    })
  }

  onSubmit() {
    if (this.addChildForm.valid) {
      this.addChildForm.get('registrationDate')?.setValue(new Date())
      this.backendService.addChildData(this.addChildForm.value).subscribe({
        next: () => {
          this.openSnackbar(this.addChildForm.value)
          this.addChildForm.reset();
          Object.keys(this.addChildForm.controls).forEach(key => {
            this.addChildForm.get(key)?.setErrors(null);
          });
          this.storeService.refreshChildren(this.currentPage, this.pageSize)
        }
      });
    }
  }

  openSnackbar(formGroupValue: any) {
    this.snackBar.open(`${formGroupValue.name} has been registered.`, "OK")
  }


  minAgeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);
      const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());

      if (selectedDate < oneYearAgo) {
        control.setErrors(null);
      } else {
        setTimeout(() => control.setErrors({
            'dateTooRecent': true,
            'errorMessage': 'Minimum age of 1.'
          })
        )
      }

      return null;
    };
  }

}
