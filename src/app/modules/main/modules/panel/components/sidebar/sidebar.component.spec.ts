import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarComponent } from './sidebar.component';
import { MenuItem } from '../../../../../../shared/interfaces/menu-item.interface';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ SidebarComponent ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty sidebarItems array', () => {
    expect(component.sidebarItems).toEqual([]);
  });

  it('should accept sidebarItems as input', () => {
    const mockItems: MenuItem[] = [
      { label: 'Test', routerLink: '/test' }
    ];
    component.sidebarItems = mockItems;
    expect(component.sidebarItems).toEqual(mockItems);
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should call ngOnDestroy without errors', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
