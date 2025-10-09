import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CanDeactivateDialogService } from './can-deactivate-dialog.service';

describe('CanDeactivateDialogService', () => {
  let service: CanDeactivateDialogService;
  let mockDialog: any;

  beforeEach(() => {
    mockDialog = {
      open: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CanDeactivateDialogService,
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.get(CanDeactivateDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog with correct message and return observable', (done) => {
    const mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true))
    };

    mockDialog.open.mockReturnValue(mockDialogRef);

    const result$ = service.openDialog();

    result$.subscribe(result => {
      expect(mockDialog.open).toHaveBeenCalledWith(
        expect.any(Function), // DialogConfirmationComponent
        {
          data: {
            message: 'Hay cambios sin guardar, ¿Desea salir sin guardar los cambios de la página?'
          }
        }
      );
      expect(result).toBe(true);
      done();
    });
  });

  it('should emit false on dialog error', (done) => {
    const mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation((successFn, errorFn) => {
          errorFn('test error');
        })
      })
    };

    mockDialog.open.mockReturnValue(mockDialogRef);

    const result$ = service.openDialog();

    result$.subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });
});