import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import {
  PlainGalleryConfig, PlainGalleryStrategy, LineLayout,
  Description, DescriptionStrategy, GalleryService, Image
} from '@ks89/angular-modal-gallery';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { NgOption } from '@ng-select/ng-select';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import moment from 'moment';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  selector: 'app-example-crud-detail',
  templateUrl: './example-crud-detail.component.html',
  styleUrls: ['./example-crud-detail.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ExampleCrudDetailComponent implements OnInit {
  action: string;
  crudForm: FormGroup;

  listItems = [];
  options: NgOption[];

  // ModalRef
  private modalRef: NgbModalRef;

  // Uploader
  public uploader: FileUploader = new FileUploader({ url: '' });
  // Gallery
  plainGalleryRow: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout: new LineLayout({ width: '225px', height: '116px' }, { length: 3, wrap: true }, 'flex-start'),
    advanced: { aTags: true, additionalBackground: '50% 50%/cover' }
  };
  customDescription: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN,
  };

  // --> Images
  // Used to view delete button of gallery
  openImageModalWindow = false;

  galleryImg: Image[] = [];

  // --> ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;



  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>,
  ) {
    this.dateAdapter.setLocale('es-es');
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.buildRequestForm(false);
    this.listItems = [{ id: '1', name: 'list item 1' },
    { id: '2', name: 'list item 2' },
    { id: '3', name: 'list item 3' },
    { id: '4', name: 'list item 4' }];
    this.options = [
      { value: '1', label: 'opcion prueba 1' },
      { value: '2', label: 'opcion prueba 2' },
      { value: '3', label: 'opcion prueba 3' },
      { value: '4', label: 'opcion prueba 4' },
      { value: '5', label: 'opcion prueba 5' },
      { value: '6', label: 'opcion prueba 6' }];
  }

  ngOnInit() {
    this.galleryImg = [
      new Image(1, {
      img: '../../../../../assets/images/default-image.jpg',
      title: '1',
      description: ''
    },
      {
        img: '../../../../../assets/images/default-image.jpg',
        title: '1',
        description: ''
      }),
      new Image(2, {
        img: '../../../../../assets/images/default-image.jpg',
        title: '2',
        description: ''
      },
        {
          img: '../../../../../assets/images/default-image.jpg',
          title: '2',
          description: ''
        }),
    ];

    this.crudForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
      this.geoCodeHandler(values.incidentAddress);
      this.buildHourRange(this.crudForm.getRawValue());
    });
  }

  buildRequestForm(disabled) {
    this.crudForm = this.formBuilder.group({
      title: [{ value: null, disabled: disabled }, [Validators.required]],
      description: [{ value: null, disabled: disabled }],
      address: [{ value: null, disabled: disabled }],
      date: [{ value: new Date(), disabled: true }],
      optionId: [{ value: new Array<string>(), disabled: disabled }, [Validators.required]],
      itemId: [{ value: null, disabled: disabled }, [Validators.required]],
      status: [{ value: 'PENDING', disabled: disabled }],
      startDate: [{ value: new Date(), disabled: true }, [Validators.required]],
      startHour: [{ hour: moment().hours(), minute: moment().minutes() }],
      finishDate: [{ value: new Date(), disabled: true }, [Validators.required]],
      finishHour: [{ hour: moment().hours(), minute: moment().minutes() }],

    });
  }

  openGallery() {
    this.galleryService.openGallery(0, 0);
  }

  closeGallery() {
    this.galleryService.closeGallery(0);
  }
  onGetCurrentImageIndex(event) {
  }
  onCloseImageModal(event) {
    this.openImageModalWindow = false;
  }

  showDialogDeleteImage() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: '160px',
      disableClose: true,
      autoFocus: false,
      data: { message: '¿Está seguro que desea eliminar la imagen seleccionada?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openModal(content) {
    this.modalRef = this.modalService.open(content, { centered: true });
  }


  geoCodeHandler(address) {
  }

  buildHourRange(values) {
    const startDate = moment(values.startDate);
    const finishDate = moment(values.finishDate);
    startDate.set({ 'hour': values.startHour.hour, 'minute': values.startHour.minute });
    finishDate.set({ 'hour': values.finishHour.hour, 'minute': values.finishHour.minute });

  }

  getImage(fileKey): string {
    return '';
    // return filekey;
    // const encodeFileKey = encodeURIComponent(fileKey);
    // tslint:disable-next-line:max-line-length
    // return `${environment.apiUrl}/api/requests/get-file-images?fileKey=${encodeFileKey}&access_token=${this.loopBackAuth.getAccessTokenId()}`;
  }

  changeLocalImage(event) {

  }
}
