const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  )
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  }, `{ id name }`)

  const token = jwt.sign({ userId: user.id, name: user.name }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } }, `{ id password name }`)
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id, name: user.name }, APP_SECRET),
    user,
  }
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context)
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: args.linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
      },
    },
    info,
  )
}

async function comment(parent, args, context, info) {
  const userId = getUserId(context)
  if(!args.content){
    throw new Error(`Unable to create comment with no text`)
  }
  return context.db.mutation.createComment(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
        content: args.content,
      },
    },
    info,
  )
}
async function commentVote(parent, args, context, info) {
  const userId = getUserId(context)
  const linkExists = await context.db.exists.CommentVote({
    user: { id: userId },
    comment: { id: args.commentId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }
  return context.db.mutation.createCommentVote(
    {
      data: {
        user: { connect: { id: userId } },
        comment: { connect: { id: args.commentId } },
      },
    },
    info,
  )
}

module.exports = {
  post,
  signup,
  login,
  vote,
  comment,
  commentVote,
}
