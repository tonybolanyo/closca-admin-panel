import { MAP_STYLES } from './agm-styles';

describe('AGM Styles Constants', () => {
  it('should be defined as an array', () => {
    expect(MAP_STYLES).toBeDefined();
    expect(Array.isArray(MAP_STYLES)).toBe(true);
  });

  it('should have style entries', () => {
    expect(MAP_STYLES.length).toBeGreaterThan(0);
  });

  it('should have valid Google Maps style format', () => {
    MAP_STYLES.forEach(style => {
      expect(style).toBeDefined();
      expect(typeof style).toBe('object');
      
      // Each style should have at least one property (elementType, featureType, or stylers)
      const hasValidProperty = 
        style.hasOwnProperty('elementType') ||
        style.hasOwnProperty('featureType') ||
        style.hasOwnProperty('stylers');
      
      expect(hasValidProperty).toBe(true);
    });
  });

  it('should have stylers array in each style', () => {
    MAP_STYLES.forEach(style => {
      if (style.stylers) {
        expect(Array.isArray(style.stylers)).toBe(true);
        expect(style.stylers.length).toBeGreaterThan(0);
      }
    });
  });

  it('should include geometry color customization', () => {
    const geometryStyle = MAP_STYLES.find(style => 
      style.elementType === 'geometry' && !style.featureType
    );
    expect(geometryStyle).toBeDefined();
    expect(geometryStyle?.stylers).toBeDefined();
  });

  it('should hide labels by default', () => {
    const labelsStyle = MAP_STYLES.find(style => 
      style.elementType === 'labels' && !style.featureType
    );
    expect(labelsStyle).toBeDefined();
    expect(labelsStyle?.stylers).toBeDefined();
    
    const visibilityStyler = labelsStyle?.stylers?.find(s => s.hasOwnProperty('visibility'));
    expect(visibilityStyler).toBeDefined();
    expect((visibilityStyler as any)?.visibility).toBe('off');
  });

  it('should customize water color', () => {
    const waterStyle = MAP_STYLES.find(style => 
      style.featureType === 'water' && style.elementType === 'geometry'
    );
    expect(waterStyle).toBeDefined();
    expect(waterStyle?.stylers).toBeDefined();
    
    const colorStyler = waterStyle?.stylers?.find(s => s.hasOwnProperty('color'));
    expect(colorStyler).toBeDefined();
    expect((colorStyler as any)?.color).toBe('#00ACEC');
  });

  it('should customize road styles', () => {
    const roadStyles = MAP_STYLES.filter(style => 
      style.featureType && style.featureType.startsWith('road')
    );
    expect(roadStyles.length).toBeGreaterThan(0);
  });

  it('should hide POI (Points of Interest)', () => {
    const poiStyle = MAP_STYLES.find(style => 
      style.featureType === 'poi' && !style.elementType
    );
    expect(poiStyle).toBeDefined();
    
    const visibilityStyler = poiStyle?.stylers?.find(s => s.hasOwnProperty('visibility'));
    expect(visibilityStyler).toBeDefined();
    expect((visibilityStyler as any)?.visibility).toBe('off');
  });

  it('should hide transit information', () => {
    const transitStyle = MAP_STYLES.find(style => 
      style.featureType === 'transit' && !style.elementType
    );
    expect(transitStyle).toBeDefined();
    
    const visibilityStyler = transitStyle?.stylers?.find(s => s.hasOwnProperty('visibility'));
    expect(visibilityStyler).toBeDefined();
    expect((visibilityStyler as any)?.visibility).toBe('off');
  });

  it('should customize administrative features', () => {
    const adminStyles = MAP_STYLES.filter(style => 
      style.featureType && style.featureType.startsWith('administrative')
    );
    expect(adminStyles.length).toBeGreaterThan(0);
  });

  it('should have stylers with valid properties', () => {
    MAP_STYLES.forEach(style => {
      if (style.stylers) {
        style.stylers.forEach(styler => {
          expect(typeof styler).toBe('object');
          
          // Valid styler properties
          const validProperties = ['color', 'visibility', 'weight', 'gamma', 'lightness', 'saturation'];
          const stylerKeys = Object.keys(styler);
          
          stylerKeys.forEach(key => {
            expect(validProperties.some(prop => key === prop || key.includes(prop))).toBe(true);
          });
        });
      }
    });
  });
});
