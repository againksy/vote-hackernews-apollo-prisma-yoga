import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import Link from './Link'
import { FEED_SEARCH_QUERY } from '../queries'

class Search extends Component {
  state = {
    links: [],
    filter: '',
  }

  render() {
    return (
      <div className="searching">
        <form onSubmit={e=>{
              e.preventDefault();
              this._executeSearch()
            }}>
          Search
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button className="searching_btn" type="submit">OK</button>
        </form>
        {this.state.links.map((link, index) => (
          <Link disableAddComment={true} key={link.id} link={link} index={index} />
        ))}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }
}

export default withApollo(Search)
