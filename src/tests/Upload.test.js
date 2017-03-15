import React from "react";
import ReactDOM from "react-dom";
import Upload from "../components/Upload";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Upload />, div);
});
