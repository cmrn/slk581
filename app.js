var firstNamesMale, firstNamesFemale, lastNames;
var filesToLoad = 3;
getFile('data/first-names-male.txt', function(output) {
  firstNamesMale = output.split('\n');;
  filesToLoad--;
});
getFile('data/first-names-female.txt', function(output) {
  firstNamesFemale = output.split('\n');;
  filesToLoad--;
});
getFile('data/last-names.txt', function(output) {
  lastNames = output.split('\n');;
  filesToLoad--;
});

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
      <ul className="names">
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

var Results = React.createClass({
  render: function() {
    return (
      <div>
        <div className="dob">
          <h2>Date of Birth</h2>
          <p>{this.props.results.dob}</p>
        </div>
        <div className="gender">
          <h2>Gender</h2>
          <p>{this.props.results.gender}</p>
        </div>
        <div className="firstNames">
          <h2>First Names</h2>
          <NameList names={this.props.results.firstNames}/>
        </div>
        <div className="lastNames">
          <h2>Last Name</h2>
          <NameList names={this.props.results.lastNames}/>
        </div>
      </div>
    );
  }
});

var SlkDecoderPage = React.createClass({
  getInitialState: function() {
    return {details: {firstNames: [], lastNames: []}};
  },
  decodeSlk: function(slkString) {
    var decoder = new SlkDecoder(firstNamesMale, firstNamesFemale, lastNames);
    var details = decoder.decode(slkString);
    this.setState({results: details});
  },
  render: function() {
    return (
      <div>
        <InputForm slkCallback={this.decodeSlk}/>
        {this.state.results ? <Results results={this.state.results} /> : null}
      </div>
    );
  }
});

ReactDOM.render(
  <SlkDecoderPage />,
  document.getElementById('content')
);


function getFile(filename, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename);
  xhr.onload = function(e) {
    callback(this.response);
  }
  xhr.send();
}
