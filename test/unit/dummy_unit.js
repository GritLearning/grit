  var foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      expect(foo).to.be.a('string');
      expect(foo).to.equal('bar');
      expect(foo).to.have.length(3);
      expect(beverages).to.have.property('tea').with.length(3);
    })
  })
}) 
