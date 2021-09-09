module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('GlassBeads', 'postId', 'gameId'),
                queryInterface.renameColumn('GlassBeadGameComments', 'postId', 'gameId'),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('GlassBeads', 'gameId', 'postId'),
                queryInterface.renameColumn('GlassBeadGameComments', 'gameId', 'postId'),
            ]);
        });
    }
};