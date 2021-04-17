/* eslint-disable camelcase */
export interface ISpace {
    id: number
    handle: string
    name: string
    description: string
    flagImagePath: string
    coverImagePath: string
    createdAt: string
    total_spaces: number
    total_posts: number
    total_users: number
    total_followers: number
    total_comments: number
    total_reactions: number
    total_likes: number
    total_hearts: number
    total_ratings: number
    // includes
    Creator: Partial<IUser>
    DirectChildHolons: Partial<ISpace[]>
    DirectParentHolons: Partial<ISpace[]>
    HolonHandles: { handle: string; name: string }[]
}

export interface IPost {
    id: number
    type: string
    subType: string
    text: string
    url: string
    urlDescription: string
    urlDomain: string
    urlImage: string
    urlTitle: string
    createdAt: string
    account_like: number
    account_link: number
    account_rating: number
    account_repost: number
    total_comments: number
    total_likes: number
    total_links: number
    total_rating_points: number
    total_ratings: number
    total_reactions: number
    total_reposts: number
    // includes (todo: capitalise)
    creator: Partial<IUser>
    spaces: Partial<ISpace[]>
    PollAnswers: IPollAnswer[]
    DirectSpaces: any[]
    IndirectSpaces: any[]
    Links: any[]
}

export interface IUser {
    id: number
    handle: string
    name: string
    bio: string
    unseen_notifications?: number
    coverImagePath: string
    flagImagePath: string
    createdAt: string
    total_posts: number
    total_comments: number
    // includes
    FollowedHolons: Partial<ISpace[]>
    ModeratedHolons: Partial<ISpace[]>
}

export interface IComment {
    id: number
    text: string
}

export interface IPrism {
    id: number
    postId: number
    numberOfPlayers: number
    duration: string
    privacy: string
    createdAt: string
    // includes
    User: Partial<IUser>
}

export interface IPollAnswer {
    id: number
    value: number
    total_votes: number
    total_score: number
}

export interface ISpaceHighlights {
    TopPosts: IPost[]
    TopSpaces: ISpace[]
    TopUsers: IUser[]
}

export interface ISpaceMapData {
    id: number
    children: any
}

export interface IAccountContext {
    accountContextLoading: boolean
    pageBottomReached: boolean
    isLoggedIn: boolean
    accountData: any
    authModalOpen: boolean
    navBarDropDownModalOpen: boolean
    alertMessage: string
    alertModalOpen: boolean
    imageUploadModalOpen: boolean
    imageUploadType: string
    createHolonModalOpen: boolean
    createPostModalOpen: boolean
    createCommentModalOpen: boolean
    settingModalOpen: boolean
    settingModalType: string
    createPostFromTurn: boolean
    createPostFromTurnData: any
    resetPasswordModalOpen: boolean
    resetPasswordModalToken: string | null
    selectedNavBarItem: string
    notifications: any[]
    setAccountContextLoading: (payload: boolean) => void
    setAccountData: (payload: any) => void
    setAuthModalOpen: (payload: boolean) => void
    setNavBarDropDownModalOpen: (payload: boolean) => void
    setAlertMessage: (payload: string) => void
    setAlertModalOpen: (payload: boolean) => void
    setImageUploadModalOpen: (payload: boolean) => void
    setImageUploadType: (payload: string) => void
    setCreateHolonModalOpen: (payload: boolean) => void
    setCreatePostModalOpen: (payload: boolean) => void
    setCreateCommentModalOpen: (payload: boolean) => void
    setSettingModalOpen: (payload: boolean) => void
    setSettingModalType: (payload: string) => void
    setCreatePostFromTurn: (payload: boolean) => void
    setCreatePostFromTurnData: (payload: any) => void
    setResetPasswordModalOpen: (payload: boolean) => void
    setResetPasswordModalToken: (payload: string | null) => void
    setSelectedNavBarItem: (payload: string) => void
    setNotifications: (payload: any[]) => void
    logOut: () => void
    getAccountData: () => void
    getNotifications: () => void
    getNextNotifications: () => void
}

