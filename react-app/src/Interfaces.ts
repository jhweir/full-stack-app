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
    url: string | null
    urlDescription: string | null
    urlDomain: string | null
    urlImage: string | null
    urlTitle: string | null
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
    loggedIn: boolean
    accountData: any
    accountDataLoading: boolean
    setAccountDataLoading: (payload: boolean) => void
    // notifications: any[]
    // setNotifications: (payload: any[]) => void
    // notificationsLoading: boolean
    // modals (todo: most to be removed...)
    alertModalOpen: boolean
    setAlertModalOpen: (payload: boolean) => void
    alertMessage: string
    setAlertMessage: (payload: string) => void
    authModalOpen: boolean
    setAuthModalOpen: (payload: boolean) => void
    logInModalOpen: boolean
    setLogInModalOpen: (payload: boolean) => void
    registerModalOpen: boolean
    setRegisterModalOpen: (payload: boolean) => void
    forgotPasswordModalOpen: boolean
    setForgotPasswordModalOpen: (payload: boolean) => void
    navBarDropDownModalOpen: boolean
    setNavBarDropDownModalOpen: (payload: boolean) => void
    createPostModalOpen: boolean
    setCreatePostModalOpen: (payload: boolean) => void
    // createSpaceModalOpen: boolean
    // setCreateSpaceModalOpen: (payload: boolean) => void
    createCommentModalOpen: boolean
    setCreateCommentModalOpen: (payload: boolean) => void
    settingModalOpen: boolean
    setSettingModalOpen: (payload: boolean) => void
    settingModalType: string
    setSettingModalType: (payload: string) => void
    imageUploadModalOpen: boolean
    setImageUploadModalOpen: (payload: boolean) => void
    imageUploadType: string
    setImageUploadType: (payload: string) => void
    resetPasswordModalOpen: boolean
    setResetPasswordModalOpen: (payload: boolean) => void
    resetPasswordModalToken: string | null
    setResetPasswordModalToken: (payload: string | null) => void
    // functions
    getAccountData: () => void
    updateAccountData: (key: string, payload: any) => void
    // getNotifications: () => void
    // updateAccountNotification: (id: number, key: string, payload: any) => void
    logOut: () => void
}

export interface ISpaceContext {
    spaceData: any
    setSpaceData: (payload: any) => void
    isFollowing: boolean
    setIsFollowing: (payload: boolean) => void
    isModerator: boolean
    selectedSpaceSubPage: string
    setSelectedSpaceSubPage: (payload: string) => void
    fullScreen: boolean
    setFullScreen: (payload: boolean) => void

    spaceDataLoading: boolean
    spacePostsLoading: boolean
    setSpacePostsLoading: (payload: boolean) => void
    nextSpacePostsLoading: boolean
    spaceSpacesLoading: boolean
    nextSpaceSpacesLoading: boolean
    spaceUsersLoading: boolean
    nextSpaceUsersLoading: boolean

    spacePosts: any[]
    setSpacePosts: (payload: any[]) => void
    totalMatchingPosts: number
    spacePostsFilters: any
    spacePostsFiltersOpen: boolean
    setSpacePostsFiltersOpen: (payload: boolean) => void
    spacePostsPaginationLimit: number
    spacePostsPaginationOffset: number
    spacePostsPaginationHasMore: boolean

    spaceSpaces: any[] // ISpace[]
    setSpaceSpaces: (payload: any[]) => void
    spaceSpacesFilters: any
    spaceSpacesFiltersOpen: boolean
    setSpaceSpacesFiltersOpen: (payload: boolean) => void
    spaceSpacesPaginationLimit: number
    spaceSpacesPaginationOffset: number
    spaceSpacesPaginationHasMore: boolean

    spaceUsers: any[]
    spaceUsersFilters: any
    spaceUsersFiltersOpen: boolean
    setSpaceUsersFiltersOpen: (payload: boolean) => void
    spaceUsersPaginationLimit: number
    spaceUsersPaginationOffset: number
    spaceUsersPaginationHasMore: boolean

    getSpaceData: (handle: string, returnFunction: any) => void
    getSpacePosts: (handle: string, offset: number, limit: number) => void
    getSpaceSpaces: (handle: string, offset: number, limit: number) => void
    getSpaceUsers: (handle: string, offset: number, limit: number) => void

    updateSpacePostsFilter: (key: string, payload: string) => void
    updateSpaceSpacesFilter: (key: string, payload: string) => void
    updateSpaceUsersFilter: (key: string, payload: string) => void
    resetSpaceData: () => void
    resetSpacePosts: () => void
    resetSpaceSpaces: () => void
    resetSpaceUsers: () => void
}

export interface IPostContext {
    selectedSubPage: string
    setSelectedSubPage: (payload: string) => void
    postData: any
    postDataLoading: boolean
    // functions
    getPostData: (payload: number) => void
    resetPostContext: () => void
}

export interface IUserContext {
    isOwnAccount: boolean
    selectedUserSubPage: string
    setSelectedUserSubPage: (payload: string) => void
    userData: any // Partial<IUser>
    userDataLoading: boolean
    userPosts: IPost[]
    userPostsLoading: boolean
    nextUserPostsLoading: boolean
    userPostsFilters: any
    userPostsFiltersOpen: boolean
    setUserPostsFiltersOpen: (payload: boolean) => void
    userPostsPaginationLimit: number
    userPostsPaginationOffset: number
    userPostsPaginationHasMore: boolean
    // functions
    getUserData: (payload: string) => void
    getUserPosts: (payload: number) => void
    updateUserPostsFilter: (key: string, payload: string) => void
    resetUserContext: () => void
}
