import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import MenuContainer from "../components/App/MenuContainer";
import DropdownSearch from "../components/App/customSearch";
import { shallow, mount } from "enzyme";
it("renders without crashing", () => {
    shallow(<App />);
    shallow(<MenuContainer />);
    shallow(<DropdownSearch />);
});
