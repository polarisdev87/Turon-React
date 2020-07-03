import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { actiontemp, actionhumid, actiontable } from "../actions/actions";
import history from "./../services/history";

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      dates: [],
      firstName: "",
      lastName: "",
      about: "",
      fees: 0,
      teacher: "",
      file: null,
      phone: "",
      email: "",
      gender: "",
      school: "",
      subject: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    // this.handleChangeSubmit = this.handleChangeSubmit.bind(this);
  }
  onChange = date => this.setState({ date });
  handleChange(event) {
    this.setState({ gender: event.target.value });
  }
  handleChange1(event) {
    this.setState({ school: event.target.value });
  }
  handleChange2(event) {
    this.setState({ subject: event.target.value });
  }
  handleChange3(event) {
    this.setState({ course: event.target.value });
  }
  handleChange4(event) {
    console.log("DAte inster-->", event.target.value);
    const index = this.state.dates.indexOf(event.target.value);
    if (index < 0) {
      this.state.dates.push(event.target.value);
    } else {
      this.state.dates.splice(index, 1);
    }
    this.setState({ dates: [...this.state.dates] });
  }

  handleChangeSubmit() {
    this.setState({ date: this.state.dates.toString() });
    this.props.Temp(this.state);
  }
  submitFile = event => {
    const formData = new FormData();
    formData.append("file", this.state.file[0]);
    // axios.post(`http://ec2-54-67-8-213.us-west-1.compute.amazonaws.com:3001/test-upload`, formData, {
    axios
      .post(`http://localhost:3001/test-upload`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary3Lg2jEFP1SCJBOVM"
        }
      })
      .then(response => {
        console.log("Response form S3-->", response);

        console.log(this.state.date);
        this.handleChangeSubmit();
      })
      .catch(error => {
        console.log("Error Uploading Files" + error);
      });
  };

  onDrop = event => {
    this.setState({ file: event.target.files });
  };

  render() {
    console.log("Files uploaded by data-->", this.state.date);
    return (
      <div className>
        <div className="container-Home" />
        <div className="Turon-UserHome">
          <img
            src={require("../images/Turon_Logo.jpg")}
            alt="Turon Logo"
            style={{ width: "250px", height: "100px" }}
          />
        </div>
        <div className="bgImg3">
          <img
            src={require("../images/Loginimg.jpg")}
            alt="Turon Logo"
            style={{ width: "100%", height: "120%" }}
          />
        </div>

        <div className="top-left">
          <img
            src={require("../images/Turon_logo_no_background.png")}
            alt="Turon Logo"
            style={{ width: "200px", height: "75px" }}
            onClick={() => {
              history.push("./");
            }}
          />
        </div>

        <section id="boxes">
          <div className="container-UserHome">
            <div className="d-flex justify-content-between w-100">
              <div className="col-lg-6">
                <p id="col2" />

                <form className="form-horizontal">
                  <div className="form-group">
                    <h1> &nbsp; </h1>
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      First Name
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.firstName}
                        onChange={event => {
                          this.setState({
                            firstName: event.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      Last Name
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.lastName}
                        onChange={event => {
                          this.setState({
                            lastName: event.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      Gender
                    </label>
                    <div className="col-sm-10">
                      <select
                        className="form-control"
                        onChange={this.handleChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      University
                    </label>
                    <div className="col-sm-10">
                      <select
                        className="form-control"
                        onChange={this.handleChange1}
                      >
                        <option value="San Jose State University">
                          San Jose State University
                        </option>
                        <option value="San Deigo State University">
                          San Diego State University
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      About Me
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        className="form-control"
                        rows="5"
                        onChange={event => {
                          this.setState({
                            about: event.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-inline">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      Hourly Rate
                    </label>
                    {/*<input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked/>*/}
                    &nbsp;&nbsp;&nbsp;
                    <input
                      className="form-control"
                      type="Number"
                      value={this.state.fees}
                      onChange={event => {
                        this.setState({
                          fees: event.target.value
                        });
                      }}
                    />
                    &nbsp;&nbsp;
                    <label>Please enter a number 20 or greater</label>
                  </div>

                  <div id="classes">
                    <div className="form-group">
                      <label for="inputEmail3" className="col-sm-2 control-label">
                        Courses
                      </label>
                    </div>
                    <div className="form-group">
                      <label for="inputEmail3" className="col-sm-2 control-label">
                        Course #
                      </label>
                      <div className="col-sm-10">
                        <input
                          list="technologies"
                          className="form-control"
                          onChange={this.handleChange3}
                        />
                        <datalist id="technologies">
                          <option value="HTML5" />
                          <option value="CSS3" />
                          <option value="JavaScript" />
                          <option value="Jquery" />
                        </datalist>
                      </div>
                    </div>
                    {/*</div>*/}
                    <div className="form-group">
                      <label for="inputEmail3" className="col-sm-2 control-label">
                        Subject
                      </label>
                      <div className="col-sm-10">
                        <input
                          list="technologies"
                          className="form-control"
                          onChange={this.handleChange2}
                        />
                        <datalist id="technologies">
                          <option value="HTML5" />
                          <option value="CSS3" />
                          <option value="JavaScript" />
                          <option value="Jquery" />
                        </datalist>
                      </div>
                    </div>

                    <div className="form-group">
                      <label for="inputEmail3" className="col-sm-2 control-label">
                        Teacher
                      </label>
                      <div className="col-sm-10">
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.teacher}
                          onChange={event => {
                            this.setState({
                              teacher: event.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-6">
                <p id="col2" />
                <form className="form-horizontal">
                  <div className="form-group">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                      <h1 className="UHText">Your Photo</h1>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-2" />
                    <div className="col-sm-4">
                      <input
                        className="form-control"
                        type="file"
                        onChange={this.onDrop}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                      <h1 className="UHText">Contact Information</h1>
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      Phone Number
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="Number"
                        value={this.state.phone}
                        onChange={event => {
                          this.setState({
                            phone: event.target.value
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="inputEmail3" className="col-sm-2 control-label">
                      Email:
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="email"
                        onChange={event => {
                          this.setState({
                            email: event.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                      <h1 className="UHText"> General Availability</h1>
                    </div>
                  </div>
                  <div className="form-group">
                    <h1 className="week">
                      Sun:&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Sun 12:00 am">12:00 am</option>
                        <option value="Sun 1:00 am">1:00 am</option>
                        <option value="Sun 2:00 am">2:00 am</option>
                        <option value="Sun 3:00 am">3:00 am</option>
                        <option value="Sun 4:00 am">4:00 am</option>
                        <option value="Sun 5:00 am">5:00 am</option>
                        <option value="Sun 6:00 am">6:00 am</option>
                        <option value="Sun 7:00 am">7:00 am</option>
                        <option value="Sun 8:00 am">8:00 am</option>
                        <option value="Sun 9:00 am">9:00 am</option>
                        <option value="Sun 10:00 am">10:00 am</option>
                        <option value="Sun 11:00 am">11:00 am</option>
                        <option value="Sun 12:00 pm">12:00 pm</option>
                        <option value="Sun 1:00 pm">1:00 pm</option>
                        <option value="Sun 2:00 pm">2:00 pm</option>
                        <option value="Sun 3:00 pm">3:00 pm</option>
                        <option value="Sun 4:00 pm">4:00 pm</option>
                        <option value="Sun 5:00 pm">5:00 pm</option>
                        <option value="Sun 6:00 pm">6:00 pm</option>
                        <option value="Sun 7:00 pm">7:00 pm</option>
                        <option value="Sun 8:00 pm">8:00 pm</option>
                        <option value="Sun 9:00 pm">9:00 pm</option>
                        <option value="Sun 10:00 pm">10:00 pm</option>
                        <option value="Sun 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Sun 12:00 am">12:00 am</option>
                        <option value="Sun 1:00 am">1:00 am</option>
                        <option value="Sun 2:00 am">2:00 am</option>
                        <option value="Sun 3:00 am">3:00 am</option>
                        <option value="Sun 4:00 am">4:00 am</option>
                        <option value="Sun 5:00 am">5:00 am</option>
                        <option value="Sun 6:00 am">6:00 am</option>
                        <option value="Sun 7:00 am">7:00 am</option>
                        <option value="Sun 8:00 am">8:00 am</option>
                        <option value="Sun 9:00 am">9:00 am</option>
                        <option value="Sun 10:00 am">10:00 am</option>
                        <option value="Sun 11:00 am">11:00 am</option>
                        <option value="Sun 12:00 pm">12:00 pm</option>
                        <option value="Sun 1:00 pm">1:00 pm</option>
                        <option value="Sun 2:00 pm">2:00 pm</option>
                        <option value="Sun 3:00 pm">3:00 pm</option>
                        <option value="Sun 4:00 pm">4:00 pm</option>
                        <option value="Sun 5:00 pm">5:00 pm</option>
                        <option value="Sun 6:00 pm">6:00 pm</option>
                        <option value="Sun 7:00 pm">7:00 pm</option>
                        <option value="Sun 8:00 pm">8:00 pm</option>
                        <option value="Sun 9:00 pm">9:00 pm</option>
                        <option value="Sun 10:00 pm">10:00 pm</option>
                        <option value="Sun 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                    <h1 className="week">
                      Mon:&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Mon 12:00 am">12:00 am</option>
                        <option value="Mon 1:00 am">1:00 am</option>
                        <option value="Mon 2:00 am">2:00 am</option>
                        <option value="Mon 3:00 am">3:00 am</option>
                        <option value="Mon 4:00 am">4:00 am</option>
                        <option value="Mon 5:00 am">5:00 am</option>
                        <option value="Mon 6:00 am">6:00 am</option>
                        <option value="Mon 7:00 am">7:00 am</option>
                        <option value="Mon 8:00 am">8:00 am</option>
                        <option value="Mon 9:00 am">9:00 am</option>
                        <option value="Mon 10:00 am">10:00 am</option>
                        <option value="Mon 11:00 am">11:00 am</option>
                        <option value="Mon 12:00 pm">12:00 pm</option>
                        <option value="Mon 1:00 pm">1:00 pm</option>
                        <option value="Mon 2:00 pm">2:00 pm</option>
                        <option value="Mon 3:00 pm">3:00 pm</option>
                        <option value="Mon 4:00 pm">4:00 pm</option>
                        <option value="Mon 5:00 pm">5:00 pm</option>
                        <option value="Mon 6:00 pm">6:00 pm</option>
                        <option value="Mon 7:00 pm">7:00 pm</option>
                        <option value="Mon 8:00 pm">8:00 pm</option>
                        <option value="Mon 9:00 pm">9:00 pm</option>
                        <option value="Mon 10:00 pm">10:00 pm</option>
                        <option value="Mon 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Mon 12:00 am">12:00 am</option>
                        <option value="Mon 1:00 am">1:00 am</option>
                        <option value="Mon 2:00 am">2:00 am</option>
                        <option value="Mon 3:00 am">3:00 am</option>
                        <option value="Mon 4:00 am">4:00 am</option>
                        <option value="Mon 5:00 am">5:00 am</option>
                        <option value="Mon 6:00 am">6:00 am</option>
                        <option value="Mon 7:00 am">7:00 am</option>
                        <option value="Mon 8:00 am">8:00 am</option>
                        <option value="Mon 9:00 am">9:00 am</option>
                        <option value="Mon 10:00 am">10:00 am</option>
                        <option value="Mon 11:00 am">11:00 am</option>
                        <option value="Mon 12:00 pm">12:00 pm</option>
                        <option value="Mon 1:00 pm">1:00 pm</option>
                        <option value="Mon 2:00 pm">2:00 pm</option>
                        <option value="Mon 3:00 pm">3:00 pm</option>
                        <option value="Mon 4:00 pm">4:00 pm</option>
                        <option value="Mon 5:00 pm">5:00 pm</option>
                        <option value="Mon 6:00 pm">6:00 pm</option>
                        <option value="Mon 7:00 pm">7:00 pm</option>
                        <option value="Mon 8:00 pm">8:00 pm</option>
                        <option value="Mon 9:00 pm">9:00 pm</option>
                        <option value="Mon 10:00 pm">10:00 pm</option>
                        <option value="Mon 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                    <h1 className="week">
                      Tue:&nbsp;&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Tue 12:00 am">12:00 am</option>
                        <option value="Tue 1:00 am">1:00 am</option>
                        <option value="Tue 2:00 am">2:00 am</option>
                        <option value="Tue 3:00 am">3:00 am</option>
                        <option value="Tue 4:00 am">4:00 am</option>
                        <option value="Tue 5:00 am">5:00 am</option>
                        <option value="Tue 6:00 am">6:00 am</option>
                        <option value="Tue 7:00 am">7:00 am</option>
                        <option value="Tue 8:00 am">8:00 am</option>
                        <option value="Tue 9:00 am">9:00 am</option>
                        <option value="Tue 10:00 am">10:00 am</option>
                        <option value="Tue 11:00 am">11:00 am</option>
                        <option value="Tue 12:00 pm">12:00 pm</option>
                        <option value="Tue 1:00 pm">1:00 pm</option>
                        <option value="Tue 2:00 pm">2:00 pm</option>
                        <option value="Tue 3:00 pm">3:00 pm</option>
                        <option value="Tue 4:00 pm">4:00 pm</option>
                        <option value="Tue 5:00 pm">5:00 pm</option>
                        <option value="Tue 6:00 pm">6:00 pm</option>
                        <option value="Tue 7:00 pm">7:00 pm</option>
                        <option value="Tue 8:00 pm">8:00 pm</option>
                        <option value="Tue 9:00 pm">9:00 pm</option>
                        <option value="Tue 10:00 pm">10:00 pm</option>
                        <option value="Tue 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Tue 12:00 am">12:00 am</option>
                        <option value="Tue 1:00 am">1:00 am</option>
                        <option value="Tue 2:00 am">2:00 am</option>
                        <option value="Tue 3:00 am">3:00 am</option>
                        <option value="Tue 4:00 am">4:00 am</option>
                        <option value="Tue 5:00 am">5:00 am</option>
                        <option value="Tue 6:00 am">6:00 am</option>
                        <option value="Tue 7:00 am">7:00 am</option>
                        <option value="Tue 8:00 am">8:00 am</option>
                        <option value="Tue 9:00 am">9:00 am</option>
                        <option value="Tue 10:00 am">10:00 am</option>
                        <option value="Tue 11:00 am">11:00 am</option>
                        <option value="Tue 12:00 pm">12:00 pm</option>
                        <option value="Tue 1:00 pm">1:00 pm</option>
                        <option value="Tue 2:00 pm">2:00 pm</option>
                        <option value="Tue 3:00 pm">3:00 pm</option>
                        <option value="Tue 4:00 pm">4:00 pm</option>
                        <option value="Tue 5:00 pm">5:00 pm</option>
                        <option value="Tue 6:00 pm">6:00 pm</option>
                        <option value="Tue 7:00 pm">7:00 pm</option>
                        <option value="Tue 8:00 pm">8:00 pm</option>
                        <option value="Tue 9:00 pm">9:00 pm</option>
                        <option value="Tue 10:00 pm">10:00 pm</option>
                        <option value="Tue 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                    <h1 className="week">
                      Wed:&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Wed 12:00 am">12:00 am</option>
                        <option value="Wed 1:00 am">1:00 am</option>
                        <option value="Wed 2:00 am">2:00 am</option>
                        <option value="Wed 3:00 am">3:00 am</option>
                        <option value="Wed 4:00 am">4:00 am</option>
                        <option value="Wed 5:00 am">5:00 am</option>
                        <option value="Wed 6:00 am">6:00 am</option>
                        <option value="Wed 7:00 am">7:00 am</option>
                        <option value="Wed 8:00 am">8:00 am</option>
                        <option value="Wed 9:00 am">9:00 am</option>
                        <option value="Wed 10:00 am">10:00 am</option>
                        <option value="Wed 11:00 am">11:00 am</option>
                        <option value="Wed 12:00 pm">12:00 pm</option>
                        <option value="Wed 1:00 pm">1:00 pm</option>
                        <option value="Wed 2:00 pm">2:00 pm</option>
                        <option value="Wed 3:00 pm">3:00 pm</option>
                        <option value="Wed 4:00 pm">4:00 pm</option>
                        <option value="Wed 5:00 pm">5:00 pm</option>
                        <option value="Wed 6:00 pm">6:00 pm</option>
                        <option value="Wed 7:00 pm">7:00 pm</option>
                        <option value="Wed 8:00 pm">8:00 pm</option>
                        <option value="Wed 9:00 pm">9:00 pm</option>
                        <option value="Wed 10:00 pm">10:00 pm</option>
                        <option value="Wed 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Wed 12:00 am">12:00 am</option>
                        <option value="Wed 1:00 am">1:00 am</option>
                        <option value="Wed 2:00 am">2:00 am</option>
                        <option value="Wed 3:00 am">3:00 am</option>
                        <option value="Wed 4:00 am">4:00 am</option>
                        <option value="Wed 5:00 am">5:00 am</option>
                        <option value="Wed 6:00 am">6:00 am</option>
                        <option value="Wed 7:00 am">7:00 am</option>
                        <option value="Wed 8:00 am">8:00 am</option>
                        <option value="Wed 9:00 am">9:00 am</option>
                        <option value="Wed 10:00 am">10:00 am</option>
                        <option value="Wed 11:00 am">11:00 am</option>
                        <option value="Wed 12:00 pm">12:00 pm</option>
                        <option value="Wed 1:00 pm">1:00 pm</option>
                        <option value="Wed 2:00 pm">2:00 pm</option>
                        <option value="Wed 3:00 pm">3:00 pm</option>
                        <option value="Wed 4:00 pm">4:00 pm</option>
                        <option value="Wed 5:00 pm">5:00 pm</option>
                        <option value="Wed 6:00 pm">6:00 pm</option>
                        <option value="Wed 7:00 pm">7:00 pm</option>
                        <option value="Wed 8:00 pm">8:00 pm</option>
                        <option value="Wed 9:00 pm">9:00 pm</option>
                        <option value="Wed 10:00 pm">10:00 pm</option>
                        <option value="Wed 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                    <h1 className="week">
                      Thu:&nbsp;&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Thu 12:00 am">12:00 am</option>
                        <option value="Thu 1:00 am">1:00 am</option>
                        <option value="Thu 2:00 am">2:00 am</option>
                        <option value="Thu 3:00 am">3:00 am</option>
                        <option value="Thu 4:00 am">4:00 am</option>
                        <option value="Thu 5:00 am">5:00 am</option>
                        <option value="Thu 6:00 am">6:00 am</option>
                        <option value="Thu 7:00 am">7:00 am</option>
                        <option value="Thu 8:00 am">8:00 am</option>
                        <option value="Thu 9:00 am">9:00 am</option>
                        <option value="Thu 10:00 am">10:00 am</option>
                        <option value="Thu 11:00 am">11:00 am</option>
                        <option value="Thu 12:00 pm">12:00 pm</option>
                        <option value="Thu 1:00 pm">1:00 pm</option>
                        <option value="Thu 2:00 pm">2:00 pm</option>
                        <option value="Thu 3:00 pm">3:00 pm</option>
                        <option value="Thu 4:00 pm">4:00 pm</option>
                        <option value="Thu 5:00 pm">5:00 pm</option>
                        <option value="Thu 6:00 pm">6:00 pm</option>
                        <option value="Thu 7:00 pm">7:00 pm</option>
                        <option value="Thu 8:00 pm">8:00 pm</option>
                        <option value="Thu 9:00 pm">9:00 pm</option>
                        <option value="Thu 10:00 pm">10:00 pm</option>
                        <option value="Thu 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Thu 12:00 am">12:00 am</option>
                        <option value="Thu 1:00 am">1:00 am</option>
                        <option value="Thu 2:00 am">2:00 am</option>
                        <option value="Thu 3:00 am">3:00 am</option>
                        <option value="Thu 4:00 am">4:00 am</option>
                        <option value="Thu 5:00 am">5:00 am</option>
                        <option value="Thu 6:00 am">6:00 am</option>
                        <option value="Thu 7:00 am">7:00 am</option>
                        <option value="Thu 8:00 am">8:00 am</option>
                        <option value="Thu 9:00 am">9:00 am</option>
                        <option value="Thu 10:00 am">10:00 am</option>
                        <option value="Thu 11:00 am">11:00 am</option>
                        <option value="Thu 12:00 pm">12:00 pm</option>
                        <option value="Thu 1:00 pm">1:00 pm</option>
                        <option value="Thu 2:00 pm">2:00 pm</option>
                        <option value="Thu 3:00 pm">3:00 pm</option>
                        <option value="Thu 4:00 pm">4:00 pm</option>
                        <option value="Thu 5:00 pm">5:00 pm</option>
                        <option value="Thu 6:00 pm">6:00 pm</option>
                        <option value="Thu 7:00 pm">7:00 pm</option>
                        <option value="Thu 8:00 pm">8:00 pm</option>
                        <option value="Thu 9:00 pm">9:00 pm</option>
                        <option value="Thu 10:00 pm">10:00 pm</option>
                        <option value="Thu 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                    <h1 className="week">
                      Fri:&nbsp;&nbsp;&nbsp;&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Fri 12:00 am">12:00 am</option>
                        <option value="Fri 1:00 am">1:00 am</option>
                        <option value="Fri 2:00 am">2:00 am</option>
                        <option value="Fri 3:00 am">3:00 am</option>
                        <option value="Fri 4:00 am">4:00 am</option>
                        <option value="Fri 5:00 am">5:00 am</option>
                        <option value="Fri 6:00 am">6:00 am</option>
                        <option value="Fri 7:00 am">7:00 am</option>
                        <option value="Fri 8:00 am">8:00 am</option>
                        <option value="Fri 9:00 am">9:00 am</option>
                        <option value="Fri 10:00 am">10:00 am</option>
                        <option value="Fri 11:00 am">11:00 am</option>
                        <option value="Fri 12:00 pm">12:00 pm</option>
                        <option value="Fri 1:00 pm">1:00 pm</option>
                        <option value="Fri 2:00 pm">2:00 pm</option>
                        <option value="Fri 3:00 pm">3:00 pm</option>
                        <option value="Fri 4:00 pm">4:00 pm</option>
                        <option value="Fri 5:00 pm">5:00 pm</option>
                        <option value="Fri 6:00 pm">6:00 pm</option>
                        <option value="Fri 7:00 pm">7:00 pm</option>
                        <option value="Fri 8:00 pm">8:00 pm</option>
                        <option value="Fri 9:00 pm">9:00 pm</option>
                        <option value="Fri 10:00 pm">10:00 pm</option>
                        <option value="Fri 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Fri 12:00 am">12:00 am</option>
                        <option value="Fri 1:00 am">1:00 am</option>
                        <option value="Fri 2:00 am">2:00 am</option>
                        <option value="Fri 3:00 am">3:00 am</option>
                        <option value="Fri 4:00 am">4:00 am</option>
                        <option value="Fri 5:00 am">5:00 am</option>
                        <option value="Fri 6:00 am">6:00 am</option>
                        <option value="Fri 7:00 am">7:00 am</option>
                        <option value="Fri 8:00 am">8:00 am</option>
                        <option value="Fri 9:00 am">9:00 am</option>
                        <option value="Fri 10:00 am">10:00 am</option>
                        <option value="Fri 11:00 am">11:00 am</option>
                        <option value="Fri 12:00 pm">12:00 pm</option>
                        <option value="Fri 1:00 pm">1:00 pm</option>
                        <option value="Fri 2:00 pm">2:00 pm</option>
                        <option value="Fri 3:00 pm">3:00 pm</option>
                        <option value="Fri 4:00 pm">4:00 pm</option>
                        <option value="Fri 5:00 pm">5:00 pm</option>
                        <option value="Fri 6:00 pm">6:00 pm</option>
                        <option value="Fri 7:00 pm">7:00 pm</option>
                        <option value="Fri 8:00 pm">8:00 pm</option>
                        <option value="Fri 9:00 pm">9:00 pm</option>
                        <option value="Fri 10:00 pm">10:00 pm</option>
                        <option value="Fri 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                    <h1 className="week">
                      Sat:&nbsp;&nbsp;&nbsp;
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Sat 12:00 am">12:00 am</option>
                        <option value="Sat 1:00 am">1:00 am</option>
                        <option value="Sat 2:00 am">2:00 am</option>
                        <option value="Sat 3:00 am">3:00 am</option>
                        <option value="Sat 4:00 am">4:00 am</option>
                        <option value="Sat 5:00 am">5:00 am</option>
                        <option value="Sat 6:00 am">6:00 am</option>
                        <option value="Sat 7:00 am">7:00 am</option>
                        <option value="Sat 8:00 am">8:00 am</option>
                        <option value="Sat 9:00 am">9:00 am</option>
                        <option value="Sat 10:00 am">10:00 am</option>
                        <option value="Sat 11:00 am">11:00 am</option>
                        <option value="Sat 12:00 pm">12:00 pm</option>
                        <option value="Sat 1:00 pm">1:00 pm</option>
                        <option value="Sat 2:00 pm">2:00 pm</option>
                        <option value="Sat 3:00 pm">3:00 pm</option>
                        <option value="Sat 4:00 pm">4:00 pm</option>
                        <option value="Sat 5:00 pm">5:00 pm</option>
                        <option value="Sat 6:00 pm">6:00 pm</option>
                        <option value="Sat 7:00 pm">7:00 pm</option>
                        <option value="Sat 8:00 pm">8:00 pm</option>
                        <option value="Sat 9:00 pm">9:00 pm</option>
                        <option value="Sat 10:00 pm">10:00 pm</option>
                        <option value="Sat 11:00 pm">11:00 pm</option>
                      </select>
                      <a> </a>
                      to
                      <a> </a>
                      <select
                        value={this.state.value}
                        onChange={this.handleChange4}
                      >
                        <option>—</option>
                        <option value="Sat 12:00 am">12:00 am</option>
                        <option value="Sat 1:00 am">1:00 am</option>
                        <option value="Sat 2:00 am">2:00 am</option>
                        <option value="Sat 3:00 am">3:00 am</option>
                        <option value="Sat 4:00 am">4:00 am</option>
                        <option value="Sat 5:00 am">5:00 am</option>
                        <option value="Sat 6:00 am">6:00 am</option>
                        <option value="Sat 7:00 am">7:00 am</option>
                        <option value="Sat 8:00 am">8:00 am</option>
                        <option value="Sat 9:00 am">9:00 am</option>
                        <option value="Sat 10:00 am">10:00 am</option>
                        <option value="Sat 11:00 am">11:00 am</option>
                        <option value="Sat 12:00 pm">12:00 pm</option>
                        <option value="Sat 1:00 pm">1:00 pm</option>
                        <option value="Sat 2:00 pm">2:00 pm</option>
                        <option value="Sat 3:00 pm">3:00 pm</option>
                        <option value="Sat 4:00 pm">4:00 pm</option>
                        <option value="Sat 5:00 pm">5:00 pm</option>
                        <option value="Sat 6:00 pm">6:00 pm</option>
                        <option value="Sat 7:00 pm">7:00 pm</option>
                        <option value="Sat 8:00 pm">8:00 pm</option>
                        <option value="Sat 9:00 pm">9:00 pm</option>
                        <option value="Sat 10:00 pm">10:00 pm</option>
                        <option value="Sat 11:00 pm">11:00 pm</option>
                      </select>
                      &nbsp; &nbsp;&nbsp;
                      <input type="checkbox" />
                      &nbsp;Unavailable
                    </h1>
                  </div>
                </form>
              </div>
            </div>
            <button
              color="info"
              className="UserHome-Submit-btn"
              onClick={() => {
                this.submitFile(this.state);
              }}
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    Temp: data => dispatch(actiontemp(data)),
    Humid: data => dispatch(actionhumid(data)),
    table_data: data => dispatch(actiontable(data))
  };
};

const mapStateToProps = stores => {
  return {
    temp: stores.reducer.stores.tempval,
    humid: stores.reducer.stores.humival,
    tableData: stores.reducer.stores.tableData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserHome);
