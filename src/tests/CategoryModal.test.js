import React from "react";
import ReactDOM from "react-dom";
import CategoryModal from "../components/CategoryModal";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<CategoryModal />, div);
});
