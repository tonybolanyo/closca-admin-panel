import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;

  beforeEach(() => {
    component = new FooterComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
