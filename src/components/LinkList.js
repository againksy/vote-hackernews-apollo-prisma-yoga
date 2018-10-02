import React, { Component, Fragment } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import { LINKS_PER_PAGE } from '../constants'
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_COMMENTS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION, NEW_COMMENT_VOTE_SUBSCRIPTION, } from '../queries'

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })

    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }
  _updateCacheAfterComment = (store, createComment, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })

    const commentedLink = data.feed.links.find(link => link.id === linkId)
    commentedLink.comments = createComment.link.comments
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink.node

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  _updateCacheAfterCommentVote = (store, createCommentVote, linkId, commentId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })

    data.feed.links = data.feed.links.map(link => {
      if(link.id === linkId){
        link.comments = link.comments.map(comment=>{
          if(comment.id === commentId){
            comment.comment_votes = createCommentVote.comment.comment_votes
          }
          return comment
        })
      }
      return link
    })
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  _subscribeToNewCommentVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_COMMENT_VOTE_SUBSCRIPTION
    })
  }

  _subscribeToNewComments = subscribeToMore => {
    subscribeToMore({
      document: NEW_COMMENTS_SUBSCRIPTION
    })
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return { first, skip, orderBy }
  }

  _getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  render() {
    return (
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          this._subscribeToNewLinks(subscribeToMore)
          this._subscribeToNewVotes(subscribeToMore)
          this._subscribeToNewComments(subscribeToMore)
          this._subscribeToNewCommentVotes(subscribeToMore)

          const linksToRender = this._getLinksToRender(data)
          const isNewPage = this.props.location.pathname.includes('new')
          const pageIndex = this.props.match.params.page
            ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
            : 0

          return (
            <Fragment>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index + pageIndex}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                  updateStoreAfterComment={this._updateCacheAfterComment}
                  updateStoreAfterCommentVote={this._updateCacheAfterCommentVote}
                />
              ))}
              {isNewPage && (
                <div className="posts__pagination">
                  <div className="posts__pagination_btn posts__pagination_btn-prev" onClick={this._previousPage}>
                    Previous
                  </div>
                  <div className="posts__pagination_btn" onClick={() => this._nextPage(data)}>
                    Next
                  </div>
                </div>
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export default LinkList
