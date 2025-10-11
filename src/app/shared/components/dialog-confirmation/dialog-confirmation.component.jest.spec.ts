import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { DialogConfirmationComponent } from './dialog-confirmation.component';

// Create a test component without styleUrls to avoid SCSS loading issues
@Component({
  standalone: false,
  selector: 'app-dialog-confirmation',
  template: `
    <mat-dialog-content>
        <div class="content">{{data.message}}</div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button class="btn cancel-btn" mat-button mat-dialog-close (click)="onCloseReject()">No</button>
      <button class="btn confirm-btn" mat-button (click)="onCloseAccept()">Si</button>
    </mat-dialog-actions>
  `
})
class TestDialogConfirmationComponent extends DialogConfirmationComponent { }

describe('DialogConfirmationComponent', () => {
  let component: TestDialogConfirmationComponent;
  let fixture: ComponentFixture<TestDialogConfirmationComponent>;
  let mockDialogRef: any;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    };

    mockData = {
      message: 'Are you sure you want to continue?'
    };

    TestBed.configureTestingModule({
      declarations: [TestDialogConfirmationComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    fixture = TestBed.createComponent(TestDialogConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data.message).toBe('Are you sure you want to continue?');
  });

  it('should close dialog with true when onCloseAccept is called', () => {
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when onCloseReject is called', () => {
    component.onCloseReject();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should display the message in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content').textContent).toContain('Are you sure you want to continue?');
  });

  it('should have Si and No buttons', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('No');
    expect(buttons[1].textContent.trim()).toBe('Si');
  });

  it('should call onCloseReject when No button is clicked', () => {
    // Mock the method to verify it's called
    component.onCloseReject = jest.fn();
    fixture.detectChanges();

    const noButton = fixture.nativeElement.querySelector('.cancel-btn');
    noButton.click();

    expect(component.onCloseReject).toHaveBeenCalled();
  });

  it('should call onCloseAccept when Si button is clicked', () => {
    // Mock the method to verify it's called
    component.onCloseAccept = jest.fn();
    fixture.detectChanges();

    const siButton = fixture.nativeElement.querySelector('.confirm-btn');
    siButton.click();

    expect(component.onCloseAccept).toHaveBeenCalled();
  });
});