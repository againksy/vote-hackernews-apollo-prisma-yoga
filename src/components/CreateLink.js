import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from '../queries'
import { LINKS_PER_PAGE } from '../constants'

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <div className="createpost">
        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy },
            })
            data.feed.links.unshift(post)
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy },
            })
          }}
        >{postMutation => 
          <form className="createpost__form" onSubmit={e=>{
              e.preventDefault();
              postMutation()
            }}>
            <input
              className="createpost__form_input"
              value={description}
              onChange={e => this.setState({ description: e.target.value })}
              type="text"
              placeholder="A description for the link"
            />
            <input
              className="createpost__form_input"
              value={url}
              onChange={e => this.setState({ url: e.target.value })}
              type="text"
              placeholder="The URL for the link"
             />
             <button className="createpost__form_submit" type="submit">Submit</button>
          </form>}
        </Mutation>
      </div>
    )
  }
}

export default CreateLink
