export class CookieStorage {
  get = jest.fn();
  set = jest.fn();
  remove = jest.fn();
}

export class AuthService {
  getToken = jest.fn().mockReturnValue({ id: 'mock-token' });
  removeToken = jest.fn();
  expiresTime = jest.fn();
}

export class BaseService<T> {
  http: any;
  url: string;
  endpoint: string;
  
  constructor(http: any, url?: string, endpoint?: string) {
    this.http = http;
    this.url = url || '';
    this.endpoint = endpoint || '';
  }
  
  setApiConfig(url: string, endpoint: string) {
    this.url = url;
    this.endpoint = endpoint;
  }
  
  getById = jest.fn();
  getAll = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  createHttpHeaders = jest.fn().mockReturnValue({});
}

export class LoginBaseService<T> extends BaseService<T> {
  constructor(http: any, url?: string, endpoint?: string) {
    super(http, url, endpoint);
  }
  
  initializeConfig(url: string, endpoint: string) {
    this.url = url;
    this.endpoint = endpoint;
  }
  
  getCurrentUser = jest.fn();
  register = jest.fn();
  passwordRecovery = jest.fn();
  resetPassword = jest.fn();
  login = jest.fn();
}

export class BaseModel {
  _id?: string;
  
  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class AngularFoundationModule {
  static forRoot() {
    return {
      ngModule: AngularFoundationModule,
      providers: []
    };
  }
}
