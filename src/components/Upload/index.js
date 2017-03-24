import React, {PropTypes, Component } from "react";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import request from "superagent";
import "./style.css";
import dropzoneIcon from "./dropzone.png";
import { Message, Progress} from "semantic-ui-react";

export default class Upload extends Component {

    render() {
        const {
    className
  } = this.props;
        return (
    <div className={classnames("Upload", className)}>
      <div className="Upload-header">
      </div>
      <FileUpload/>
    </div>
  );
    }
}

class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: [],
            hidden: true,
            uploadStatus: false,
            percent: 0,
        };
        this.onDropAccepted = this
            .onDropAccepted
            .bind(this);
        this.onDropRejected = this
            .onDropRejected
            .bind(this);
    }
    dropHandler(file) {
        this.setState({uploadStatus: true});
        var self = this;
        var epub = new FormData();
        epub.append("epub", file[0]);
        request
            .post("/upload")
            .send(epub)
            .on("progress", event => {
                this.setState({percent: event.percent});
            })
            .end(function (err, resp) {
                if (err) {
                    console.error(err);
                    self.setState({status: false, hidden: false});
                }
                else {
                    self.setState({ file, status: true, hidden: false});
                    return (resp);
                }
            });
    }
    onDropAccepted(file) {
        this.dropHandler(file);
    }
    onDropRejected(files) {
        this.setState({files, status: false, hidden: false});
    }
    render() {
        return (
            <section>
                <div className="dropzone">
                    <UploadMessage hidden={this.state.hidden}
                        status={this.state.status}
                    />
                    <ProgressBar active={this.state.uploadStatus}
                                 percent={this.state.percent} />
                    <Dropzone className="dropzone"
                        // multiple files are allowed
                        multiple={true}
                        // accept only epub files
                        accept="application/epub+zip"
                        onDropAccepted={this.onDropAccepted}
                        onDropRejected={this.onDropRejected}
                        // max file size in bytes
                        maxSize={15 * 1024 * 1024}>
                        <img src={dropzoneIcon} alt="Upload" />
                        <h3>Upload!</h3>
                    </Dropzone>
                </div>
            </section>
        );
    }
}

class UploadMessage extends Component {
    render(){
        const {hidden, status} = this.props;
        return(
            <Message
                hidden={hidden}
                success={status}
                error={!status}
                header={status ? "File Uploaded!" : "Error!"}
                content={status ? "File successfully added." :
            "Please make sure that file is and epub file and size less than 15MB" }
            />
        );
    }
}
UploadMessage.PropTypes = {
    hidden: PropTypes.bool,
    success: PropTypes.bool
};

const ProgressBar = props => {
    return(
        props.active ? 
        <Progress percent={props.percent}
        label="Uploading"
        progress
        indicating
        autoSuccess /> :
        <div></div>
    ); 
};