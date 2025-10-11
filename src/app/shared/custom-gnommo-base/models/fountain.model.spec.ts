import { 
  Fountain, 
  FountainType, 
  RefillType, 
  Features,
  FountainStatus,
  WeekDayStart,
  WeekDayEnd,
  Loc,
  GeoInfo,
  Address,
  MultiLanguageObject 
} from './fountain.model';

describe('Fountain Model', () => {
  it('should create an instance', () => {
    const fountain = new Fountain();
    expect(fountain).toBeTruthy();
    expect(fountain).toBeInstanceOf(Fountain);
  });

  it('should allow setting properties', () => {
    const fountain = new Fountain();
    fountain.name = 'Test Fountain';
    fountain.fountainType = FountainType.PUBLIC;
    fountain.fountainStatus = FountainStatus.ACTIVE;
    fountain.sharedAppleMaps = true;

    expect(fountain.name).toBe('Test Fountain');
    expect(fountain.fountainType).toBe(FountainType.PUBLIC);
    expect(fountain.fountainStatus).toBe(FountainStatus.ACTIVE);
    expect(fountain.sharedAppleMaps).toBe(true);
  });

  it('should handle FountainType enum', () => {
    expect(FountainType.PUBLIC).toBeDefined();
    expect(FountainType.RESTAURANT).toBeDefined();
    expect(FountainType.CAFE_BAR).toBeDefined();
    expect(FountainType.HOTEL_HOSTEL).toBeDefined();
    expect(FountainType.SHOP).toBeDefined();
    expect(FountainType.BANK).toBeDefined();
    expect(FountainType.OTHERS).toBeDefined();
  });

  it('should handle RefillType enum', () => {
    expect(RefillType.COUNTER_SERVICE).toBeDefined();
    expect(RefillType.DRINKING_FOUNTAIN).toBeDefined();
    expect(RefillType.WATER_CONTAINER).toBeDefined();
    expect(RefillType.BOTTLE_REFILL).toBeDefined();
  });

  it('should handle FountainStatus enum', () => {
    expect(FountainStatus.ACTIVE).toBeDefined();
    expect(FountainStatus.INACTIVE).toBeDefined();
    expect(FountainStatus.PENDING).toBeDefined();
    expect(FountainStatus.TEMP_CLOSED).toBeDefined();
  });

  it('should handle Features enum', () => {
    expect(Features.CHARGING_STATION).toBeDefined();
    expect(Features.HEALTHY_FOOD).toBeDefined();
    expect(Features.PET_FRIENDLY).toBeDefined();
    expect(Features.FREE_WIFI).toBeDefined();
  });

  it('should handle WeekDay enums', () => {
    expect(WeekDayStart.MONDAY).toBeDefined();
    expect(WeekDayEnd.SUNDAY).toBeDefined();
  });
});

describe('Loc Class', () => {
  it('should create an instance', () => {
    const loc = new Loc();
    expect(loc).toBeTruthy();
  });

  it('should allow setting coordinates', () => {
    const loc = new Loc();
    loc.type = 'Point';
    loc.coordinates = [40.4168, -3.7038]; // Madrid

    expect(loc.type).toBe('Point');
    expect(loc.coordinates).toEqual([40.4168, -3.7038]);
  });
});

describe('GeoInfo Class', () => {
  it('should create an instance', () => {
    const geoInfo = new GeoInfo();
    expect(geoInfo).toBeTruthy();
  });

  it('should allow setting location properties', () => {
    const geoInfo = new GeoInfo();
    geoInfo.country = 'Spain';
    geoInfo.locality = 'Madrid';
    geoInfo.postalCode = '28001';

    expect(geoInfo.country).toBe('Spain');
    expect(geoInfo.locality).toBe('Madrid');
    expect(geoInfo.postalCode).toBe('28001');
  });
});

describe('Address Class', () => {
  it('should create an instance', () => {
    const address = new Address();
    expect(address).toBeTruthy();
  });

  it('should allow setting address properties', () => {
    const address = new Address();
    address.name = 'Main Office';
    address.address = 'Gran Via 1';
    address.postalCode = '28001';
    address.town = 'Madrid';
    address.province = 'Madrid';
    address.country = 'Spain';

    expect(address.name).toBe('Main Office');
    expect(address.address).toBe('Gran Via 1');
    expect(address.town).toBe('Madrid');
  });
});

describe('MultiLanguageObject Class', () => {
  it('should create an instance', () => {
    const obj = new MultiLanguageObject();
    expect(obj).toBeTruthy();
  });

  it('should allow setting multilanguage strings', () => {
    const obj = new MultiLanguageObject();
    obj.es = 'Hola';
    obj.en = 'Hello';

    expect(obj.es).toBe('Hola');
    expect(obj.en).toBe('Hello');
  });
});
