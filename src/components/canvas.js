import React, { Component } from "react";
import { Rnd } from "react-rnd";
import { SketchPicker } from "react-color";
import {
  AiOutlineBgColors,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";
import cookie from "react-cookies";

class Canvas extends Component {
  constructor() {
    super();
    this.state = {
      activeRectangles: cookie.load("activeRectangles") || [],
      savedPatterns: cookie.load("savedPatterns") || null,
    };
  }

  componentDidMount = () => {
    console.log(cookie.load("savedPatterns"));
  };

  savePattern = () => {
    let savedPatterns = cookie.load("savedPatterns") || {};
    savedPatterns[this.state.newPatternName] = this.state.activeRectangles;

    cookie.save("savedPatterns", savedPatterns, {
      path: "/",
    });
    this.setState({ savedPatterns: savedPatterns });
  };

  addReactangle = () => {
    let temp = {
      height: 200,
      width: 300,
      top: 0,
      left: 0,
      backgroundColor: "#ffffff",
      changeColor: false,
      disableDragging: false,
      enableResizing: true,
    };

    let activeRectangles = this.state.activeRectangles;
    activeRectangles.push(temp);
    this.setState({ activeRectangles: activeRectangles });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  handleResizeStop = (width, height, left, top, index) => {
    let activeRectangles = this.state.activeRectangles;
    activeRectangles[index].height = height;
    activeRectangles[index].width = width;
    activeRectangles[index].left = left;
    activeRectangles[index].top = top;
    this.setState({ activeRectangles: activeRectangles });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  handleDragStop = (left, top, index) => {
    let activeRectangles = this.state.activeRectangles;
    activeRectangles[index].left = left;
    activeRectangles[index].top = top;
    this.setState({ activeRectangles: activeRectangles, dragging: false });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  handleColorChange = (color, index) => {
    let activeRectangles = this.state.activeRectangles;
    activeRectangles[index].backgroundColor = color;
    this.setState({ activeRectangles: activeRectangles });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  handleEditColorClicked = (
    index,
    toggleStatus,
    toggleDragStatus,
    toggleResizeStatus
  ) => {
    let activeRectangles = this.state.activeRectangles;
    activeRectangles[index].changeColor = toggleStatus;
    activeRectangles[index].changeColor = toggleStatus;
    activeRectangles[index].disableDragging = toggleDragStatus;
    activeRectangles[index].enableResizing = toggleResizeStatus;
    this.setState({ activeRectangles: activeRectangles });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  handleRectangleDelete = (index) => {
    let activeRectangles = this.state.activeRectangles;
    activeRectangles.splice(index, 1);
    this.setState({ activeRectangles: activeRectangles });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  handleLoadPattern = (pattern, name) => {
    this.setState({ activeRectangles: pattern, newPatternName: name });
  };

  render() {
    return (
      <div className="d-flex flex-column col-12 col-lg-8">
        <div className="">
          <div className="my-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                this.addReactangle();
              }}
            >
              ADD RECTANGLE
            </button>

            <div className="d-flex flex-row my-3">
              <input
                type="text"
                placeholder="Enter Pattern Name"
                className="form-control mr-4"
                style={{ maxWidth: "400px" }}
                value={this.state.newPatternName || ""}
                onChange={(e) =>
                  this.setState({ newPatternName: e.target.value })
                }
              ></input>

              <button
                className="btn btn-success"
                onClick={() => {
                  if (
                    this.state.newPatternName &&
                    this.state.activeRectangles.length > 0
                  ) {
                    this.setState({ newPatternNameError: null });
                    this.savePattern();
                  } else {
                    !this.state.newPatternName
                      ? this.setState({
                          newPatternNameError:
                            "Please enter valid name to save pattern.",
                        })
                      : this.setState({
                          newPatternNameError:
                            "Please add rectangles to save the pattern.",
                        });
                  }
                }}
              >
                SAVE PATTERN
              </button>
            </div>
            {this.state.newPatternNameError ? (
              <div>
                <small className="text-danger">
                  {this.state.newPatternNameError}
                </small>
              </div>
            ) : null}
          </div>
          <div
            className={
              this.state.dragging
                ? "dragging new-pattern-container"
                : "new-pattern-container"
            }
          >
            {this.state.activeRectangles.length > 0 ? (
              <h2 className="new-pattern-container-hint-text">
                Drag or Resize Rectangle
              </h2>
            ) : null}
            {this.state.activeRectangles
              ? this.state.activeRectangles.map((res, index) => {
                  return (
                    <Rnd
                      key={index}
                      bounds={"parent"}
                      className="rectangle"
                      style={{
                        background: res.backgroundColor,
                      }}
                      size={{
                        width: res.width,
                        height: res.height,
                      }}
                      enableResizing={res.enableResizing}
                      disableDragging={res.disableDragging}
                      position={{ x: res.left, y: res.top }}
                      onDrag={() => {
                        this.setState({ dragging: true });
                      }}
                      onDragStop={(e, d) => {
                        this.handleDragStop(d.x, d.y, index);
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        this.handleResizeStop(
                          ref.style.width,
                          ref.style.height,
                          position.x,
                          position.y,
                          index
                        );
                      }}
                    >
                      <div className="rectangle-edit-wrapper">
                        {res.changeColor ? (
                          <div className=" div-color-picker">
                            <div
                              className="icon"
                              onClick={() =>
                                this.handleEditColorClicked(
                                  index,
                                  false,
                                  false,
                                  true
                                )
                              }
                            >
                              <AiOutlineClose />
                            </div>
                            <SketchPicker
                              className="color-picker"
                              color={res.backgroundColor}
                              onChangeComplete={(e) => {
                                this.handleColorChange(e.hex, index);
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="icon"
                            onClick={() =>
                              this.handleEditColorClicked(
                                index,
                                true,
                                true,
                                false
                              )
                            }
                          >
                            <AiOutlineBgColors />
                          </div>
                        )}

                        <div
                          className="icon"
                          onClick={() => this.handleRectangleDelete(index)}
                        >
                          <AiOutlineDelete />
                        </div>
                      </div>
                    </Rnd>
                  );
                })
              : null}
          </div>
        </div>
        <div className="text-right my-3">
          <button
            className="btn btn-danger"
            onClick={() => {
              this.setState({ activeRectangles: [], newPatternName: null });
              cookie.save("activeRectangles", [], {
                path: "/",
              });
            }}
          >
            CLEAR CANVAS
          </button>
        </div>
      </div>
    );
  }
}

export default Canvas;