export interface ISpaceContext {
    spaceContextLoading: boolean
    spaceHandle: string
    spaceData: Partial<ISpace>
    spaceHighlights: Partial<ISpaceHighlights>
    isFollowing: boolean
    isModerator: boolean
    selectedSpaceSubPage: string
    fullScreen: boolean

    spacePosts: IPost[]
    totalMatchingPosts: number
    spacePostsFiltersOpen: boolean
    spacePostsSearchFilter: string
    spacePostsTimeRangeFilter: string
    spacePostsTypeFilter: string
    spacePostsSortByFilter: string
    spacePostsSortOrderFilter: string
    spacePostsDepthFilter: string
    spacePostsPaginationLimit: number
    spacePostsPaginationOffset: number
    spacePostsPaginationHasMore: boolean
    spacePostsView: string

    spaceSpaces: ISpace[]
    spaceSpacesFiltersOpen: boolean
    spaceSpacesSearchFilter: string
    spaceSpacesTimeRangeFilter: string
    spaceSpacesTypeFilter: string
    spaceSpacesSortByFilter: string
    spaceSpacesSortOrderFilter: string
    spaceSpacesDepthFilter: string
    spaceSpacesPaginationLimit: number
    spaceSpacesPaginationOffset: number
    spaceSpacesPaginationHasMore: boolean
    spaceSpacesView: string

    spaceUsers: IUser[]
    spaceUsersFiltersOpen: boolean
    spaceUsersSearchFilter: string
    spaceUsersTimeRangeFilter: string
    spaceUsersTypeFilter: string
    spaceUsersSortByFilter: string
    spaceUsersSortOrderFilter: string
    spaceUsersPaginationLimit: number
    spaceUsersPaginationOffset: number
    spaceUsersPaginationHasMore: boolean

    getSpaceData: () => void
    getSpaceHighlights: () => void
    getSpaceSpaces: () => void
    getNextSpaceSpaces: () => void
    getSpacePosts: () => void
    getNextSpacePosts: () => void
    getAllPosts: () => void
    getSpaceUsers: () => void
    getNextSpaceUsers: () => void

    setSpaceContextLoading: (payload: boolean) => void
    setSpaceHandle: (payload: string) => void
    setSpaceData: (payload: Partial<ISpace>) => void
    setSpaceHighlights: (payload: ISpaceHighlights) => void
    setIsFollowing: (payload: boolean) => void
    setIsModerator: (payload: boolean) => void
    setSelectedSpaceSubPage: (payload: string) => void
    setFullScreen: (payload: boolean) => void

    setSpacePosts: (payload: IPost[]) => void
    setTotalMatchingPosts: (payload: number) => void
    setSpacePostsFiltersOpen: (payload: boolean) => void
    setSpacePostsSearchFilter: (payload: string) => void
    setSpacePostsTimeRangeFilter: (payload: string) => void
    setSpacePostsTypeFilter: (payload: string) => void
    setSpacePostsSortByFilter: (payload: string) => void
    setSpacePostsSortOrderFilter: (payload: string) => void
    setSpacePostsDepthFilter: (payload: string) => void
    setSpacePostsPaginationLimit: (payload: number) => void
    setSpacePostsPaginationOffset: (payload: number) => void
    setSpacePostsPaginationHasMore: (payload: boolean) => void
    setSpacePostsView: (payload: string) => void

    setSpaceSpaces: (payload: ISpace[]) => void
    setSpaceSpacesFiltersOpen: (payload: boolean) => void
    setSpaceSpacesSearchFilter: (payload: string) => void
    setSpaceSpacesTimeRangeFilter: (payload: string) => void
    setSpaceSpacesTypeFilter: (payload: string) => void
    setSpaceSpacesSortByFilter: (payload: string) => void
    setSpaceSpacesSortOrderFilter: (payload: string) => void
    setSpaceSpacesDepthFilter: (payload: string) => void
    setSpaceSpacesPaginationLimit: (payload: number) => void
    setSpaceSpacesPaginationOffset: (payload: number) => void
    setSpaceSpacesPaginationHasMore: (payload: boolean) => void
    setSpaceSpacesView: (payload: string) => void

