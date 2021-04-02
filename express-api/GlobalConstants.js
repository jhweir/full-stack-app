const sequelize = require('sequelize')

const postAttributes = [
    'id', 'type', 'subType', 'state', 'text', 'url', 'urlImage', 'urlDomain', 'urlTitle', 'urlDescription', 'createdAt',
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
        ),'total_comments'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type != 'vote' AND Reaction.state = 'active')
        + (SELECT COUNT(*) FROM Links AS Link WHERE Link.state = 'visible' AND (Link.itemAId = Post.id OR Link.itemBId = Post.id) AND Link.type = 'post-post')`
        ),'total_reactions'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'like' AND Reaction.state = 'active')`
        ),'total_likes'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'repost' AND Reaction.state = 'active')`
        ),'total_reposts'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
        ),'total_ratings'
    ],
    [sequelize.literal(
        `(SELECT SUM(value) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
        ),'total_rating_points'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Links AS Link WHERE Link.state = 'visible' AND (Link.itemAId = Post.id OR Link.itemBId = Post.id) AND Link.type = 'post-post')` //AND Link.state = 'active'
        ),'total_links'
    ],
]

module.exports = { postAttributes }