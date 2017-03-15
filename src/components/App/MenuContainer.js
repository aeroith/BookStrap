import React, {Component} from "react";
import { Link } from 'react-router';
import { Header, Image, Grid } from 'semantic-ui-react';
import contact from "./contact.png";
import about from "./about.png";
import upload from "./upload.png";

export default class MenuContainer extends Component{
    render(){
        return(
            <Grid container columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <Image src={about} shape="rounded" as={Link} to="/about" className="MenuImage"></Image>
                    </Grid.Column>
                    <Grid.Column>
                        <Image src={upload} shape="rounded" as={Link} to="/upload" className="MenuImage"></Image>
                    </Grid.Column>
                    <Grid.Column>
                        <Image src={contact} shape="circular" as={Link} to="/contact" className="MenuImage"></Image>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="title-grid">
                    <Grid.Column>
                        <Header as="h3">About</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h3">Upload Books</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h3">Contact</Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}