import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { ProductService } from '../../custom-gnommo-base/services';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-reward-codes',
  templateUrl: './dialog-reward-codes.component.html',
  styleUrls: ['./dialog-reward-codes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class DialogRewardCodesComponent implements OnInit {

  @Output('codeChanges') codeChanges: EventEmitter<any> = new EventEmitter<
    any
  >();

  constructor(
    public dialogRef: MatDialogRef<DialogRewardCodesComponent>,
    public dialog: MatDialog,
    public productService: ProductService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  onCloseAccept() { }

  onCloseReject() {
    this.dialogRef.close(false);
  }

  deleteCode(code) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '380px',
      disableClose: true,
      autoFocus: false,
      data: {
        message: '¿Esta seguro que quiere borrar el código seleccionado?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService
          .deleteRewardCodes(code, this.data.product._id)
          .subscribe(response => {
            this.codeChanges.emit();
            this.toastr.success('Código borrado con éxito', 'Listo');
          });
      }
    });
  }

  deleteAll() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '380px',
      disableClose: true,
      autoFocus: false,
      data: {
        message: '¿Esta seguro que quiere borrar todos los códigos?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService
          .deleteRewardCodes('', this.data.product._id)
          .subscribe(response => {
            this.codeChanges.emit();
            this.dialogRef.close();
            this.toastr.success('Códigos borrados con éxito', 'Listo');
          });
      }
    });
  }

  checkCodeIsRedeemed(code) {
    if (this.data.product.rewards) {
      for (var i = 0; i < this.data.product.rewards.length; i++) {
        if (code == this.data.product.rewards[i].rewardCode) {
          return true
        }
      }
    }

    return false
  }
}
