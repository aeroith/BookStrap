// src/components/App/index.js
import React, {Component} from "react";
import {Link} from "react-router";
import CustomSearch  from "./customSearch";
import Home from "../Home";
import LastBooks from "./lastBooks";
import MenuContainer from "./MenuContainer";
import "semantic-ui-css/semantic.css"; 
import "./style.css";

class App extends Component {
    // static propTypes = {} static defaultProps = {} state = {}
    render() {
        return (
            <div>
                <div className="App">
                    <div className="container">
                        <h1 className="header"><Link to="/" activeStyle={{color:"white"}}>BookStrap</Link></h1>
                    </div>
                </div>
                <div className="Menu-div">
                    <MenuContainer/>
                </div>
                <div className="search-div">
                    <CustomSearch />
                </div>
                    {this.props.children || <Home />}
                <div className="search-div">
                    <LastBooks />
                </div>
            </div>
        );
    }
}

export default App;