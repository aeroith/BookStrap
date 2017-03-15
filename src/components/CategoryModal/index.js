import _ from 'lodash'
import request from "superagent";
import React, { PropTypes, Component } from 'react'
import {List, Header, Modal, Button } from 'semantic-ui-react'
import BookModal from "../Modal"
import "./style.css"

export default class CategoryModal extends Component {
    constructor(props){
        super(props);
        this.state= {
            open:false,
            titles: [],
            selectedTitle: '',
            shouldOpen: false,
            page: 1,
            totalPages: 1,
            isNextDisabled: true,
            isPrevDisabled: true,
        };

    }
    open = () => this.setState({ open: true })
    close = () => {
        this.setState({ open: false })
        if(this.props.exit)
            this.props.exit();
    }
    resetComponent = () => this.setState({ selectedTitle: '', });
    resetPage = () => this.setState({ page: 1, totalPages:1, isPrevDisabled: true });

    componentWillReceiveProps(nextProps){
        var self = this;
        this.resetPage();
        if(nextProps.category!== '')
        request.get(`/api/getcategory/${nextProps.category}`)
                   .end((err, res) => {
                       let title_buffer = JSON.parse(res.text);
                       self.setState({titles: title_buffer,
                       open: nextProps.isOpen,
                       totalPages: Math.ceil(title_buffer.length/4),
                       isNextDisabled: title_buffer.length < 4 ? true : false });
                   });
    }

    componentWillUnmount(){
        this.setState({isOpen: false});
    }
    handleClick = (e, value) => {
        this.setState({selectedTitle: value.children,
                       selectedAuthor: value.authorName,
                        shouldOpen:true});
    }
    handleNextPage = () => {
        this.resetComponent();
        this.setState({
        isNextDisabled: (this.state.page + 1) >= this.state.totalPages ? true : false, 
        page: this.state.page + 1,
        isPrevDisabled: false
    })}
    handlePrevPage = () => {
        this.resetComponent();
        this.setState({
        isPrevDisabled: this.state.page === 2 ? true : false, 
        page: this.state.page - 1,
        isNextDisabled: false
    })}
    render(){
        const {category} = this.props;
        const {open, titles, shouldOpen, selectedTitle, selectedAuthor, page} = this.state;
        return(

            <Modal dimmer="blurring"
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size="small"
                closeIcon="close"
                > 
            <Modal.Header>{category}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Header>{category}</Header>
                    <List>
                        {titles.slice((page - 1) * 4, page * 4).map((title, i) => 
                            (<Button size="medium" key={i} authorName={title.author} onClick={this.handleClick}>{title.title}</Button>
                            ))}
                    </List>
                    <Button icon="left arrow"
                        className="category-button"
                        floated="left"
                        size="medium"
                        color="facebook"
                        onClick={this.handlePrevPage}
                        disabled={this.state.isPrevDisabled} ></Button>
                 <Button icon="right arrow"
                        className="category-button"
                        floated="right"
                        size="medium"
                        color="facebook"
                        onClick={this.handleNextPage}
                        disabled={this.state.isNextDisabled}></Button>                   
                </Modal.Description>
            </Modal.Content>
            <BookModal isOpen={shouldOpen} author={selectedAuthor} bookName={selectedTitle} />
        </Modal>

        );
    }
}
CategoryModal.PropTypes = {
    category: PropTypes.string.isRequired,
    exit: PropTypes.func
}