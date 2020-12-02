import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'frontend-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css']
})
export class StatusEditComponent implements OnInit {
  private statusUpdateForm: FormGroup;
  private id: number;
  submitted = false;
  formMessage: string;

  statusList=['At Work', 'On Leave', 'Inactive'];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private routes: Router
  ) { }

  get status() {
    return this.statusUpdateForm.get('status');
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      )
    this.statusUpdateForm = this.formBuilder.group({
      status: ['', Validators.required]
    });
  }
  onUpdate() {
    this.submitted = true;
  }

  onBack() {
    this.routes.navigate(['../detail'], {relativeTo: this.route})
  }
  onHandleError() {
    this.formMessage = null;
    this.routes.navigate(['../detail'], {relativeTo: this.route})
  }
}
