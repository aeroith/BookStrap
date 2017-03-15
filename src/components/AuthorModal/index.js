import _ from 'lodash'
import request from "superagent";
import React, { PropTypes, Component } from 'react'
import {List, Header, Modal, Button } from 'semantic-ui-react'
import BookModal from "../Modal"

export default class AuthorModal extends Component {
    constructor(props){
        super(props);
        this.state= {
            open:false,
            titles: [],
            selectedTitle: '',
            shouldOpen: false,
        };
    }
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentWillReceiveProps(nextProps){
        var self = this;
        if(nextProps.author !== '')
        request.get(`/api/authorlist/${nextProps.author}`)
                   .end((err, res) => {
                       self.setState({titles: JSON.parse(res.text),
                       open: nextProps.isOpen});
                   });
    }

    componentWillUnmount(){
        this.setState({isOpen: false});
    }
    handleClick = (e, value) => {
        this.setState({selectedTitle: value.children,
                        shouldOpen:true});
    }
    render(){
        const {author} = this.props;
        const {open, titles, shouldOpen, selectedTitle} = this.state;
        return(

            <Modal dimmer="blurring"
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size="large"
                closeIcon="close"
                > 
            <Modal.Header>{author}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Header>Books</Header>
                    <List>
                        {titles.map((title, i) => (<Button size="big" key={i} onClick={this.handleClick}>{title.title}</Button>
                            ))}
                    </List>
                </Modal.Description>
            </Modal.Content>
            <BookModal isOpen={shouldOpen} author={author} bookName={selectedTitle} />
        </Modal>
        );
    }
}
AuthorModal.PropTypes = {
    author: PropTypes.string.isRequired
}