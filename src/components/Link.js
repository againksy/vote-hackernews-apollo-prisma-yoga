import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import { COMMENT_MUTATION, VOTE_MUTATION, COMMENT_VOTE_MUTATION } from '../tags'


class Link extends Component {
  constructor(props){
    super(props)
    this.state = {}
    this.commentArea = React.createRef();
  }
  showCommentField = () => {
    this.setState({
      showCommentField: !this.state.showCommentField
    })
  }
  componentDidUpdate(prevProps, prevState){
    if(!prevState.showCommentField && this.state.showCommentField){
      this.commentArea.current.focus();
    }
  }
  focusCommentArea = () => {
    this.commentArea.current.focus();
  }
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { showCommentField, comment_content, } = this.state
    const { link } = this.props
    let cmntBtnClss = 'post__comment_btn fa fa-comment'
    if(showCommentField){
      cmntBtnClss = cmntBtnClss + ' post__comment_btn-editing'
    }

    return (
      <div className="post">
        <div className="post__number">
          <span className="post__index">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: link.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, link.id)
              }
            >
              {voteMutation => (
                <div className="post__vote" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="post__content">
          <div className="post__description">
            {link.description} ({link.url})
          </div>
          <div className="post__stats">
            {link.votes.length} votes | by{' '}
            {link.postedBy
              ? link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
          {link.comments && link.comments.length ? <div className="post__content_comments">
              {link.comments.map((comment,index)=>{
                return <div className="post__comment" key={index}>
                    <div className="post__comment_number">
                      <span className="post__comment_index">{index + 1}.</span>
                      {authToken && (
                        <Mutation
                          mutation={COMMENT_VOTE_MUTATION}
                          variables={{ linkId: link.id, commentId: comment.id }}
                          update={(store, { data: { commentVote } }) =>
                            this.props.updateStoreAfterCommentVote(store, commentVote, link.id, comment.id)
                          }
                        >
                          {voteCommentMutation => (
                            <div className="post__comment_vote" onClick={voteCommentMutation}>
                              ▲
                            </div>
                          )}
                        </Mutation>
                      )}
                    </div>
                    <div>
                      <div className="post__comment_text">{comment.content}</div>
                      <div className="post__comment_stats">
                        {comment.comment_votes && comment.comment_votes.length} votes | by{' '}
                        {comment.user
                          ? comment.user.name
                          : 'Unknown'}{' '}
                        {timeDifferenceForDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
              })}
            </div> : null
          }
          {showCommentField && <div>
              <textarea ref={this.commentArea} rows="4" cols="50"
                className="post__comment_content-edit"
                value={comment_content}
                onChange={e => this.setState({ comment_content: e.target.value })}
              >
              </textarea>
            </div>}
          {authToken && <Mutation
              onCompleted={this.showCommentField}
              mutation={COMMENT_MUTATION}
              variables={{ content: comment_content, linkId: link.id }}
              update={(store, { data: { comment } }) => {
                  this.props.updateStoreAfterComment(store, comment, link.id)
                }
              }
            >
              {commentMutation => (
                <i onClick={()=>{
                    if(showCommentField){
                      commentMutation()
                    }else {
                      this.showCommentField()
                    }
                  }} className={cmntBtnClss}></i>
              )}
            </Mutation>}
          {showCommentField && <i onClick={this.showCommentField} className="post__comment_btn post_comment_btn-close fa fa-times"></i>}
        </div>
      </div>
    )
  }
}

export default Link
