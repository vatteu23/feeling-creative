import React, { Component } from "react";
import { Rnd } from "react-rnd";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { SketchPicker } from "react-color";
import {
  AiOutlineBgColors,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";
import cookie from "react-cookies";
import { isEmptyObject } from "jquery";

class Canvas extends Component {
  patternContainer = React.createRef();
  constructor() {
    super();

    this.state = {
      activeRectangles: cookie.load("activeRectangles") || [],
      activeRectanglesNoOverlap: cookie.load("activeRectanglesNoOverlap") || {
        layout: [],
        layoutProps: [],
      },
      overLap: cookie.load("overLap") || "Yes",
      savedPatterns: cookie.load("savedPatterns") || null,
      noOverLapWidth: 600,
    };
  }

  componentDidMount = () => {};

  //function to save newly created pattern,
  //overlap param is used because each case (overlap and no overlap) is saving data in a different way
  savePattern = (overLap) => {
    let savedPatterns = cookie.load("savedPatterns") || {};

    if (overLap) {
      let temp = {};
      temp.overLap = overLap;
      temp.rectangles = this.state.activeRectangles;
      savedPatterns[this.state.newPatternName] = temp;
    } else {
      let temp = {};
      temp.overLap = overLap;
      temp.rectangles = this.state.activeRectanglesNoOverlap;
      savedPatterns[this.state.newPatternNameNoOverlap] = temp;
    }
    cookie.save("savedPatterns", savedPatterns, {
      path: "/",
    });
    this.setState({ savedPatterns: savedPatterns });
  };

  //function to update layout changes for no overlap case
  onLayoutChange = (layout) => {
    let activeRectanglesNoOverlap = this.state.activeRectanglesNoOverlap;
    activeRectanglesNoOverlap.layout = layout;
    this.setState({ activeRectanglesNoOverlap: activeRectanglesNoOverlap });
    cookie.save("activeRectanglesNoOverlap", activeRectanglesNoOverlap, {
      path: "/",
    });
  };

  //add rectangles to a given area.
  addReactangle = (overLap) => {
    if (!overLap) {
      let temp = { i: "a", x: 0, y: 0, w: 1, h: 2 };
      let tempProps = {
        backgroundColor: "#ffffff",
        changeColor: false,
        disableDragging: false,
        enableResizing: true,
      };

      let activeRectanglesNoOverlap = this.state.activeRectanglesNoOverlap;
      activeRectanglesNoOverlap.layout.push(temp);
      activeRectanglesNoOverlap.layoutProps.push(tempProps);
      this.setState({ activeRectanglesNoOverlap: activeRectanglesNoOverlap });
      cookie.save("activeRectanglesNoOverlap", activeRectanglesNoOverlap, {
        path: "/",
      });
    } else {
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
    }
  };

  //handle resize for overlap = true
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

  //handle drag stop for overlap = true
  handleDragStop = (left, top, index) => {
    let activeRectangles = this.state.activeRectangles;
    activeRectangles[index].left = left;
    activeRectangles[index].top = top;
    this.setState({ activeRectangles: activeRectangles, dragging: false });
    cookie.save("activeRectangles", activeRectangles, {
      path: "/",
    });
  };

  //handle change in background color for overlap = true
  handleColorChange = (overLap, color, index) => {
    if (overLap) {
      let activeRectangles = this.state.activeRectangles;
      activeRectangles[index].backgroundColor = color;
      activeRectangles[index].changeColor = !activeRectangles[index]
        .changeColor;
      activeRectangles[index].disableDragging = !activeRectangles[index]
        .disableDragging;
      activeRectangles[index].enableResizing = !activeRectangles[index]
        .enableResizing;
      this.setState({ activeRectangles: activeRectangles });
      cookie.save("activeRectangles", activeRectangles, {
        path: "/",
      });
    } else {
      let activeRectanglesNoOverlap = this.state.activeRectanglesNoOverlap;
      activeRectanglesNoOverlap.layoutProps[index].backgroundColor = color;
      activeRectanglesNoOverlap.layoutProps[
        index
      ].changeColor = !activeRectanglesNoOverlap.layoutProps[index].changeColor;

      this.setState({ activeRectanglesNoOverlap: activeRectanglesNoOverlap });
      cookie.save("activeRectanglesNoOverlap", activeRectanglesNoOverlap, {
        path: "/",
      });
    }
  };

  //function to handle color picker for each triangle
  handleEditColorClicked = (
    overLap,
    index,
    toggleStatus,
    toggleDragStatus,
    toggleResizeStatus
  ) => {
    if (overLap) {
      let activeRectangles = this.state.activeRectangles;
      activeRectangles[index].changeColor = toggleStatus;
      activeRectangles[index].disableDragging = toggleDragStatus;
      activeRectangles[index].enableResizing = toggleResizeStatus;
      this.setState({ activeRectangles: activeRectangles });
      cookie.save("activeRectangles", activeRectangles, {
        path: "/",
      });
    } else {
      console.log(toggleStatus);
      let activeRectanglesNoOverlap = this.state.activeRectanglesNoOverlap;
      activeRectanglesNoOverlap.layoutProps[index].changeColor = toggleStatus;

      this.setState({ activeRectanglesNoOverlap: activeRectanglesNoOverlap });
      cookie.save("activeRectanglesNoOverlap", activeRectanglesNoOverlap, {
        path: "/",
      });
    }
  };

  //funciton to handle deleting rectangles
  handleRectangleDelete = (overLap, index) => {
    if (overLap) {
      let activeRectangles = this.state.activeRectangles;
      activeRectangles.splice(index, 1);
      this.setState({ activeRectangles: activeRectangles });
      cookie.save("activeRectangles", activeRectangles, {
        path: "/",
      });
    } else {
      let activeRectanglesNoOverlap = this.state.activeRectanglesNoOverlap;
      activeRectanglesNoOverlap.layout.splice(index, 1);
      activeRectanglesNoOverlap.layoutProps.splice(index, 1);
      this.setState({ activeRectanglesNoOverlap: activeRectanglesNoOverlap });
      cookie.save("activeRectanglesNoOverlap", activeRectanglesNoOverlap, {
        path: "/",
      });
    }
  };

  //function to load patterns from a set of saved patterns
  handleLoadPattern = (overLap, pattern, name) => {
    if (overLap) {
      this.setState({
        activeRectangles: pattern,
        newPatternName: name,
        overLap: "Yes",
      });
    } else {
      this.setState({
        activeRectanglesNoOverlap: pattern,
        newPatternNameNoOverlap: name,
        overLap: "No",
      });
    }
  };

  //function to handle selection between overlap and no overlap.
  //Also saving the selection in cookie for better user experience
  handleSelect = (e) => {
    cookie.save("overLap", e.target.value, { path: "/" });
    this.setState({ overLap: e.target.value });
  };

  //function to handle delete a pattern from the saved set
  handleDeleteSaved = (key) => {
    let savedPatterns = cookie.load("savedPatterns");
    delete savedPatterns[key];
    cookie.save("savedPatterns", savedPatterns, { path: "/" });
    this.setState({ savedPatterns: savedPatterns });
  };

  //workaround for dyanmic width for nooverlap pattern container width
  getWidthNoOverLap = () => {
    if (this.patternContainer) {
      if (this.patternContainer["current"]) {
        return this.patternContainer.current.clientWidth;
      }
    }
    return this.state.noOverLapWidth;
  };

  render() {
    return (
      <React.Fragment>
        <div className=" col-12 col-lg-8 mt-5">
          <div className="col-12 text-center mb-5">
            <h3> Create pattern using RECTANGLES</h3>
            Do you want Rectangles to overlap ?{" "}
            <select
              className=""
              onChange={this.handleSelect}
              value={this.state.overLap}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {this.state.overLap === "No" ? (
            <div className="d-flex flex-column">
              <div className="">
                <div className="my-3">
                  <div className="d-flex flex-row my-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.addReactangle(false);
                      }}
                    >
                      ADD RECTANGLE
                    </button>
                    <input
                      type="text"
                      placeholder="Enter Pattern Name"
                      className="form-control mx-3"
                      style={{ maxWidth: "400px" }}
                      value={this.state.newPatternNameNoOverlap || ""}
                      onChange={(e) =>
                        this.setState({
                          newPatternNameNoOverlap: e.target.value,
                        })
                      }
                    ></input>

                    <button
                      className="btn btn-success"
                      onClick={() => {
                        if (
                          this.state.newPatternNameNoOverlap &&
                          this.state.activeRectanglesNoOverlap.layout.length > 0
                        ) {
                          this.setState({ newPatternNameErrorNoOverlap: null });
                          this.savePattern(false);
                        } else {
                          !this.state.newPatternNameNoOverlap
                            ? this.setState({
                                newPatternNameErrorNoOverlap:
                                  "Please enter valid name to save pattern.",
                              })
                            : this.setState({
                                newPatternNameErrorNoOverlap:
                                  "Please add rectangles to save the pattern.",
                              });
                        }
                      }}
                    >
                      SAVE PATTERN
                    </button>
                  </div>
                  {this.state.newPatternNameErrorNoOverlap ? (
                    <div>
                      <small className="text-danger">
                        {this.state.newPatternNameErrorNoOverlap}
                      </small>
                    </div>
                  ) : null}
                </div>
                <div
                  className={
                    this.state.dragging
                      ? "dragging new-pattern-container-no"
                      : "new-pattern-container-no"
                  }
                  ref={this.patternContainer}
                >
                  {this.state.activeRectanglesNoOverlap.layout.length > 0 ? (
                    <h2 className="new-pattern-container-hint-text">
                      Drag or Resize Rectangle
                    </h2>
                  ) : null}
                  {this.state.activeRectanglesNoOverlap.layout.length > 0 ? (
                    <ResponsiveGridLayout
                      className="layout"
                      draggable={true}
                      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                      rowHeight={30}
                      height={690}
                      compactType={null}
                      preventCollision={true}
                      //   width={WidthProvider(ResponsiveGridLayout)}
                      width={this.getWidthNoOverLap()}
                      breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                      }}
                      onLayoutChange={this.onLayoutChange}
                      isResizable={true}
                      isDraggable={true}
                    >
                      {this.state.activeRectanglesNoOverlap.layout.map(
                        (res, index) => {
                          return (
                            <div
                              className="rectangle"
                              key={index}
                              style={{
                                backgroundColor: this.state
                                  .activeRectanglesNoOverlap.layoutProps[index]
                                  .backgroundColor,
                              }}
                              data-grid={{
                                x: res.x,
                                y: res.y,
                                w: res.w,
                                h: res.h,
                                minW: 0,
                                maxW: Infinity,
                                minH: 0,
                                maxH: Infinity,

                                isDraggable: true,
                                isResizable: true,
                                resizeHandles: [
                                  "se",
                                  "w",
                                  "s",
                                  "e",
                                  "n",
                                  "sw",
                                  "nw",
                                  "ne",
                                ],
                                isBounded: true,
                              }}
                            >
                              <div className="rectangle-edit-wrapper">
                                {this.state.activeRectanglesNoOverlap
                                  .layoutProps[index].changeColor ? (
                                  <div className=" div-color-picker">
                                    <div
                                      className="icon"
                                      onClick={() =>
                                        this.handleEditColorClicked(
                                          false,
                                          index,
                                          false,
                                          false,
                                          false
                                        )
                                      }
                                    >
                                      <AiOutlineClose />
                                    </div>
                                    <SketchPicker
                                      className="color-picker"
                                      color={res.backgroundColor}
                                      onChangeComplete={(e) => {
                                        this.handleColorChange(
                                          false,
                                          e.hex,
                                          index
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="icon"
                                    onClick={() =>
                                      this.handleEditColorClicked(
                                        false,
                                        index,
                                        true,
                                        false,
                                        false
                                      )
                                    }
                                  >
                                    <AiOutlineBgColors />
                                  </div>
                                )}

                                <div
                                  className="icon"
                                  onClick={() =>
                                    this.handleRectangleDelete(false, index)
                                  }
                                >
                                  <AiOutlineDelete />
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </ResponsiveGridLayout>
                  ) : null}
                </div>
              </div>

              <div className="text-right my-3">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    let activeRectanglesNoOverlap = {
                      layout: [],
                      layoutProps: [],
                    };
                    this.setState({
                      activeRectanglesNoOverlap: activeRectanglesNoOverlap,
                      newPatternNameNoOverlap: null,
                    });
                    cookie.save(
                      "activeRectanglesNoOverlap",
                      activeRectanglesNoOverlap,
                      {
                        path: "/",
                      }
                    );
                  }}
                >
                  CLEAR CANVAS
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="">
                <div className="my-3">
                  <div className="d-flex flex-row my-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.addReactangle(true);
                      }}
                    >
                      ADD RECTANGLE
                    </button>
                    <input
                      type="text"
                      placeholder="Enter Pattern Name"
                      className="form-control mx-3"
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
                          this.savePattern(true);
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
                            onResizeStop={(
                              e,
                              direction,
                              ref,
                              delta,
                              position
                            ) => {
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
                                        true,
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
                                      this.handleColorChange(
                                        true,
                                        e.hex,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="icon"
                                  onClick={() =>
                                    this.handleEditColorClicked(
                                      true,
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
                                onClick={() =>
                                  this.handleRectangleDelete(true, index)
                                }
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
                    this.setState({
                      activeRectangles: [],
                      newPatternName: null,
                    });
                    cookie.save("activeRectangles", [], {
                      path: "/",
                    });
                  }}
                >
                  CLEAR CANVAS
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-lg-4 mt-5 saved-patterns">
          <h5> SAVED PATTERNS</h5>
          <div className="list-group">
            {this.state.savedPatterns &&
            !isEmptyObject(this.state.savedPatterns)
              ? Object.keys(this.state.savedPatterns).map((res, index) => {
                  return (
                    <div key={index} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>{res}</div>
                        <div
                          className="icon"
                          onClick={() => this.handleDeleteSaved(res)}
                        >
                          <AiOutlineDelete />
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            this.handleLoadPattern(
                              this.state.savedPatterns[res].overLap,
                              this.state.savedPatterns[res].rectangles,
                              res
                            )
                          }
                        >
                          Load Pattern
                        </button>
                      </div>
                    </div>
                  );
                })
              : "No saved patterns yet."}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Canvas;
