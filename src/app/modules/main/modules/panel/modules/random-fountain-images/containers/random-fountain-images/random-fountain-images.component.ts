import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImagesRandomService } from 'src/app/shared/custom-gnommo-base/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { S3_URL } from 'src/app/shared/constants/constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-random-fountain-images',
  templateUrl: './random-fountain-images.component.html',
  styleUrls: ['./random-fountain-images.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RandomFountainImagesComponent implements OnInit {

  // Uploader
  public uploader: FileUploader = new FileUploader({ url: '', allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg'] });

  @ViewChild('uploaderInput') uploaderInput: ElementRef;

  imageToShow;

  // images = [
  //   'https://picsum.photos/id/500/798/1064',
  //   'https://picsum.photos/id/456/798/1064',
  //   'https://picsum.photos/id/142/798/1064',
  //   'https://picsum.photos/id/312/798/1064',
  //   'https://picsum.photos/id/23/798/1064',
  //   'https://picsum.photos/id/56/798/1064',
  //   'https://picsum.photos/id/112/798/1064',
  //   'https://picsum.photos/id/54/798/1064',
  //   'https://picsum.photos/id/98/798/1064',
  //   'https://picsum.photos/id/145/798/1064',
  //   'https://picsum.photos/id/200/798/1064',
  // ];

  images = [];

  constructor(
    private imagesRandomService: ImagesRandomService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getImages();
    this.handlerUploaders();
  }

  handlerUploaders() {
    this.uploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'fountain_image_' + new Date().getTime() + fileExtension;

      if (+(f.file.size / (1024 * 1024)).toFixed(2) >= 5) {
        this.toastr.error('La imagen pesa más de 5MB', 'Error');
        this.uploader.clearQueue();
      } else {
        this.uploadImage();
      }
    };
  }

  getImages() {
    this.ngxLoader.start();
    this.imagesRandomService.getAll().subscribe(
      response => {
        this.ngxLoader.stop();
        this.images = response;
      },
      error => {
        this.ngxLoader.stop();
      }
    );
  }

  showImage(content, image) {
    this.imageToShow = image;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true
    });
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  uploadImage() {
    this.ngxLoader.start();

    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    let imageFile = null;

    if (this.uploader.queue.length > 0) {
      imageFile = this.uploader.queue[0].file.rawFile;
    }

    const imageFormData = new FormData();

    const fileExtension = '.' + imageFile.name.split('.').pop();
    const fileName = 'fountain_' + new Date().getTime() + fileExtension;

    imageFormData.append('attachments', imageFile, fileName);

    this.imagesRandomService.uploadImages(imageFormData).subscribe(
      response => {
        this.ngxLoader.stop();
        this.getImages();
        this.uploader.clearQueue();
      },
      error => {
        this.ngxLoader.stop();
      }
    );
  }

  deleteImage(imageId) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: '160px',
      disableClose: true,
      autoFocus: false,
      data: {
        message: '¿Está seguro que desea eliminar la imagen seleccionada?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngxLoader.start();

        this.imagesRandomService.deleteImages(imageId).subscribe(response => {
          this.ngxLoader.stop();
          this.getImages();
        },
        error => {
          this.ngxLoader.stop();
        });
      }
    });
  }

  assignImages() {
    this.ngxLoader.start();

    this.imagesRandomService
    .assignToFountains()
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.toastr.success('Se han asignado las imágenes a las fuentes', 'Listo');
    },
    error => {
      this.ngxLoader.stop();
      this.toastr.error('Ha ocurrido un error al asignar las imágenes a las fuentes', 'Error');
    })
  }

}
