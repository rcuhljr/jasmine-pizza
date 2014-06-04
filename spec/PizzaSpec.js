describe("Pizza", function() {
  var pizza;

  beforeEach(function() {
    jasmine.Ajax.install();

    pizza = new Pizza();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  describe("sendOrder", function() {
    it("returns false for bad pizza", function() {
      pizza.sendOrder();

      expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://onlinepizza.se/api/rest?order.send");

      jasmine.Ajax.requests.mostRecent().response({
        status: "500",
        contentType: "text/plain",
        responseText: "Invalid pizza"
      });

      expect(pizza.orderSent()).toBe(false);
    });

    it("returns true for good pizza", function() {
      pizza.sendOrder();

      expect(jasmine.Ajax.requests.mostRecent().url).toBe("http://onlinepizza.se/api/rest?order.send");

      jasmine.Ajax.requests.mostRecent().response({
        status: "200",
        contentType: "text/plain",
        responseText: "OK"
      });

      expect(pizza.orderSent()).toBe(true);
    });
  });

  describe("foo", function() {
    it("should give a choice of styles", function() {
      expect(pizza.getStyles()).toContain("meat lovers");
      expect(pizza.getStyles()).toContain("veg head");
      expect(pizza.getStyles()).toContain("supreme");
    });
  });

  describe("toppings", function() {
    it("should have no toppings when no style and no extras given", function() {
      pizza.initialize();
      expect(pizza.getToppings().length).toBe(0);
    });

    it("should have only extras when no style and extras given", function() {
      var extras = ["pineapple", "edamame", "cheeseburger"]
      pizza.initialize(null, null, extras);
      
      expect(pizza.getToppings().length).toBe(extras.length);
      for (var i = 0; i < extras.length; i++) {
        expect(pizza.getToppings()).toContain(extras[i]);
      }
    });

    it("should have special toppings when given style and extras", function() {
      var extras = ["pineapple", "edamame", "cheeseburger"];
      pizza.initialize(null, "veg head", extras);
      
      expect(pizza.getToppings().length).toBe(7);
    });

    it("should have special toppings when given style", function() {
      var extras = ["pineapple", "edamame", "cheeseburger"];
      pizza.initialize(null, "veg head");
      
      expect(pizza.getToppings().length).toBe(4);
    });
  });

  describe("cost", function() {
    it("is detemined by size and number of toppings", function() {
      pizza.initialize(10, "supreme");
      expect(pizza.getToppings().length).toBe(4);
      expect(pizza.getCost()).toBe(7.00);
    });

    it("is detemined by size and number of toppings including extras", function() {
      pizza.initialize(18, "meat lovers", ["gyros", "panchetta"]);
      expect(pizza.getToppings().length).toBe(6);
      expect(pizza.getCost()).toBe(12.00);
    });
  });
});