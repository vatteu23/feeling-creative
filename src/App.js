import "./App.css";
import React, { Component } from "react";
import Navbar from "./components/navbar";
import NoCanvas from "./components/canvas-no";

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeRectangles: [],
      overLap: false,
    };
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container ">
          <div className="row">
            <NoCanvas />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
