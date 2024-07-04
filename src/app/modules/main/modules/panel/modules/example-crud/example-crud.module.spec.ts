import { ExampleCrudModule } from './example-crud.module';

describe('ExampleCrudModule', () => {
  let exampleCrudModule: ExampleCrudModule;

  beforeEach(() => {
    exampleCrudModule = new ExampleCrudModule();
  });

  it('should create an instance', () => {
    expect(exampleCrudModule).toBeTruthy();
  });
});
