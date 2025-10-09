import { CustomTableComponent } from './custom-table.component';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('CustomTableComponent', () => {
  let component: CustomTableComponent;
  let mockFormBuilder: FormBuilder;
  let mockDialog: any;

  const createColumn = (columnDef: string, filterType: string, formControlName: string) => ({
    columnDef,
    columnValue: columnDef,
    headerLabel: columnDef.toUpperCase(),
    columnType: 'STRING' as const,
    filter: {
      type: filterType as any,
      formControl: { name: formControlName },
      exists: true,
      sortFilterExists: false
    }
  });

  beforeEach(() => {
    mockFormBuilder = new FormBuilder();
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => of(true)
      })
    };

    component = new CustomTableComponent(mockFormBuilder, mockDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with displayedColumns from tableConfig', () => {
      component.tableConfig = {
        displayedColumns: ['id', 'name', 'actions'],
        columns: [],
        filterColumnEnabled: false,
        paginatorExists: true,
        buttonsConfig: null
      };

      component.ngOnInit();

      expect(component.displayedColumns).toEqual(['id', 'name', 'actions']);
    });

    it('should build displayedColumns from columns when displayedColumns not provided', () => {
      component.tableConfig = {
        columns: [
          createColumn('id', 'INPUT', 'id'),
          createColumn('name', 'INPUT', 'name')
        ],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: { deleteButton: true }
      };

      component.ngOnInit();

      expect(component.displayedColumns).toContain('id');
      expect(component.displayedColumns).toContain('name');
      expect(component.displayedColumns).toContain('actions');
      expect(component.displayedColumns).toContain('filter');
    });
  });

  describe('buildFilterForm', () => {
    it('should add INPUT filter controls', () => {
      component.tableConfig = {
        columns: [createColumn('name', 'INPUT', 'nameFilter')],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: null
      };

      component.buildFilterForm();

      expect(component.filterForm.get('nameFilter')).toBeTruthy();
      expect(component.filterForm.get('nameFilter').value).toBe('');
    });

    it('should add DROPDOWN filter controls', () => {
      component.tableConfig = {
        columns: [createColumn('status', 'DROPDOWN', 'statusFilter')],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: null
      };

      component.buildFilterForm();

      expect(component.filterForm.get('statusFilter')).toBeTruthy();
      expect(component.filterForm.get('statusFilter').value).toEqual([]);
    });

    it('should add DATE filter controls as disabled', () => {
      component.tableConfig = {
        columns: [createColumn('date', 'DATE', 'dateFilter')],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: null
      };

      component.buildFilterForm();

      expect(component.filterForm.get('dateFilter')).toBeTruthy();
      expect(component.filterForm.get('dateFilter').disabled).toBe(true);
    });
  });

  describe('onFilterMode', () => {
    it('should toggle filter mode', () => {
      component.tableConfig = {
        columns: [],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: null
      };
      component.buildFilterForm();
      
      const initialMode = component.filterMode;
      component.onFilterMode();
      
      expect(component.filterMode).toBe(!initialMode);
    });

    it('should reset filter form when turning off filter mode', () => {
      component.tableConfig = {
        columns: [createColumn('name', 'INPUT', 'nameFilter')],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: null
      };
      component.buildFilterForm();
      component.filterForm.patchValue({ nameFilter: 'test' });
      component.filterMode = true;
      
      component.onFilterMode();
      
      expect(component.filterForm.get('nameFilter').value).toBeNull();
    });
  });

  describe('getCellValue', () => {
    it('should return string value', () => {
      const element = { name: 'Test' };
      const column = { columnValue: 'name', columnType: 'STRING' };
      
      const result = component.getCellValue(element, column);
      
      expect(result).toBe('Test');
    });

    it('should format date value', () => {
      const element = { date: '2023-01-15' };
      const column = { columnValue: 'date', columnType: 'DATE' };
      
      const result = component.getCellValue(element, column);
      
      expect(result).toBe('15/01/2023');
    });

    it('should return null for empty date', () => {
      const element = { date: null };
      const column = { columnValue: 'date', columnType: 'DATE' };
      
      const result = component.getCellValue(element, column);
      
      expect(result).toBeNull();
    });

    it('should return S3 URL for image', () => {
      const element = { image: 'test-image.jpg' };
      const column = { columnValue: 'image', columnType: 'IMG' };
      
      const result = component.getCellValue(element, column);
      
      expect(result).toContain('test-image.jpg');
    });

    it('should return default image for null image value', () => {
      const element = { image: null };
      const column = { columnValue: 'image', columnType: 'IMG' };
      
      const result = component.getCellValue(element, column);
      
      expect(result).toContain('default-image.jpg');
    });
  });

  describe('getJsonValue', () => {
    it('should get nested property value', () => {
      const model = { user: { name: 'John' } };
      const path = 'user.name';
      
      const result = component.getJsonValue(model, path);
      
      expect(result).toBe('John');
    });

    it('should get top level property', () => {
      const model = { name: 'Test' };
      const path = 'name';
      
      const result = component.getJsonValue(model, path);
      
      expect(result).toBe('Test');
    });
  });

  describe('paginate', () => {
    it('should emit pagination values', () => {
      const emitSpy = jest.spyOn(component.sendPaginate, 'emit');
      const event = { pageSize: 10, pageIndex: 2 };
      
      component.paginate(event);
      
      expect(component.paginator.limit).toBe(10);
      expect(component.paginator.pageIndex).toBe(2);
      expect(component.paginator.skip).toBe(20);
      expect(emitSpy).toHaveBeenCalledWith(component.paginator);
    });
  });

  describe('sortData', () => {
    beforeEach(() => {
      component.tableConfig = {
        columns: [createColumn('name', 'INPUT', 'nameFilter')],
        filterColumnEnabled: true,
        paginatorExists: true,
        buttonsConfig: null
      };
      component.buildFilterForm();
    });

    it('should set sortValues with "-" prefix for ascending sort', () => {
      const emitSpy = jest.spyOn(component.formChanges, 'emit');
      const event = { direction: 'asc', active: 'name' };
      
      component.sortData(event);
      
      expect(component.sortValues).toBe('-name');
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should set sortValues without prefix for descending sort', () => {
      const emitSpy = jest.spyOn(component.formChanges, 'emit');
      const event = { direction: 'desc', active: 'name' };
      
      component.sortData(event);
      
      expect(component.sortValues).toBe('name');
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('selectElement', () => {
    it('should emit selectedItems event', () => {
      const emitSpy = jest.spyOn(component.selectedItems, 'emit');
      
      component.selectElement();
      
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onToggleAllItems', () => {
    it('should emit toggleAllItems event with current selection state', () => {
      const emitSpy = jest.spyOn(component.toggleAllItems, 'emit');
      component.isSelectAllItems = true;
      
      component.onToggleAllItems();
      
      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onCustomView', () => {
    it('should emit sendCustomViewButton event with element', () => {
      const emitSpy = jest.spyOn(component.sendCustomViewButton, 'emit');
      const element = { id: 1 };
      
      component.onCustomView(element);
      
      expect(emitSpy).toHaveBeenCalledWith(element);
    });
  });

  describe('onCustomEdit', () => {
    it('should emit sendCustomEditButton event with element', () => {
      const emitSpy = jest.spyOn(component.sendCustomEditButton, 'emit');
      const element = { id: 1 };
      
      component.onCustomEdit(element);
      
      expect(emitSpy).toHaveBeenCalledWith(element);
    });
  });
});