    setSpaceUsers: (payload: IUser[]) => void
    setSpaceUsersFiltersOpen: (payload: boolean) => void
    setSpaceUsersSearchFilter: (payload: string) => void
    setSpaceUsersTimeRangeFilter: (payload: string) => void
    setSpaceUsersTypeFilter: (payload: string) => void
    setSpaceUsersSortByFilter: (payload: string) => void
    setSpaceUsersSortOrderFilter: (payload: string) => void
    setSpaceUsersPaginationLimit: (payload: number) => void
    setSpaceUsersPaginationOffset: (payload: number) => void
    setSpaceUsersPaginationHasMore: (payload: boolean) => void
}

export interface IPostContext {
    postContextLoading: boolean
    postId: number | undefined
    postData: Partial<IPost>
    selectedSubPage: string
    selectedPollAnswers: IPollAnswer[]
    voteCast: boolean
    postComments: IComment[]
    postCommentFiltersOpen: boolean
    postCommentTimeRangeFilter: string
    postCommentSortByFilter: string
    postCommentSortOrderFilter: string
    postCommentSearchFilter: string
    postCommentPaginationLimit: number
    postCommentPaginationOffset: number
    postCommentPaginationHasMore: boolean
    pollAnswersSortedById?: IPollAnswer[]
    pollAnswersSortedByScore?: IPollAnswer[]
    totalPollVotes?: number
    totalUsedPoints: number
    validVote: boolean
    colorScale: any // d3 scale
    setPostContextLoading: (payload: boolean) => void
    setPostId: (payload: number) => void
    setPostData: (payload: IPost) => void
    setSelectedSubPage: (payload: string) => void
    setSelectedPollAnswers: (payload: IPollAnswer[]) => void
    setVoteCast: (payload: boolean) => void
    setPostComments: (payload: IComment[]) => void
    setPostCommentFiltersOpen: (payload: boolean) => void
    setPostCommentTimeRangeFilter: (payload: string) => void
    setPostCommentSortByFilter: (payload: string) => void
    setPostCommentSortOrderFilter: (payload: string) => void
    setPostCommentSearchFilter: (payload: string) => void
    setPostCommentPaginationLimit: (payload: number) => void
    setPostCommentPaginationOffset: (payload: number) => void
    setPostCommentPaginationHasMore: (payload: boolean) => void
    getPostData: () => void
    getPostComments: () => void
    getNextPostComments: () => void
    castVote: () => void
}

export interface IUserContext {
    userContextLoading: boolean
    userHandle: string
    userData: any // Partial<IUser>
    selectedUserSubPage: string
    isOwnAccount: boolean
    createdPosts: IPost[]
    createdPostPaginationLimit: number
    createdPostPaginationOffset: number
    createdPostPaginationHasMore: boolean
    createdPostFiltersOpen: boolean
    createdPostSearchFilter: string
    createdPostTimeRangeFilter: string
    createdPostTypeFilter: string
    createdPostSortByFilter: string
    createdPostSortOrderFilter: string
    setUserContextLoading: (payload: boolean) => void
    setUserHandle: (payload: string) => void
    setUserData: (payload: IUser) => void
    setSelectedUserSubPage: (payload: string) => void
    setIsOwnAccount: (payload: boolean) => void
    setCreatedPosts: (payload: IPost[]) => void
    setCreatedPostPaginationLimit: (payload: number) => void
    setCreatedPostPaginationOffset: (payload: number) => void
    setCreatedPostPaginationHasMore: (payload: boolean) => void
    setCreatedPostFiltersOpen: (payload: boolean) => void
    setCreatedPostSearchFilter: (payload: string) => void
    setCreatedPostTimeRangeFilter: (payload: string) => void
    setCreatedPostTypeFilter: (payload: string) => void
    setCreatedPostSortByFilter: (payload: string) => void
    setCreatedPostSortOrderFilter: (payload: string) => void
    getUserData: () => void
    getCreatedPosts: () => void
    getNextCreatedPosts: () => void
}
