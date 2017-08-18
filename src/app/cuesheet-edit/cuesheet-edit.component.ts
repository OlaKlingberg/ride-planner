import {
  AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, AfterViewInit,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CuesheetService } from '../_services/cuesheet.service';
import { Cuesheet } from '../_models/cuesheet';
import { Cue } from '../_models/cue';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { AlertService } from '../_services/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { cuesheetEditAnimations } from './cuesheet-edit.component.animations'

@Component({
  selector: 'rp-cuesheet-edit',
  templateUrl: './cuesheet-edit.component.html',
  styleUrls: [ './cuesheet-edit.component.scss' ],
  animations: cuesheetEditAnimations
})
export class CuesheetEditComponent implements OnInit, AfterViewInit {
  public cuesheet: Cuesheet;
  public cueModel: any = {};
  public cuesheetModel: any = {};
  public total: number = 0;
  private cuesheetId: string = '';

  private cueToDelete: number = null;
  public cueToEdit: number = null;
  public cueToInsertBefore: number = null;

  public cuesheetNameInput: boolean = false;
  public cuesheetDescriptionInput: boolean = false;
  // public newCueRowState: string = 'display';
  private animationDuration: number = 2000; // Todo: Can I sync this automatically with the animation time?
  public focusTrigger = new EventEmitter<boolean>();
  public modalRef: BsModalRef;


  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService,
              private alertService: AlertService,
              private router: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('_id');

    this.checkForModalClose();

    this.getCuesheet(this.cuesheetId);

  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);

    $('#cue-form, #cue-form td, #cue-form td input, #cue-form td button').slideDown(1);

  }

  checkForModalClose() {
    this.modalService.onHide.subscribe((reason: string) => {
      this.cueToDelete = null;
    });
  }

  getCuesheet(cuesheetId) {
    console.log("getCuesheet()", cuesheetId);
    this.cuesheetService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          this.cuesheetModel.cuesheetName = cuesheet.name;
          this.cuesheetModel.cuesheetDescription = cuesheet.description;
          this.cuesheet = this.setTotalDistances(cuesheet);

          if ( this.cuesheet.cues.length === 0 ) {
            console.log("Apparently a new cue sheet!");
            this.cueModel.distance = '0';
            this.cueModel.turn = 'Start';
          }
        });
  }

  // Todo: Seems like an ugly solution. Isn't there a better way?
  setTotalDistances(cuesheet) {
    cuesheet.cues = cuesheet.cues.map(cue => {
      this.total += cue.distance;
      cue.total = this.total;
      cue.state = 'display';  // Used for animation.
      return cue;
    });

    return cuesheet;
  }

  editCuesheetName() {
    this.cuesheetNameInput = true;
    this.cuesheetDescriptionInput = false;
  }

  editCuesheetDescription() {
    this.cuesheetNameInput = false;
    this.cuesheetDescriptionInput = true;
  }

  hideInputFields() {
    this.cuesheetNameInput = false;
    this.cuesheetDescriptionInput = false;
  }

  cancelCuesheetUpdate() {
    this.cuesheetModel.cuesheetName = this.cuesheet.name;
    this.cuesheetModel.cuesheetDescription = this.cuesheet.description;
    this.hideInputFields();
  }

  updateCuesheet() {
    this.cuesheetService.updateCuesheet(this.cuesheetId, {
      name: this.cuesheetModel.cuesheetName,
      description: this.cuesheetModel.cuesheetDescription
    }).then(cuesheet => {
      this.cuesheetModel.cuesheetName = cuesheet.name;
      this.cuesheetModel.cuesheetDescription = cuesheet.description;
      this.hideInputFields();
    })
  }

  saveCue() {
    this.cueModel.distance = Math.round(this.cueModel.distance * 100);
    this.focusTrigger.emit(true);

    if ( this.cueToEdit === null ) {
      this.createCue();
    } else {
      this.updateCue();
    }
  }

  updateCue() {
    console.log("updateCue()");
    this.cuesheetService.updateCue(this.cuesheet.cues[ this.cueToEdit ]._id.toString(), this.cueModel).then((cue: Cue) => {
      console.log(cue);
      if ( !cue ) return; // Safety precaution.
      // Get the updated cuesheet.
      this.total = 0;
      this.cueToEdit = null;
      this.cueToInsertBefore = null;
      this.getCuesheet(this.cuesheetId);
    })
  }

  createCue() {
    const cueToInsertBeforeId = this.cueToInsertBefore ? this.cuesheet.cues[ this.cueToInsertBefore ]._id : null;

    this.cuesheetService.createCue(this.cuesheet._id, this.cueModel, cueToInsertBeforeId).then((cue: Cue) => {
      if ( !cue ) return; // Safety precaution.
      if ( this.cueToInsertBefore !== null ) {
        // The cue was inserted in the middle of cuesheet. Get the updated cuesheet.
        this.total = 0;
        this.getCuesheet(this.cuesheetId);
      } else {
        // The cue was added to the end of the cuesheet. Push the returned cue onto cuesheet.cues.
        this.total += cue.distance;
        cue.total = this.total;
        cue.state = 'display';
        this.cuesheet.cues.push(cue);
      }
      this.cueToInsertBefore = null;
    });
  }

  openCueDeletionModal(template: TemplateRef<any>, i: number) {
    this.cueToDelete = i;
    this.modalRef = this.modalService.show(template);
  }

  deleteCue() {
    const cueId = this.cuesheet.cues[ this.cueToDelete ]._id;
    // // this.cuesheetService.deleteCue(this.cuesheet._id, cueId).then((cue: Cue) => {
    this.cuesheet.cues[ this.cueToDelete ].state = 'removed'; // Removes the insert and delete buttons, before running the animation that removes the table row.
    setTimeout(() => {
      this.cuesheet.cues.splice(this.cueToDelete, 1);
      this.cueToDelete = null;
    }, 0);
    // });


  }

  insertCue(i) {
    $('#cue-form, #cue-form td, #cue-form td input, #cue-form td button').slideUp(300);
    setTimeout(() => {
      this.cueToInsertBefore = i;
      setTimeout(() => {
        $('#insert-form, #insert-form td, #insert-form td input, #insert-form td button').slideDown(300);
      }, 0);
    }, 350);




  }

  cancelCue() {
    $('#insert-form, #insert-form td, #insert-form td input, #insert-form td button').slideUp(300);

    setTimeout(() => {
      this.cueToInsertBefore = null;
      this.cueToEdit = null;
      this.cueToDelete = null;
      setTimeout(() => {
        $('#cue-form, #cue-form td, #cue-form td input, #cue-form td button').slideDown(300);
      }, 0);
    }, 350);









  }


  editCue(i) {
    this.cueToEdit = i;
    this.cueToInsertBefore = null;

    this.cueModel.distance = this.cuesheet.cues[ i ].distance / 100;
    this.cueModel.turn = this.cuesheet.cues[ i ].turn;
    this.cueModel.description = this.cuesheet.cues[ i ].description;

  }

  openCuesheetDeletionModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteCuesheet() {
    this.cuesheetService.deleteCuesheet(this.cuesheet._id).then((cuesheet: Cuesheet) => {
      if ( cuesheet ) {
        this.alertService.success(`The cue sheet ${cuesheet.name} has been deleted.`);
        this.router.navigate([ '/cuesheets' ]);
      } else {
        this.alertService.error("Oops! Something went wrong!");
      }
    });
  }

  // Todo: Do I need this here? I do need it on the login-form.
  syncModel() {

  }


}
