import _ from 'lodash'
import request from "superagent";
import React, { Component } from 'react'
import { Search, Dropdown, Menu } from 'semantic-ui-react'
import BookModal from "../Modal"
import AuthorModal from "../AuthorModal"
import CategoryModal from "../CategoryModal"
import "./style.css";

export default class DropdownSearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      dropdownText: "Options",
    }
  }
  handleClick = (e, selection) => {
   this.setState({searchType: selection.value,
                  dropdownText: selection.text,
                  isSelected: true}) 
  }
  resetComponent = () => this.setState({ isSelected: false, searchType: "authors"})

  componentWillMount() {
    this.resetComponent();
  }
  componentWillReceiveProps(){
    this.resetComponent();
  }

  render(){
    const {searchType, dropdownText} = this.state
    return(
      <div>
      <div className="custom-search">
        <CustomSearch searchType={searchType} />
      </div>
      <div className="custom-search">
        <Menu compact>
          <Dropdown text={dropdownText} className='item'>
            <Dropdown.Menu>
              <Dropdown.Item onClick={this.handleClick} text="Authors" value="authors"></Dropdown.Item>
              <Dropdown.Item onClick={this.handleClick} text="Books" value="books"></Dropdown.Item>
              <Dropdown.Item onClick={this.handleClick} text="Categories" value="categories"></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>  
      </div>
      </div>
    );
  }
}



class CustomSearch extends Component {
  constructor(props){
      super(props);
      this.state = {
          books: [],
          selectedBook: {
            author: '',
            title: '',
            category: '',
          },
          shouldOpen: false,
      }
  }
    componentWillMount() {
        this.resetComponent();
    }
    componentDidMount() {
      this.resetComponent();
        var self = this;
        request
            .get("/api/" + this.props.searchType)
            .end(function (err, res) {
                self.setState({books: JSON.parse(res.text)});
            });
    }

    componentWillReceiveProps(nextProps) {
      var self = this;
      this.resetComponent();
      if(nextProps.searchType !== this.props.searchType){
      this.resetComponent();
      request
            .get("/api/" + nextProps.searchType)
            .end(function (err, res) {
                self.setState({books: JSON.parse(res.text),});
            });
      }
  }
  
  resetComponent = () => this.setState({ isLoading: false, results: [], value: '', shouldOpen: false })

  handleResultSelect = (e, result) => {
    e.preventDefault();
    this.setState({ value: result.title});
    if(this.props.searchType === "books"){
      this.setState({selectedBook: {
        author:result.description,
        title: result.title,
      },
        shouldOpen: true,
        value: ''
      });
    }
    else if(this.props.searchType === "authors"){
      this.setState({selectedBook: {
        author: result.title,
      },
        shouldOpen: true,
        value: ''
      });
    }
    else if(this.props.searchType === "categories"){
      this.setState({selectedBook: {
        category: result.title,
      },
      shouldOpen: true,
      value: ''
    });
    }
  }
  

  handleSearchChange = (e, value) => {
    this.setState({ shouldOpen:false, isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.books, isMatch).slice(0,7),
      })
    }, 500)
  }
  render() {
    const { isLoading, value, results, shouldOpen, selectedBook} = this.state
    const { searchType } = this.props;
    return (
      <section>
          <Search 
            size="big"
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            noResultsMessage="No Results..."
            minCharacters={1}
            results={results}
            value={value}
          />
          {
            searchType === "books" ? (<BookModal isOpen={shouldOpen} author={selectedBook.author} bookName={selectedBook.title} />)
            : searchType === "authors" ? (<AuthorModal isOpen={shouldOpen} author={selectedBook.author} />) : 
            (<CategoryModal isOpen={shouldOpen} category={selectedBook.category} />) 
          }
      </section>
    )
  }
}
CustomSearch.propTypes = {
  searchType: React.PropTypes.string.isRequired,
}