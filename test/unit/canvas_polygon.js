(function() {
  
  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }
  
  var REFERENCE_OBJECT = {
    'type':         'polygon', 
    'left':         0, 
    'top':          0, 
    'width':        10, 
    'height':       10, 
    'fill':         'rgb(0,0,0)', 
    'overlayFill':  null,
    'stroke':       null, 
    'strokeWidth':  1, 
    'scaleX':       1, 
    'scaleY':       1, 
    'angle':        0, 
    'flipX':        false, 
    'flipY':        false, 
    'opacity':      1, 
    'points':       getPoints()
  };
  
  module('Canvas.Polygon');
  
  test('constructor', function() {
    ok(Canvas.Polygon);
    
    var polygon = new Canvas.Polygon(getPoints());
    
    ok(polygon instanceof Canvas.Polygon);
    ok(polygon instanceof Canvas.Object);
    
    equals(polygon.type, 'polygon');
    same(getPoints(), polygon.get('points'));
  });
  
  test('complexity', function() {
    var polygon = new Canvas.Polygon(getPoints());
    ok(typeof polygon.complexity == 'function');
  });
  
  test('toObject', function() {
    var polygon = new Canvas.Polygon(getPoints());
    ok(typeof polygon.toObject == 'function');
    
    same(REFERENCE_OBJECT, polygon.toObject());
  });
  
  test('fromObject', function() {
    ok(typeof Canvas.Polygon.fromObject == 'function');
    var polygon = Canvas.Polygon.fromObject(REFERENCE_OBJECT);
    ok(polygon instanceof Canvas.Polygon);
    same(REFERENCE_OBJECT, polygon.toObject());
  });
  
  test('fromElement', function() {
    ok(typeof Canvas.Polygon.fromElement == 'function');
    
    var elPolygon = document.createElement('polygon');
    
    elPolygon.setAttribute('points', '10,12 20,22');
    
    var polygon = Canvas.Polygon.fromElement(elPolygon);
    
    ok(polygon instanceof Canvas.Polygon);
    same(REFERENCE_OBJECT, polygon.toObject());
    
    var elPolygonWithAttrs = document.createElement('polygon');
    elPolygonWithAttrs.setAttribute('points', '10,10 20,20 30,30 10,10');
    elPolygonWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elPolygonWithAttrs.setAttribute('fill-opacity', '0.34');
    elPolygonWithAttrs.setAttribute('stroke-width', '3');
    elPolygonWithAttrs.setAttribute('stroke', 'blue');
    elPolygonWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2)');
    
    var polygonWithAttrs = Canvas.Polygon.fromElement(elPolygonWithAttrs);
    var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];

    same(Canvas.base.object.extend(REFERENCE_OBJECT, {
      'width': 20, 
      'height': 20, 
      'fill': 'rgb(255,255,255)', 
      'stroke': 'blue', 
      'strokeWidth': 3, 
      'opacity': 0.34,
      'points': expectedPoints
    }), polygonWithAttrs.toObject());
    
    same([ 1, 0, 0, 1, -10, -20 ], polygonWithAttrs.get('transformMatrix'));
    
    var elPolygonWithoutPoints = document.createElement('polygon');
    
    var error;
    try {
      Canvas.Polygon.fromElement(elPolygonWithoutPoints);
    }
    catch(err) {
      error = err;
    }
    ok(error, 'missing points attribute should result in error');
    
    equals(Canvas.Polygon.fromElement(), null);
  });
})();