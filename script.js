function parseSlkString(slkString) {
  return {
    last: slkString.slice(0,3),
    first: slkString.slice(3,5),
    dob: slkString.slice(5,13),
    gender: slkString[13],
  };
}

function possibleFirstNames(key, gender) {
  // Key is the 2nd and 3rd letters oo the first name

  let candidateNames = firstNamesFemale;
  if(gender === '1') candidateNames = firstNamesMale;

  let reStr = "^." + key;

  if(key.indexOf('2') !== -1) { // it's a short name (<3 chars)
    let count = key.match(/2/g).length;
    key = key.replace(/2/g,'');
    if(count == 1) reStr = "^." + key + "$"; // 2 character name
    else reStr = "^.?$"; // 0-1 character name
  }

  let re = new RegExp(reStr, "i");

  return candidateNames.filter(function(name) {
    return name.match(re);
  });
}

function possibleLastNames(key) {
  // key is the 2nd, 3rd, and 5th characters of last name.
  // Missing characters are replaced by '2'

  let reStr = "^." + key.slice(0,2) + "." + key[2];

  if(key.indexOf('2') !== -1) { // it's a short name (<5 chars)
    let count = key.match(/2/g).length;
    key = key.replace(/2/g,'');
    if(count == 1) reStr = "^." + key + ".?$"; // 3-4 character last name
    else if(count == 3) reStr = "^.?$"; // 0-1 character last name
    else reStr = "^." + key + "$" // 2 character last name

    console.log(reStr);
  }

  let re = new RegExp(reStr, "i");

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

var NameList = React.createClass({
  render: function() {
    var nameNodes = this.props.names.map(function(name) {
      return (
        <li key={name}>
          {name}
        </li>
      );
    });
    return (
      <ul className="nameList">
        {nameNodes}
      </ul>
    );
  }
});

var InputForm = React.createClass({
  getInitialState: function() {
    return {slk: 'URBAL241019541'};
  },
  handleSlkChange: function(e) {
    this.setState({slk: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var slk = this.state.slk.trim();
    if (!slk) { // TODO: validate SLK
      return;
    }
    this.props.slkCallback(slk);
    // TODO: process SLK
  },
  render: function() {
    return (
      <form className="InputForm" onSubmit={this.handleSubmit}>
        <label>Enter your SLK851</label>
        <input type="text" placeholder="URBAL241019541"
          value={this.state.slk}
          onChange={this.handleSlkChange} />
        <input type="submit" value="Decode" />
      </form>
    );
  }
});

let firstNamesMale, firstNamesFemale, lastNames;
let filesToLoad = 3;
getFile('first-names-male.txt', function(output) {
  firstNamesMale = output.split('\n');;
  filesToLoad--;
});
getFile('first-names-female.txt', function(output) {
  firstNamesFemale = output.split('\n');;
  filesToLoad--;
});
getFile('last-names.txt', function(output) {
  lastNames = output.split('\n');;
  filesToLoad--;
});


var SlkDecoder = React.createClass({
  getInitialState: function() {
    return {firstNames: [], lastNames: []};
  },
  decodeSlk: function(slkString) {
    let slk = parseSlkString(slkString);

    let firstNames = possibleFirstNames(slk.first, slk.gender);
    let lastNames = possibleLastNames(slk.last);
    let dob = formatSlkDob(slk.dob);
    let gender = formatSlkGender(slk.gender);

    this.setState({
      firstNames: firstNames,
      lastNames: lastNames,
      dob: dob,
      gender: gender
    });
  },
  render: function() {
    return (
      <div>
        <InputForm slkCallback={this.decodeSlk}/>
        <h2>Date of Birth</h2>
        <p>{this.state.dob}</p>
        <h2>Gender</h2>
        <p>{this.state.gender}</p>
        <h2>First Names</h2>
        <NameList names={this.state.firstNames}/>
        <h2>Last Name</h2>
        <NameList names={this.state.lastNames}/>
      </div>
    );
  }
});

ReactDOM.render(
  <SlkDecoder />,
  document.getElementById('content')
);


function getFile(filename, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', filename);
  xhr.onload = function(e) {
    callback(this.response);
  }
  xhr.send();
}
