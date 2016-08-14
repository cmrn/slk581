let assert = require('assert');

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

          let results = decoder.decode('URBAL241019541').firstNames;
          assert(firstNames.every((name) => results.includes(name)));
        });

        it('excludes non matching names', () => {
          let firstNames = ["BOBBY"];
          let decoder = new SlkDecoder(firstNames, [], []);

          let results = decoder.decode('URBAL241019541').firstNames;
          assert(!results.includes("BOBBY"));
        });

        it('uses correct name list based on gender ID', () => {
          let namesOne = ["WALTER"];
          let namesTwo = ["VALERIE"];
          let decoder = new SlkDecoder(namesOne, namesTwo, []);
          assert(decoder.decode('URBAL241019541').firstNames.includes("WALTER"));
          assert(decoder.decode('URBAL241019542').firstNames.includes("VALERIE"));
        });
      });

      describe('.lastNames', () => {
        it('finds all matching names', () => {
          let lastNames = ["TURNBULL", "TURNBOW", "HURLBURT", "HURLBUT"];
          let decoder = new SlkDecoder([], [], lastNames);

          let results = decoder.decode('URBAL241019541').lastNames;
          assert(lastNames.every((name) => results.includes(name)));
        });

        it('excludes non matching names', () => {
          let lastNames = ["SMITH"];
          let decoder = new SlkDecoder([], [], lastNames);

          let results = decoder.decode('URBAL241019541').lastNames;
          assert(!results.includes("SMITH"));
        });
      });
  });
});
