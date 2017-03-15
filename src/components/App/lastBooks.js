import React, {PropTypes, Component} from "react";
import request from "superagent";
import "semantic-ui-css/semantic.css"; 
import { List, Header, Image, Button } from "semantic-ui-react";
import BookModal from "../Modal";
import "./style.css";

export default class LastBooks extends Component {
    constructor(){
        super();
        this.state = {
            lastbooks: [],
            page: 1,
            isPrevDisabled: true, 
            isNextDisabled: false,
            totalPages: 0,
            isloading: true 
        };
    }
    componentDidMount(){
        var self = this;
        request.get("/api/total")
                .end(function(err,res){
                    self.setState({totalPages: Number(res.text)});

       })
    }
    componentDidUpdate() {
        var self = this;
        if(this.state.isloading)
        request
            .get("/api/last/" + self.state.page)
            .end(function (err, res) {
                self.setState({lastbooks: JSON.parse(res.text),
                                isloading: false});
            });
    }
    handleNextPage = () => {this.setState({
        isNextDisabled: (this.state.page + 1) >= this.state.totalPages ? true : false, 
        page: this.state.page + 1,
        isloading: true,
        isPrevDisabled: false
    })}
    handlePrevPage = () => {this.setState({
        isPrevDisabled: this.state.page === 2 ? true : false, 
        page: this.state.page - 1,
        isloading: true,
        isNextDisabled: false
    })}
    render() {
        return (
            <div>
                <Header as="h2">Recently Added</Header>
                <div className="last-books-div">
                <Button icon="left arrow"
                        size="big"
                        color="facebook"
                        onClick={this.handlePrevPage}
                        disabled={this.state.isPrevDisabled} ></Button>
                <BookContainer books={this.state.lastbooks}/>
                <Button icon="right arrow"
                        size="big"
                        color="facebook"
                        onClick={this.handleNextPage}
                        disabled={this.state.isNextDisabled}></Button>
            </div>
            </div>
        );
    }
        
}

class BookContainer extends Component {
    render(){
        const {books} = this.props;
        return(
            <List className="book-container" horizontal>
            {books.map((book) => (
                <BookList book={book} key={book._id} />
            ))}
            </List>
        );
    }
}
BookContainer.propTypes = {
    books: PropTypes.array.isRequired,
}

class BookList extends Component {
    constructor(props){
        super(props);
        this.state = {shouldOpen: false};
    }
    componentWillMount(){
        this.resetComponent();
    }
    componentWillReceiveProps(nextProps){
        this.resetComponent();
    }
    componentWillUnmount(){
        this.resetComponent();
    }
    handleClick = (e) => {
        e.preventDefault();
        this.setState({shouldOpen: true});
    }
    resetComponent = () => this.setState({shouldOpen:false});

    render() {
        const {book} = this.props;
        const {shouldOpen} = this.state;
        return (
            <List.Item className="book-item" >
                <Image size="small" className="LastImg" src={`/books/${book.author}/${book.title}/${book.cover}`} 
                as="a" onClick={this.handleClick} />
                <br/>
                <List.Content>
                    <List.Header as="a" src={`/books/${book.author}/${book.title}/${book.cover}`} onClick={this.handleClick} >{book.title}</List.Header>
                    {book.author}
                    <List.Description>{book.publisher}</List.Description>
                </List.Content>
                <BookModal isOpen={shouldOpen} author={book.author} bookName={book.title} />
            </List.Item>
    );
    }
}
BookList.propTypes = {
    books: PropTypes.array,
}