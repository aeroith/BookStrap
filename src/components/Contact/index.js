import React, {PropTypes, Component} from "react";
import validator from 'validator';
import request from "superagent";
import {
    Container,
    Button,
    Form,
    Message,
    Checkbox
} from 'semantic-ui-react'
import "./style.css"

export default class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            hidden: true,
            status: false,
            errorMessage: '',
        };
    }
    componentWillMount(){
        this.resetComponent();
    }
    resetComponent = () => this.setState({formData: {}, visible:false });
    handleChange = (e, {value}) => this.setState({value});

    handleSubmit = (e, {formData}) => {
        e.preventDefault();
        if(validator.isEmail(formData.email) && !validator.isEmpty(formData.name) 
           && !validator.isEmpty(formData.subject) && formData.checked) {
            this.setState({formData, hidden: false, status: true});
            request.post("/mail")
                   .send(formData)
                   .end((err, resp) => {
                       if(err)
                        console.error(err);
                        return(resp);
                   });
           }
        else {
            if(validator.isEmpty(formData.name) || validator.isEmpty(formData.subject))
                this.setState({formData, hidden: false, status: false, errorMessage: 'Please fill all the fields'});
            else if(!validator.isEmail(formData.email))
                this.setState({formData, hidden: false, status: false, errorMessage: 'Please check your Email'});
            else
                this.setState({formData, hidden: false, status: false, errorMessage: 'Please check the checkbox'});
        }
    };

    render() {
    const { hidden, status, errorMessage} = this.state
        return (
            <Container text className="FormDiv">
            <Form className="Contact" onSubmit={this.handleSubmit}>
                <Form.Field>
                    <label>Your Name
                    </label>
                    <input name="name" placeholder='Your Name here...'/>
                </Form.Field>
                <Form.Field>
                    <label>Your Email</label>
                    <input name="email" placeholder='Your Email address...'/>
                </Form.Field>
                <Form.Field>
                    <Form.TextArea label="Message" name="subject" placeholder='Enter your text here...'/>
                    <Checkbox name="checked" label='I read the Readme on Github'/>
                </Form.Field>
                <Button primary type='submit'>Submit</Button>
            </Form>
            <FormMessage
            hidden={hidden}
            status={status}
            errorMessage={errorMessage}
             /> 
            </Container>

        );
    }
}
class FormMessage extends Component {
    render(){
        const {hidden, status, errorMessage} = this.props
        return(
            <Message
                hidden={hidden}
                success={status}
                error={!status}
                header={status ? 'Mail Sent!' : 'Error!'}
                content={status ? 'I will contact you as soon as possible.' : errorMessage}
            />
        );
    }
}
FormMessage.PropTypes = {
    hidden: PropTypes.bool,
    success: PropTypes.bool,
    errorMessage: PropTypes.string
}