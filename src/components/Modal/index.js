import _ from 'lodash'
import request from "superagent";
import React, {PropTypes, Component } from 'react'
import { Rating, Header, Image, Modal, Button, Icon, List, Dimmer, Loader, Message } from 'semantic-ui-react'
import {Link} from "react-router"
import CategoryModal from "../CategoryModal"
import "./style.css";

export default class BookModal extends Component {
    constructor(props){
        super(props);
        this.state = { open: false,
                       categoryOpen: false,
                       isLoading: false,
                       isSent: false,
                       bookContent: [
                       {
                        author:'',
                        title:'',
                        description:'',
                        cover: '',
                        subject: [''],
                        publisher: '',
                        pubdate: '',
                        rating: '',
                        bookName: '',
                       }
                    ],}
    }
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    handleDownload = () => {
        request.get(`/books/${this.state.bookContent[0].author}/${this.state.bookContent[0].title}/${this.state.bookContent[0].bookName}`) 
                                        .end((err, res) => {
                                            if(err) console.log("not available");
                                        });
    }
    handleKindleSend = e => {
        var self = this;
        this.setState({ isLoading: true })
        request.post("/sendtokindle")
            .send(self.state.bookContent[0])
            .end((err, resp) => {
                if (err) {
                    this.setState({ isLoading: false, isSent: true, isSuccessful: false })
                    return resp;
                }
                else {
                    setInterval(() => {
                        this.setState({ isLoading: false, isSent: true, isSuccessful: true })
                    }, 1000);
                    return resp;
                }
            })
    }
    
    handleRating = (e,data) => {
        const book = this.state.bookContent[0];
        e.preventDefault()
        request.put("/rate")
                .send({author: book.author, title: book.title, rating: data.rating})
                .end((err,resp) => {
                    if(!err)
                    return(resp)
                })
    }

    componentWillReceiveProps(nextProps){
        let self = this;
        if(nextProps.author !== '' && (typeof nextProps.author !== "undefined"))
        request.get(`/api/getbook/${nextProps.author}/${nextProps.bookName}`)
                   .end((err, res) => {
                       self.setState({bookContent: JSON.parse(res.text),
                       open: nextProps.isOpen});
                   });
    }
    componentWillUnmount(){
        this.setState({isOpen: false});
    }
    render(){
        // TODO: Add placeholder image if cover is not found
        // used regexp to extract description
        // using browser's html parser could be used if any bugs are introduced 
        const {open, bookContent, isLoading, isSent, isSuccessful} = this.state
        return(
        // conditional rendering to prevent unnecessary render
         open && <Modal dimmer="blurring"
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size="large"
                closeIcon="close"
                > 
            <Modal.Header>
                {bookContent[0].author}
                <Rating style={{float:"right", "margin":"5px 10px 0px 0px"}} size="large" 
                defaultRating={bookContent[0].rating / 2} maxRating={5} icon="star" 
                onRate={this.handleRating}/>
            </Modal.Header>
            <Modal.Content image>
            <Image wrapped className="ModalImage" size='large' 
            src={`/books/${bookContent[0].author}/${bookContent[0].title}/${bookContent[0].cover}`} />
            <Modal.Description>
                <Header>{bookContent[0].title}</Header>
                {
                    bookContent[0].description ?
                    bookContent[0].description.replace(/<\/?[^>]+(>|$)/g, "")
                    : "No description is available for this book"
                }
                <br/>
                <br/>
                <SubjectList handleClose={this.close} subjects={bookContent[0].subject} />
                <br />
                <br />
                {bookContent[0].publisher && <Header className="publisher" floated="left">Publisher: {bookContent[0].publisher}</Header>}
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="blue" onClick={this.handleKindleSend} className="functional-button">
                    <Button.Content visible><Icon name="send" /><span> Send to Kindle</span></Button.Content>
                </Button>
                <Button className="close-button" style={{float:"left"}} color='red'
                 onClick={this.close}>
                    <Button.Content visible><Icon name="close" /></Button.Content>
                 </Button>
                <Button color="green" as={Link} className="functional-button"
                to={`/download/${bookContent[0].author}/${bookContent[0].title}/${bookContent[0].bookName}`.replace(/#/g, '%23')} 
                target="_blank">
                    <Button.Content visible><Icon name="arrow circle down" /><span> Download</span></Button.Content>
                </Button>
                <KindleLoader status={isLoading}/>
            </Modal.Actions>
            <KindleMessage open={isSent} result={isSuccessful}/>
            <br />
            <br />
        </Modal> 
        );
    }
}
BookModal.propTypes = {
  isOpen: React.PropTypes.bool,
  bookName: React.PropTypes.string,
  author: React.PropTypes.string,
};

class SubjectList extends Component {
    constructor(props){
        super(props);
        this.state = {shouldOpen: false, selectedCategory: ""}
    }
    handleSubjectClick = (e, value) => {
        this.setState({shouldOpen:true, selectedCategory: value.children})
    }
     
    // exit prop is there to prevent buggy behaviour caused by modal inside modal
    render() {
        const {subjects, handleClose} = this.props
        const {shouldOpen, selectedCategory} = this.state
        return(
            <section>
            <List bulleted horizontal>
                {subjects.map((subject, i) => (
                    <Button key={i} className="subject-button" onClick={this.handleSubjectClick}>{subject}</Button>
                ))}
            </List>
            <CategoryModal exit={handleClose} isOpen={shouldOpen} category={selectedCategory} />
            </section>
        );
    }
}
SubjectList.PropTypes = {
    subjects: PropTypes.array.isRequired,
    handleClose: PropTypes.func.isRequired
}

const KindleLoader = (props) => {
    return(
    <Dimmer active={props.status}>
       <Loader>Sending the book</Loader> 
    </Dimmer>
    );
}

const KindleMessage = (props) => {
    return (
        props.open ? props.result ?
            <Message positive>
                <Message.Content>
                <Message.Header>Operation Successful!</Message.Header>
                Selected book is successfully sent to the Kindle device!
                </Message.Content>
                    </Message> :
            <Message negative>
                <Message.Content>
                <Message.Header>Operation Failed!</Message.Header>
                There are currently too many operations. Please try again later.
                </Message.Content>
                    </Message> :
            <div></div>

    )
}