describe('AndroidBridge', function () {
  describe('simplify', function () {
    before(function () {
      var Zombie = {};
      Zombie.invoker = function (foo, bar, baz, handlerName) {
        var a = [foo, {foobar: bar}, [baz]];
        var b = foo + bar + baz;
        setTimeout(function () {
          AndroidBridge.callHandler(handlerName, a, b);
        }, 0);
      };
      AndroidBridge.setInvoker(Zombie, 'invoker');
    });
    after(function () {
      AndroidBridge.releaseInvoker();
    });
    it('should work', function (done) {
      AndroidBridge.invoke('123', 'abc', 'efg', function (a, b) {
        expect(a).to.be.deep.equal(['123', {foobar: 'abc'}, ['efg']]);
        expect(b).to.be.deep.equal('123abcefg');
        done();
      });
    });
  });
  describe('scope', function () {
    before(function () {
      var Zombie = {};
      Zombie.invoker = function (foo, bar, baz, handlerName) {
        var a = [foo, {foobar: bar}, [baz]];
        var b = foo + bar + baz;
        AndroidBridge.callHandler(handlerName, a, b);
      };
      AndroidBridge.setInvoker(Zombie, 'invoker');
    });
    after(function () {
      AndroidBridge.releaseInvoker();
    });
    it('scope should work', function () {
      (function () {
        var tmp = '456';
        AndroidBridge.invoke('123', 'abc', 'efg', function (a, b) {
          expect(tmp).to.be.equal('456');
        });
      })();
    });
    it('context should work', function () {
      (function () {
        var Person = function () {
          this.name = 'yelo';
          return this;
        };
        Person.prototype.invoke = function () {
          var name = this.name;
          AndroidBridge.invoke('123', 'abc', 'efg', function (a, b) {
            expect(name).to.be.equal('yelo');
          });
        };
      })();
    });
  });
});
