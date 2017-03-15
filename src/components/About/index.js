// src/components/About/index.js
import React, { Component } from "react";
import {Header, Container } from "semantic-ui-react"
import {Link} from "react-router";

import "./style.css";

export default class About extends Component {

    render() {
        return (
          <div className="About">
            <Container textAlign="center" className="About">
              <Header as="h1">About</Header>
              <p>BookStrap is created to provide an easy and useful way of organizing and collecting
              ebooks. It is very easy to use and low on resources. It also has a contact form powered 
              by sendgrid configured, but it is optional. For more information about how to use it,
              please refer to the project page at
              <Link to="https://github.com/aeroith/BookStrap" target="_blank"> Github </Link>
              and you can also write to me using the form at <Link to="/contact"> Contact. </Link></p>
            </Container>
         </div>
        );
    }
}