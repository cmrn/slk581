let assert = require('chai').assert;

require('./src/slkDecoder.js'); // loads constructer into global variable SlkDecoder

describe('SlkDecoder', () => {
  describe('#decode()', () => {
    describe('.gender', () => {
      it('decodes gender ID "1" as "Male"', () => {
        let decoder = new SlkDecoder([], [], []);
        assert.equal(decoder.decode("AAABB112233331").gender, "Male");
      });

      it('decodes gender ID "2" as "Female"', () => {
        let decoder = new SlkDecoder([], [], []);
        assert.equal(decoder.decode("AAABB112233332").gender, "Female");
      });
    });

    describe('.dob', () => {
      it('formats DOB into DD/MM/YYYY format', () => {
        let decoder = new SlkDecoder([], [], []);
        assert.equal(decoder.decode("AAABB112233332").dob, "11/22/3333");
      });
    });

    describe('.firstNames', () => {
      it('finds all matching names', () => {
        let firstNames = ["WALTER", "RALPH", "DALE", "CALVIN"]; // should all match the SLK
        let decoder = new SlkDecoder(firstNames, [], []);

        let decoded = decoder.decode('URBAL241019541');
        assert.sameMembers(decoded.firstNames, firstNames);
      });

      it('excludes non matching names', () => {
        let firstNames = ["BOBBY"];
        let decoder = new SlkDecoder(firstNames, [], []);

        let decoded = decoder.decode('URBAL241019541');
        assert.notInclude(decoded.firstNames, "BOBBY");
      });

      it('uses correct name list based on gender ID', () => {
        let namesOne = ["WALTER"];
        let namesTwo = ["VALERIE"];
        let decoder = new SlkDecoder(namesOne, namesTwo, []);
        assert.include(decoder.decode('URBAL241019541').firstNames, "WALTER");
        assert.include(decoder.decode('URBAL241019542').firstNames, "VALERIE");
      });
    });

    describe('.lastNames', () => {
      it('finds all matching names', () => {
        let lastNames = ["TURNBULL", "TURNBOW", "HURLBURT", "HURLBUT"];
        let decoder = new SlkDecoder([], [], lastNames);

        let results = decoder.decode('URBAL241019541').lastNames;
        assert.sameMembers(results, lastNames);
      });

      it('excludes non matching names', () => {
        let lastNames = ["SMITH"];
        let decoder = new SlkDecoder([], [], lastNames);

        let results = decoder.decode('URBAL241019541').lastNames;
        assert.notInclude(results, "SMITH");
      });
    });
  });

  describe('#isValid()', () => {
    it("requires length 13 SLKs", () => {
      assert.isFalse(SlkDecoder.isValid("AAABB01011900"));
      assert.isFalse(SlkDecoder.isValid("AAABB0101190011"));
    });

    describe("name", () => {
      it("allows '2' placeholder in name key", () => {
        assert.isTrue(SlkDecoder.isValid("AA2BB010119901"));
        assert.isTrue(SlkDecoder.isValid("AAAB2010119901"));
      });

      it("disallows other numbers in name key", () => {
        assert.isFalse(SlkDecoder.isValid("AA1BB010119901"));
        assert.isFalse(SlkDecoder.isValid("AAAB3010119901"));
      });
    });

    describe("gender", () => {
      it("disallows letters in gender ID", () => {
        assert.isFalse(SlkDecoder.isValid("AAABB32011990X"));
      });

      it("allows gender IDs 1 and 2", () => {
        assert.isTrue(SlkDecoder.isValid("AAABB010119901")); // gender 1
        assert.isTrue(SlkDecoder.isValid("AAABB010119902")); // gender 2
      });
    });

    describe("dob", () => {
      it("allows valid dates of birth", () => {
        assert.isTrue(SlkDecoder.isValid("AAABB010119001"));
        assert.isTrue(SlkDecoder.isValid("AAABB311220161"));
      });

      it("disallows invalid days of birth", () => {
        assert.isFalse(SlkDecoder.isValid("AAABB320119901")); // day = 32
        assert.isFalse(SlkDecoder.isValid("AAABB000119901")); // day = 00
      });

      it("disallows invalid months of birth", () => {
        assert.isFalse(SlkDecoder.isValid("AAABB011319901")); // month = 13
        assert.isFalse(SlkDecoder.isValid("AAABB010019901")); // month = 00
      });

      it("disallows letters in date of birth", () => {
        let slks = ["AAABBX10119901", "AAABB0X0119901", "AAABB01X119901",
                    "AAABB010X19901", "AAABB0101X9901", "AAABB01011X901",
                    "AAABB010119X01", "AAABB0101199X1"]; // X in each position
        slks.forEach(slk => assert.isFalse(SlkDecoder.isValid(slk)));
      });
    });
  });

  describe("#createSlk()", () => {
    it("creates a correct SLK", () => {
      let slk = SlkDecoder.createSlk("Malcolm", "Turnbull", "24101954", "1");
      assert.equal(slk, "URBAL241019541");
    });

    it("pads short last names with 2s", () => {
      let slk = SlkDecoder.createSlk("Malcolm", "Zu", "24101954", "1");
      assert.equal(slk, "U22AL241019541");
    });

    it("pads short first names with 2s", () => {
      let slk = SlkDecoder.createSlk("Ed", "Turnbull", "24101954", "1");
      assert.equal(slk, "URBD2241019541");
    });

    it("handles non-alphabetic characters in first name", () => {
      let slk = SlkDecoder.createSlk("Hi-Ho", "Turnbull", "24101954", "1");
      assert.equal(slk, "URBIH241019541");
    });

    it("handles non-alphabetic characters in last name", () => {
      let slk = SlkDecoder.createSlk("Malcolm", "O'Malley", "24101954", "1");
      assert.equal(slk, "MALAL241019541");
    });
  });
});
