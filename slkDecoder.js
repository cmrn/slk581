(function() {
SlkDecoder = function(firstNamesMale, firstNamesFemale, lastNames) {
  function parseSlkString(slkString) {
    return {
      last: slkString.slice(0,3),
      first: slkString.slice(3,5),
      dob: slkString.slice(5,13),
      gender: slkString[13],
    };
  }

  function possibleFirstNames(key, gender) {
    // Key is the 2nd and 3rd varters oo the first name
    var candidateNames = firstNamesFemale;
    if(gender === '1') candidateNames = firstNamesMale;

    var reStr = "^." + key;

    if(key.indexOf('2') !== -1) { // it's a short name (<3 chars)
      var count = key.match(/2/g).length;
      key = key.replace(/2/g,'');
      if(count == 1) reStr = "^." + key + "$"; // 2 character name
      else reStr = "^.?$"; // 0-1 character name
    }

    var re = new RegExp(reStr, "i");

    return candidateNames.filter(function(name) {
      return name.match(re);
    });
  }

  function possibleLastNames(key) {
    // key is the 2nd, 3rd, and 5th characters of last name.
    // Missing characters are replaced by '2'

    var reStr = "^." + key.slice(0,2) + "." + key[2];

    if(key.indexOf('2') !== -1) { // it's a short name (<5 chars)
      var count = key.match(/2/g).length;
      key = key.replace(/2/g,'');
      if(count == 1) reStr = "^." + key + ".?$"; // 3-4 character last name
      else if(count == 3) reStr = "^.?$"; // 0-1 character last name
      else reStr = "^." + key + "$" // 2 character last name
    }

    var re = new RegExp(reStr, "i");

    return lastNames.filter(function(name) {
      return name.match(re);
    });
  }

  function formatSlkDob(slkDob) {
    return slkDob.slice(0,2) + '/' + slkDob.slice(2,4) + '/' + slkDob.slice(4,8);
  }

  function formatSlkGender(slkGender) {
    return slkGender === '2' ? 'Female' : 'Male';
  }

  /* ------------------------- *\
     Public interface starts here
  \* ------------------------- */

  this.decode = function(slkString) {
    var slk = parseSlkString(slkString);
    return {
      firstNames: possibleFirstNames(slk.first, slk.gender),
      lastNames: possibleLastNames(slk.last),
      dob: formatSlkDob(slk.dob),
      gender: formatSlkGender(slk.gender)
    };
  }
}

SlkDecoder.isValid = function(slkString) {
  return slkString.match(/^([A-Z2]{5})(0[1-9]|[1-2][0-9]|3[0-1]|)(1[0-2]|0[1-9])([0-9]{4})([12])$/) !== null;
}

SlkDecoder.createSlk = function(firstName, lastName, dob, gender) {
  // Names are padded with '2' for short names as per spec
  // Non-alphabetic characters are removed
  firstName = firstName.toUpperCase().replace(/[^A-Z]/g, '') + "22222";
  lastName = lastName.toUpperCase().replace(/[^A-Z]/g, '') + "22222";
  return lastName.slice(1,3) + lastName[4] + firstName.slice(1,3) + dob + gender;
}

})();
