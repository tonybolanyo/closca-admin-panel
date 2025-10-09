export class CookieStorage {
  get = jest.fn();
  set = jest.fn();
  remove = jest.fn();
}

export class AuthService {
  getToken = jest.fn().mockReturnValue({ id: 'mock-token' });
  removeToken = jest.fn();
}

export class BaseService<T> {
  http: any;
  url: string;
  endpoint: string;
  
  constructor(http: any, url: string, endpoint: string) {
    this.http = http;
    this.url = url;
    this.endpoint = endpoint;
  }
  
  getById = jest.fn();
  getAll = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  createHttpHeaders = jest.fn();
}
