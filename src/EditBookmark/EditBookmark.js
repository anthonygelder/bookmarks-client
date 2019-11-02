import React, { Component } from  'react';
import { Link } from 'react-router-dom';
import config from '../config'
import './EditBookmark.css';

class EditBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      title: "",
      url: "",
      description: "",
      rating: 1,
      error: null
    };
  }
  static defaultProps = {
    onEditBookmark: () => {}
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

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId
    fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating,
        })
      })
      .catch(error => this.setState({ error }))
  }

  handleSubmit = e => {
    e.preventDefault()
    // const bookmarkId = this.props.match.params.bookmarkId
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
        return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        console.log(this.props)
        this.props.onEditBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const {title, description, url, rating, error} = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit a bookmark</h2>
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
              value={title}
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
              value={url}
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
              value={description}
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
              value={rating}
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

export default EditBookmark;
