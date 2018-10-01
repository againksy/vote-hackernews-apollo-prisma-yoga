function newLinkSubscribe (parent, args, context, info) {
  return context.db.subscription.link(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newLink = {
  subscribe: newLinkSubscribe
}

function newVoteSubscribe (parent, args, context, info) {
  console.log(' dkfjsdlkfjlkfjsdlkfj ', context.db.subscription)
  return context.db.subscription.vote(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newVote = {
  subscribe: newVoteSubscribe
}

function newCommentSubscribe (parent, args, context, info) {
  return context.db.subscription.comment(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newComment = {
  subscribe: newCommentSubscribe
}

function newCommentVoteSubscribe (parent, args, context, info) {
  console.log('sadlfkjslkafjalskfjka   ', context.db.subscription)
  // return context.db.subscription.comment_vote(
  //   { where: { mutation_in: ['CREATED'] } },
  //   info,
  // )
}

const newCommentVote = {
  subscribe: newCommentVoteSubscribe
}

module.exports = {
  newLink,
  newVote,
  newComment,
  newCommentVote,
}
