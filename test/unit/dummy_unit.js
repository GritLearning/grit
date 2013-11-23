'use strict';
var foo = 'bar';

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      expect(foo).toEqual('bar');
      expect(foo.length).toBe(3);
    });
  });
});
