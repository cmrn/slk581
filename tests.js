let assert = require('assert');

require('./src/slkDecoder.js'); // loads constructer into global variable SlkDecoder

describe('SlkDecoder', function() {
    describe('#decode()', function() {
      describe('.gender', function() {
        it('decodes gender ID "1" as "Male"', function() {
          let decoder = new SlkDecoder([], [], []);
          assert.equal(decoder.decode("AAABB112233331").gender, "Male");
        });

        it('decodes gender ID "2" as "Female"', function() {
          let decoder = new SlkDecoder([], [], []);
          assert.equal(decoder.decode("AAABB112233332").gender, "Female");
        });
      });

      describe('.dob', function() {
        it('formats DOB into DD/MM/YYYY format', function() {
          let decoder = new SlkDecoder([], [], []);
          assert.equal(decoder.decode("AAABB112233332").dob, "11/22/3333");
        });
      });

      describe('.firstNames', function() {
        it('finds all matching names', function() {
          let firstNames = ["WALTER", "RALPH", "DALE", "CALVIN"]; // should all match the SLK
          let decoder = new SlkDecoder(firstNames, [], []);

          let results = decoder.decode('URBAL241019541').firstNames;
          assert(firstNames.every((name) => results.includes(name)));
        });

        it('excludes non matching names', function() {
          let firstNames = ["BOBBY"];
          let decoder = new SlkDecoder(firstNames, [], []);

          let results = decoder.decode('URBAL241019541').firstNames;
          assert(!results.includes("BOBBY"));
        });

        it('uses correct name list based on gender ID', function() {
          let namesOne = ["WALTER"];
          let namesTwo = ["VALERIE"];
          let decoder = new SlkDecoder(namesOne, namesTwo, []);
          assert(decoder.decode('URBAL241019541').firstNames.includes("WALTER"));
          assert(decoder.decode('URBAL241019542').firstNames.includes("VALERIE"));
        });
      });

      describe('.lastNames', function() {
        it('finds all matching names', function() {
          let lastNames = ["TURNBULL", "TURNBOW", "HURLBURT", "HURLBUT"];
          let decoder = new SlkDecoder([], [], lastNames);

          let results = decoder.decode('URBAL241019541').lastNames;
          assert(lastNames.every((name) => results.includes(name)));
        });

        it('excludes non matching names', function() {
          let lastNames = ["SMITH"];
          let decoder = new SlkDecoder([], [], lastNames);

          let results = decoder.decode('URBAL241019541').lastNames;
          assert(!results.includes("SMITH"));
        });
      });
  });
});
