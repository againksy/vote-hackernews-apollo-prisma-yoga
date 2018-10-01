import gql from 'graphql-tag'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
        comments {
          createdAt
          id
          user {
            id
            name
          }
          comment_votes {
            id
            user {
              id
            }
          }
          content
        }
      }
      count
    }
  }
`

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
        comments {
          id
          createdAt
          user {
            id
            name
          }
          comment_votes {
            id
            user {
              id
            }
          }
          content
        }
      }
    }
  }
`

export const NEW_COMMENTS_SUBSCRIPTION = gql`
  subscription {
    newComment {
      node {
        id
        link {
          id
          url
          description
          createdAt
          postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
          comments {
            createdAt
            id
            user {
              id
              name
            }
            comment_votes {
              id
              user {
                id
              }
            }
            content
          }
        }
        user {
          id
        }
      }
    }
  }
`

export const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
          id
          url
          description
          createdAt
          postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
          comments {
            id
            createdAt
            user {
              id
              name
            }
            comment_votes {
              id
              user {
                id
              }
            }
            content
          }
        }
        user {
          id
        }
      }
    }
  }
`

export const NEW_COMMENT_VOTE_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
          id
          url
          description
          createdAt
          postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
          comments {
            id
            createdAt
            user {
              id
              name
            }
            comment_votes {
              id
              user {
                id
              }
            }
            content
          }
        }
        user {
          id
        }
      }
    }
  }
`

