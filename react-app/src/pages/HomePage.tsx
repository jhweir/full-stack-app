import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/pages/HomePage.module.scss'
import { AccountContext } from '../contexts/AccountContext'
import { SpaceContext } from '../contexts/SpaceContext'
import SmallFlagImage from '../components/SmallFlagImage'
import config from '../Config'

const Homepage = (): JSX.Element => {
    const {
        accountContextLoading,
        setAlertMessage,
        setAlertModalOpen,
        setResetPasswordModalOpen,
        setResetPasswordModalToken,
    } = useContext(AccountContext)
    const { setSpaceHandle, spaceData, getSpaceHighlights, spaceHighlights } = useContext(
        SpaceContext
    )
    const urlParams = new URLSearchParams(window.location.search)
    const alert = urlParams.get('alert')

    function showRedirectAlerts() {
        if (alert === 'verify-email') {
            axios
                .post(`${config.apiURL}/verify-email`, {
                    token: urlParams.get('token'),
                })
                .then((res) => {
                    if (setAlertMessage) {
                        if (res.data === 'success')
                            setAlertMessage(
                                'Success! Your email has been verified. Log in to start using your account.'
                            )
                        else setAlertMessage(res.data)
                        setAlertModalOpen(true)
                    }
                })
        }
        if (alert === 'reset-password') {
            setResetPasswordModalOpen(true)
            setResetPasswordModalToken(urlParams.get('token'))
        }
    }

    useEffect(() => showRedirectAlerts(), [])

    useEffect(() => {
        if (!accountContextLoading && setSpaceHandle) setSpaceHandle('all')
    }, [accountContextLoading])

    useEffect(() => {
        if (spaceData.id) getSpaceHighlights()
    }, [spaceData.id])

    return (
        <div className={styles.homePage}>
            <div className={styles.mainContent}>
                <img className={styles.logo} src='/images/new-logo.svg' alt='weco logo' />
                {/* <div className={styles.titleWrapper}> */}
                <span className={styles.title}>
                    we{`{`}
                    <span className={`${styles.title} ${styles.grey}`}>collective</span>
                    {`}`}
                </span>
                {/* </div> */}
                <span className={styles.subTitle}>holonic social media</span>
                <span className={styles.preAlpha}>PRE-ALPHA</span>
                <div className={styles.underConstruction}>
                    <span className={styles.underConstructionText}>under construction...</span>
                    <img
                        className={styles.icon}
                        src='/icons/tools-solid.svg'
                        alt='under construction icon'
                    />
                </div>
                {spaceHighlights && (
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <Link className={styles.statText} to='/s/all/spaces'>
                                {`${spaceData && spaceData.total_spaces} Spaces`}
                            </Link>
                            <div style={{ zIndex: 3 }}>
                                <SmallFlagImage
                                    type='space'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopSpaces &&
                                            spaceHighlights.TopSpaces[0] &&
                                            spaceHighlights.TopSpaces[0].flagImagePath) ||
                                        null
                                    }
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 2 }}>
                                <SmallFlagImage
                                    type='space'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopSpaces &&
                                            spaceHighlights.TopSpaces[1] &&
                                            spaceHighlights.TopSpaces[1].flagImagePath) ||
                                        null
                                    }
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 1 }}>
                                <SmallFlagImage
                                    type='space'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopSpaces &&
                                            spaceHighlights.TopSpaces[2] &&
                                            spaceHighlights.TopSpaces[2].flagImagePath) ||
                                        null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <Link className={styles.statText} to='/s/all/posts'>
                                {`${spaceData && spaceData.total_posts} Posts`}
                            </Link>
                            <div style={{ zIndex: 3 }}>
                                <SmallFlagImage
                                    type='post'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopPosts &&
                                            spaceHighlights.TopPosts[0] &&
                                            spaceHighlights.TopPosts[0].urlImage) ||
                                        null
                                    }
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 2 }}>
                                <SmallFlagImage
                                    type='post'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopPosts &&
                                            spaceHighlights.TopPosts[1] &&
                                            spaceHighlights.TopPosts[1].urlImage) ||
                                        null
                                    }
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 1 }}>
                                <SmallFlagImage
                                    type='post'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopPosts &&
                                            spaceHighlights.TopPosts[2] &&
                                            spaceHighlights.TopPosts[2].urlImage) ||
                                        null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <Link className={styles.statText} to='/s/all/users'>
                                {`${spaceData && spaceData.total_users} Users`}
                            </Link>
                            <div style={{ zIndex: 3 }}>
                                <SmallFlagImage
                                    type='user'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopUsers &&
                                            spaceHighlights.TopUsers[0] &&
                                            spaceHighlights.TopUsers[0].flagImagePath) ||
                                        null
                                    }
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 2 }}>
                                <SmallFlagImage
                                    type='user'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopUsers &&
                                            spaceHighlights.TopUsers[1] &&
                                            spaceHighlights.TopUsers[1].flagImagePath) ||
                                        null
                                    }
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 1 }}>
                                <SmallFlagImage
                                    type='user'
                                    size={45}
                                    outline
                                    imagePath={
                                        (spaceHighlights &&
                                            spaceHighlights.TopUsers &&
                                            spaceHighlights.TopUsers[2] &&
                                            spaceHighlights.TopUsers[2].flagImagePath) ||
                                        null
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.waves}>
                <img
                    className={styles.backgroundWave}
                    src='/images/earth.svg'
                    alt='background wave svg'
                />
            </div>
            <div className={styles.section2}>
                <div className={styles.introText}>
                    <h2>
                        <b>
                            we{'{'}collective{'} '}
                        </b>
                        is an evolving experiment in social media and collective intelligence
                        design.
                    </h2>
                    <br />
                    <p>
                        The platform is built around a flexible, interconnected,{' '}
                        <a href='https://en.wikipedia.org/wiki/Holon_(philosophy)'>holonic</a>{' '}
                        framework designed to help users share, organise, interact with, and explore
                        social media content more intuitively.
                    </p>
                    <br />
                    <p>
                        Nested within this framework we’re developing a range of unique post types
                        designed to meet various collaborative needs for communities, including
                        advanced polling tools, video chat rooms, multiplayer games, events,
                        decision trees, and knowledge maps. The common theme running through these
                        features is the goal of facilitating new forms of collective intelligence
                        amongst the user-base.
                    </p>
                    <br />
                    <p>
                        When enough active users are involved we’ll be transitioning into a platform
                        cooperative, fully owned and governed by its members. Members of the coop
                        will be able to propose and vote on new features they’d like built into the
                        platform, as well as how surplus profits generated by the site are spent.
                    </p>
                    <br />
                    <p>
                        Read more about the framework, features, and mission of the project below.
                    </p>
                </div>
                {/* <div className={styles.list}>
                    <span className={`${styles.largeText} mb-10`}>Working features</span>
                    <span>User accounts</span>
                    <ul className={styles.ul}>
                        <li>Log in / out with JWT authentication and encrypted password</li>
                        <li>Access to followed and moderated spaces</li>
                        <li>Search and filter created posts</li>
                        <li>
                            Recieve account notifications when other users interact with your
                            content
                        </li>
                    </ul>
                    <span className='mt-20'>Spaces</span>
                    <ul className={styles.ul}>
                        <li>Create spaces within spaces within spaces to any depth</li>
                        <li>Edit space name, url handle, and bio</li>
                        <li>Upload space flag and cover images</li>
                        <li>Add new moderators</li>
                        <li>Search and filter child spaces</li>
                        <li>Navigate up and down spaces</li>
                        <li>Connect to new parent spaces</li>
                        <li>Toggle view of spaces between scrollable list or tree diagram</li>
                    </ul>
                    <span className='mt-20'>Posts</span>
                    <ul className={styles.ul}>
                        <li>
                            Create posts and tag them with the spaces you want them to appear within
                        </li>
                        <li>Choose from different post types</li>
                        <ul>
                            <li>Text</li>
                            <li>Url: includes image and metadata from url</li>
                            <li>Poll: single choice, multiple choice, or weighted choice</li>
                            <li>Glass bead: allows turn based linking of posts</li>
                        </ul>
                        <li>Comment on posts</li>
                        <li>Reply to comments</li>
                        <li>React to posts</li>
                        <ul>
                            <li>Like posts</li>
                            <li>Repost posts</li>
                            <li>Rate posts</li>
                            <li>Link posts to other posts</li>
                        </ul>
                        <li>Vote and view results on poll posts</li>
                        <li>Toggle view of posts between scrollable list and post map</li>
                        <li>Posts and links visualised on post map</li>
                    </ul>
                    <span className={`${styles.largeText} mt-50`}>Coming features</span>
                    <ul className={styles.ul}>
                        <li>New post types</li>
                        <ul>
                            <li>Plot graphs</li>
                            <li>Decision trees</li>
                            <li>Knowledge maps</li>
                        </ul>
                        <li>User to user messaging</li>
                        <li>
                            Personalised stream on user profile (pulling in content from followed
                            spaces)
                        </li>
                        <li>Comment permalinks</li>
                        <li>Up/down vote links between posts</li>
                        <li>Flag posts for moderation</li>
                        <li>Custom filtering of content based on flags</li>
                        <li>Log in through Facebook, Twitter, Google</li>
                        <li>Zoomable circle packing view for spaces</li>
                        <li>Responsive UI for small screens</li>
                    </ul> 
                </div> */}
                <div className={styles.credits}>
                    Some icons created by FontAwesome https://fontawesome.com/license
                </div>
            </div>
        </div>
    )
}

export default Homepage
