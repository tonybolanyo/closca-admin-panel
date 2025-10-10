import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';

@Component({
  selector: 'app-example-crud-list',
  templateUrl: './example-crud-list.component.html',
  styleUrls: ['./example-crud-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExampleCrudListComponent implements OnInit {
  items;

  // FILTER
  filter: any = {};
  filterForm;
  filterMode = false;
  // FILTER

  dropdownItems = [
    { name: 'dropdownItem1', id: '1' },
    { name: 'dropdownItem2', id: '2' },
    { name: 'dropdownItem3', id: '3' },
    { name: 'dropdownItem4', id: '4' },
    { name: 'dropdownItem5', id: '5' }
  ];

  // START PAGINATOR
  paginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  routerDefinitions = ROUTER_DEFINITIONS;

  public uploader: FileUploader = new FileUploader({ url: '' });

// START CONFIG TABLE


  tableConfig: TableConfig = {
    // displayedColumns: ['birthDate', 'marca', 'testNameComplete', 'name'],
    paginatorExists: true,
    filterColumnEnabled: true,
    buttonsConfig: {
      viewButton: true,
      editButton: true,
      newButton: true,
      deleteButton: true,
      baseRouterLink: this.routerDefinitions.crud
    },
    columns: [
      {
        columnDef: 'marca',
        columnValue: 'brand.img.src',
        columnType: 'IMG',
        headerLabel: 'Brand-image',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'ID',
          formControl: {
            name: 'id'
          },
          sortFilterExists: false,
        }
      },
      {
        columnDef: 'name',
        columnValue: 'name',
        columnType: 'STRING',
        headerLabel: 'NombreP',
        filter: {
          exists: true,
          type: 'DROPDOWN',
          placeholder: 'Nombre',
          formControl: {
            name: 'name'
          },
          sortFilterExists: false,
          dropdownConfig: {
            items: this.dropdownItems,
            label: 'name',
            value: 'id'
          }
        }
      },
      {
        columnDef: 'testNameComplete',
        columnValue: 'test.name.complete',
        columnType: 'STRING',
        headerLabel: 'Nombre',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Test',
          formControl: {
            name: 'name'
          },
          sortFilterExists: false,
        }
      },
      {
        columnDef: 'birthDate',
        columnValue: 'birthDate',
        columnType: 'DATE',
        headerLabel: 'Fecha',
        filter: {
          exists: false,
          type: 'DATE',
          placeholder: 'Fecha',
          formControl: {
            name: 'name'
          },
          sortFilterExists: false,
        }
      },
    ]
  };
  // END CONFIG TABLE

  constructor(
    private toastr: ToastrService,
  ) {
    this.getItems();
  }

  ngOnInit() {

  }

  filterFormChanges(values) {
    this.resetPaginate();
  }

  getItems() {
    this.items = [
      {
        brand: {
          img: {
            src: '/closca/brands/nike.png'
          }
        },
        id: '1',
        name: 'nombre1',
        test: {
          name: {
            complete: '123'
          }
        },
        address: 'C/ Inventada',
        city: 'Valencia',
        birthDate: new Date(),
        email: 'user1@gnommo.com',
        dropdownItem: { name: 'dropdownItem1', id: '1' }

      }
    ];

    this.paginator.length = this.items.length;
  }

  deleteItem(item) {
    this.toastr.success('El item ha sido borrado correctamente', 'Listo');

  }

  paginate(value) {
    this.filter['limit'] = this.paginator.limit;
    this.filter['skip'] = this.paginator.skip;
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.filter['limit'] = this.paginator.limit;
    this.filter['skip'] = this.paginator.skip;
  }

}
