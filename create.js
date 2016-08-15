var InputForm = React.createClass({
  getInitialState: function() {
    return {firstName: "", lastName: "", dob: "", gender: null};
  },
  handleFirstNameChange: function(e) {
    this.setState({firstName: e.target.value});
  },
  handleLastNameChange: function(e) {
    this.setState({lastName: e.target.value});
  },
  handleDobChange: function(e) {
    console.log(e.target.value);
    this.setState({dob: e.target.value});
  },
  handleGenderChange: function(e) {
    this.setState({gender: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    // TODO: validate form
    var firstName = this.state.firstName.trim().toUpperCase();
    var lastName = this.state.lastName.trim().toUpperCase();
    var dob = this.state.dob.trim().replace(/\//g, '');
    var gender = this.state.gender;
    console.log(dob);
    if (!firstName || !lastName || !dob || dob.length !== 8 || !gender) {
      this.setState({invalid: true});
      return false;
    }

    this.setState({invalid: false});
    this.props.callback(firstName, lastName, dob, gender);
  },
  render: function() {
    return (
      <div className="createFormWrapper">
        <form className="createForm" onSubmit={this.handleSubmit}>
          <label>First Name</label>
          <input type="text" placeholder="Malcolm"
            value={this.state.firstName}
            onChange={this.handleFirstNameChange} />
          <label>Last Name</label>
          <input type="text" placeholder="Turnbull"
            value={this.state.lastName}
            onChange={this.handleLastNameChange} />
          <label>Date of birth</label>
          <small> (DD/MM/YYYY)</small>
          <input type="text" placeholder="24/10/1954"
            value={this.state.dob}
            onChange={this.handleDobChange} />
          <label>Gender</label>
          <div className="radio">
          <label><input type="radio" name="gender" value="2"
          onChange={this.handleGenderChange} /> Female</label>
          <label><input type="radio" name="gender" value="1"
          onChange={this.handleGenderChange} /> Male</label>
          </div>
          <input className="submit" type="submit" value="Create SLK" />
          <div className="error">{this.state.invalid ? "Please fill out all the fields and check your DOB format." : ' '}</div>
        </form>
      </div>
    );
  }
});

var Result = React.createClass({
  render: function() {
    return (
      <div className="results slkCreatorResult">
        <h2>Your SLK is</h2>
        <p>{this.props.slk}</p>
      </div>
    );
  }
});

var SlkCreatorPage = React.createClass({
  getInitialState: function() {
    return {details: {}};
  },
  createSlk: function(firstName, lastName, dob, gender) {
    var result = SlkDecoder.createSlk(firstName, lastName, dob, gender);
    this.setState({slk: result});
  },
  render: function() {
    return (
      <div>
        <InputForm callback={this.createSlk}/>
        {this.state.slk ? <Result slk={this.state.slk} /> : null}
      </div>
    );
  }
});

ReactDOM.render(
  <SlkCreatorPage />,
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
