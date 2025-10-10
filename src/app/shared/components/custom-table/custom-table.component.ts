import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { ROUTER_DEFINITIONS } from '../../constants/router-definitions';
import { TableConfig } from '../../interfaces/tableConfig.interface';
import * as _ from 'lodash';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { S3_URL } from '../../constants/constants';
@Component({
    selector: 'app-custom-table',
    templateUrl: 'custom-table.component.html',
    styleUrls: ['./custom-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CustomTableComponent implements OnInit {
    @Input('validateStatusButton') validateStatusButton = false;
    @Input('customViewButton') customViewButton = false;
    @Input('customEditButton') customEditButton = false;
    @Input('dataSource') dataSource = [];
    @Input('tableConfig') tableConfig: TableConfig;
    @Input('paginatorExists') paginatorExists = true;

    // PAGINATOR
    @Input('paginator') paginator = {
        length: 0,
        limit: 10,
        pageIndex: 0,
        skip: 0,
        pageSizeOptions: [2, 5, 10, 25, 100]
    };


    @Input('isSelectAllItems') isSelectAllItems = false;

    // FILTER
    filterForm: UntypedFormGroup;
    filterMode = true;

    sortValues = null;
    filterFormValues;

    // TABLE COLUMNS LIST
    displayedColumns =
        ['id', 'realName', 'address', 'birthDate', 'actions', 'filter'];

    routerDefinitions = ROUTER_DEFINITIONS;


    @Output('formChanges') formChanges: EventEmitter<any> = new EventEmitter<any>();
    @Output('sendPaginate') sendPaginate: EventEmitter<any> = new EventEmitter<any>();
    @Output('deleteItem') deleteItem: EventEmitter<any> = new EventEmitter<any>();
    @Output('validateFountain') validateFountain: EventEmitter<any> = new EventEmitter<any>();

    @Output('selectedItems') selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output('toggleAllItems') toggleAllItems: EventEmitter<any> = new EventEmitter<any>();

    @Output('sendCustomViewButton') sendCustomViewButton: EventEmitter<any> = new EventEmitter<any>();
    @Output('sendCustomEditButton') sendCustomEditButton: EventEmitter<any> = new EventEmitter<any>();

    constructor(private formBuilder: UntypedFormBuilder,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        if (this.tableConfig.displayedColumns) {
            this.displayedColumns = this.tableConfig.displayedColumns;
        } else {
            this.displayedColumns = this.tableConfig.columns.map(x => x.columnDef);

            if (this.tableConfig.buttonsConfig) {
                this.displayedColumns.push('actions');
            }
            if (this.tableConfig.filterColumnEnabled) {
                this.displayedColumns.push('filter');
            }
        }



        this.buildFilterForm();
        this.filterForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
            this.filterFormValues = { values: values, rawValues: this.filterForm.getRawValue(), sortValues: this.sortValues };
            this.formChanges.emit(this.filterFormValues);
        });
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({});
        this.tableConfig.columns.forEach((column) => {
            switch (column.filter.type) {
                case 'DATE':
                    this.filterForm.addControl(column.filter.formControl.name, new UntypedFormControl(
                        { value: null, disabled: true }));
                    break;
                case 'DROPDOWN':
                    this.filterForm.addControl(column.filter.formControl.name, new UntypedFormControl([]));
                    break;
                case 'INPUT':
                    this.filterForm.addControl(column.filter.formControl.name, new UntypedFormControl(''));
                    break;
                default:
                    this.filterForm.addControl(column.filter.formControl.name, new UntypedFormControl(''));
                    break;
            }
        });
    }

    onFilterMode() {
        this.filterMode = !this.filterMode;
        if (!this.filterMode) {
            this.filterForm.reset();
        }
    }
    openDeleteDialog(item) {
        let message = '¿Está seguro que desea eliminar el elemento seleccionado de la base de datos?';
        if (this.tableConfig.buttonsConfig && this.tableConfig.buttonsConfig.deleteButtonMessage) {
            message = this.tableConfig.buttonsConfig.deleteButtonMessage;
        }
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            width: '388px',
            height: 'auto',
            disableClose: true,
            autoFocus: false,
            data: { message: message },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // true
                this.deleteItem.emit(item);
            }
        });
    }

    openDeleteUserDialog(item) {
        let message = '¿Está seguro que desea eliminar este usuario? Las fuentes asignadas a este usuario se asignarán al administrador';
        if (this.tableConfig.buttonsConfig && this.tableConfig.buttonsConfig.deleteUserButtonMessage) {
            message = this.tableConfig.buttonsConfig.deleteUserButtonMessage;
        }
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            width: '388px',
            height: 'auto',
            disableClose: true,
            autoFocus: false,
            data: { message: message },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // true
                this.deleteItem.emit(item);
            }
        });
    }

    openDeleteChallengeSuscriptionDialog(item) {
        let message = '¿Está seguro que desea pasar esta suscripcióna fallida?';
        if (this.tableConfig.buttonsConfig && this.tableConfig.buttonsConfig.deleteUserButtonMessage) {
            message = this.tableConfig.buttonsConfig.deleteUserButtonMessage;
        }
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            width: '388px',
            height: 'auto',
            disableClose: true,
            autoFocus: false,
            data: { message: message },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // true
                this.deleteItem.emit(item);
            }
        });
    }

    openValidationDialog(item) {
        let message = '¿Está seguro que desea activar la fuente seleccionada?';
        if (this.tableConfig.buttonsConfig && this.tableConfig.buttonsConfig.validateButtonMessage) {
            message = this.tableConfig.buttonsConfig.validateButtonMessage;
        }
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            width: '388px',
            height: 'auto',
            disableClose: true,
            autoFocus: false,
            data: { message: message },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // true
                this.validateFountain.emit(item);
            }
        });
    }

    getJsonValue(model, path) {
        path = path || '';
        model = model || {};
        const parts = path.split('.');
        if (parts.length > 1 && typeof model[parts[0]] === 'object') {
            return this.getJsonValue(model[parts[0]], parts.splice(1).join('.'));
        } else {
            return model[parts[0]];
        }
    }
    getCellValue(element, column) {
        let cellValue: any;
        const value = this.getJsonValue(element, column.columnValue);

        switch (column.columnType) {
            case 'STRING':
                cellValue = value;
                break;

            case 'DATE':
                if (value) {
                    cellValue = moment(value).format('DD/MM/YYYY');
                } else {
                    cellValue = null;
                }
                break;

            case 'IMG':
                if (value && value !== null) {
                    cellValue = S3_URL + value;
                } else {
                    cellValue = './../../../../../../../../../assets/images/default-image.jpg';
                }
                break;
            case 'LINK':
                cellValue = value;
                break;
            case 'CHECKBOX':
                cellValue = value;
                break;
            default:
                cellValue = value;
                break;
        }
        return cellValue;
    }

    getId(element, column) {
        let id: any;
        const value = this.getJsonValue(element, column.columnLinkId);
        id = value;

        return id;
    }

    getDropdownVal(element, val) {
        let dropdownVal = '';
        if (element && val) {
            dropdownVal = element[val];
        }
        return dropdownVal;
    }

    paginate(event) {
        this.paginator.limit = event.pageSize;
        this.paginator.skip = event.pageSize * event.pageIndex;
        this.paginator.pageIndex = event.pageIndex;
        this.sendPaginate.emit(this.paginator);
    }

    sortData(event) {
        if (event.direction === 'asc') {
            this.sortValues = '-' + event.active;
        } else {
            this.sortValues = event.active;
        }
        this.filterFormValues = { values: this.filterForm.value, rawValues: this.filterForm.getRawValue(), sortValues: this.sortValues };
        this.formChanges.emit(this.filterFormValues);
    }


    selectElement() {
        this.selectedItems.emit();
    }

    onToggleAllItems() {
        this.toggleAllItems.emit(this.isSelectAllItems);
    }

    onCustomView(element) {
        this.sendCustomViewButton.emit(element);
    }

    onCustomEdit(element) {
        this.sendCustomEditButton.emit(element);
    }
}
