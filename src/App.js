import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import EditBookmark from './EditBookmark/EditBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
      page: 'list',
    })
  }

  addBookmark = bookmark => {
    console.log('add')
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  editBookmark = bookmark => {
    console.log('edit')
    const newBookmarks = this.state.bookmarks.map(bm =>
      (bm.id === bookmark.id)
        ? bookmark
        : bm
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
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
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <Nav />
        <div className='content' aria-live='polite'>
          <Route
            exact
            path='/'
            render={(props) => <BookmarkList bookmarks={this.state.bookmarks}/>}
            />
          <Route
            path='/add-bookmark'
            component={AddBookmark}
            render={(props) => <AddBookmark onAddBookmark={this.addBookmark}/>}
          />
          <Route
            path='/edit/:bookmarkId'
            render={(props) => <EditBookmark {...props}/>}
          />
        </div>
      </main>
    );
  }
}

export default App;

            // component={BookmarkList}
            // bookmarks={bookmarks}