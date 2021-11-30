const sequelize = require('sequelize')

const postAttributes = [
    'id', 'type', 'subType', 'text', 'url', 'urlImage', 'urlDomain', 'urlTitle', 'urlDescription', 'createdAt',
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
        ),'totalComments'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type != 'vote' AND Reaction.state = 'active')
        + (SELECT COUNT(*) FROM Links AS Link WHERE Link.state = 'visible' AND (Link.itemAId = Post.id OR Link.itemBId = Post.id) AND Link.type = 'post-post')`
        ),'totalReactions'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'like' AND Reaction.state = 'active')`
        ),'totalLikes'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'repost' AND Reaction.state = 'active')`
        ),'totalReposts'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
        ),'totalRatings'
    ],
    [sequelize.literal(
        `(SELECT SUM(value) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
        ),'totalRatingPoints'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Links AS Link WHERE Link.state = 'visible' AND (Link.itemAId = Post.id OR Link.itemBId = Post.id))` // AND Link.type = 'post-post')` //AND Link.state = 'active'
        ),'totalLinks'
    ],
]

// Space

const totalSpaceFollowers = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Users
        WHERE Users.id IN (
            SELECT HolonUsers.userId
            FROM HolonUsers
            RIGHT JOIN Users
            ON HolonUsers.userId = Users.id
            WHERE HolonUsers.HolonId = Holon.id
            AND HolonUsers.relationship = 'follower'
            AND HolonUsers.state = 'active'
        )
    )`), 'totalFollowers'
]

const totalSpaceComments = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Comments
        WHERE Comments.state = 'visible'
        AND Comments.postId IN (
            SELECT PostHolons.postId
            FROM PostHolons
            RIGHT JOIN Posts
            ON PostHolons.postId = Posts.id
            WHERE PostHolons.HolonId = Holon.id
        )
    )`), 'totalComments'
]

const totalSpaceReactions = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Reactions
        WHERE Reactions.state = 'active'
        AND Reactions.type != 'vote'
        AND Reactions.postId IN (
            SELECT PostHolons.postId
            FROM PostHolons
            RIGHT JOIN Posts
            ON PostHolons.postId = Posts.id
            WHERE PostHolons.HolonId = Holon.id
        )
    )`), 'totalReactions'
]

const totalSpaceLikes = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Reactions
        WHERE Reactions.state = 'active'
        AND Reactions.type = 'like'
        AND Reactions.postId IN (
            SELECT PostHolons.postId
            FROM PostHolons
            RIGHT JOIN Posts
            ON PostHolons.postId = Posts.id
            WHERE PostHolons.HolonId = Holon.id
        )
    )`), 'totalLikes'
]

const totalSpaceRatings = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Reactions
        WHERE Reactions.state = 'active'
        AND Reactions.type = 'rating'
        AND Reactions.postId IN (
            SELECT PostHolons.postId
            FROM PostHolons
            RIGHT JOIN Posts
            ON PostHolons.postId = Posts.id
            WHERE PostHolons.HolonId = Holon.id
        )
    )`), 'totalRatings'
]

const totalSpacePosts = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Posts
        WHERE Posts.state = 'visible'
        AND Posts.id IN (
            SELECT PostHolons.postId
            FROM PostHolons
            RIGHT JOIN Posts
            ON PostHolons.postId = Posts.id
            WHERE PostHolons.HolonId = Holon.id
        )
    )`), 'totalPosts'
]

const totalSpaceChildren = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM VerticalHolonRelationships
        AS VHR
        WHERE VHR.holonAId = Holon.id
        AND VHR.state = 'open'
    )`), 'totalChildren'
]

const totalUserPosts = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Posts
        WHERE Posts.state = 'visible'
        AND Posts.creatorId = User.id
    )`), 'totalPosts'
]

const totalUserComments = [sequelize.literal(`(
    SELECT COUNT(*)
        FROM Comments
        WHERE Comments.creatorId = User.id
    )`), 'totalComments'
]

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}


module.exports = {
    postAttributes,
    // Space
    totalSpaceFollowers,
    totalSpaceComments,
    totalSpaceReactions,
    totalSpaceLikes,
    totalSpaceRatings,
    totalSpacePosts,
    totalSpaceChildren,
    totalUserPosts,
    totalUserComments,
    asyncForEach
}