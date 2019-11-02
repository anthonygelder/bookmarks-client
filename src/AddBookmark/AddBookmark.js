import React, { Component } from  'react';
import { Link } from 'react-router-dom';
import config from '../config'
import './AddBookmark.css';

class AddBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      url: "",
      description: "",
      rating: 1,
      error: null
    };
  }

  static defaultProps = {
    onAddBookmark: () => {}
  };

  titleChanged(title) {
    this.setState({
      title
    });
  }

  urlChanged(url) {
    this.setState({
      url
    });
  }

  descriptionChanged(description) {
    this.setState({
      description
    });
  }

  ratingChanged(rating) {
    this.setState({
      rating
    });
  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = this.state
    const bookmark = {
      title: title,
      url: url,
      description: description,
      rating: rating,
    }
    this.setState({ error: null })
    fetch(config.API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        this.props.onAddBookmark(data)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { error } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Create a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              onChange={e => this.titleChanged(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              onChange={e => this.urlChanged(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              onChange={e => this.descriptionChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue='1'
              min='1'
              max='5'
              onChange={e => this.ratingChanged(e.target.value)}
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <Link to={'/'}>
              <button>Cancel</button>
            </Link>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default AddBookmark;
