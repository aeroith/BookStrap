import React from "react";
import ReactDOM from "react-dom";
import AuthorModal from "../components/AuthorModal";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<AuthorModal />, div);
});
