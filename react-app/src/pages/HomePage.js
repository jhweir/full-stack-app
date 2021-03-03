import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/pages/HomePage.module.scss'
import { AccountContext } from '../contexts/AccountContext'
import { HolonContext } from '../contexts/HolonContext'
import SmallFlagImage from '../components/SmallFlagImage'
import { Router } from 'react-router-dom'
import axios from 'axios'
import config from './../Config'

function Homepage() {
    const { accountContextLoading, setAlertMessage, setAlertModalOpen, setResetPasswordModalOpen, setResetPasswordModalToken } = useContext(AccountContext)
    const { holonHandle, setHolonHandle, holonData, getHolonHighlights, holonHighlights } = useContext(HolonContext)
    const urlParams = new URLSearchParams(window.location.search)
    const alert = urlParams.get('alert')

    function showRedirectAlerts() {
        if (alert === 'verify-email') {
            console.log('verify email get request')
            axios.get(config.apiURL + `/verify-email?token=${urlParams.get('token')}`)
                .then(res => {
                    if (res.data === 'success') setAlertMessage('Success! Your email has been verified. Log in to start using your account.')
                    else setAlertMessage(res.data)
                    setAlertModalOpen(true)
                })
        }
        if (alert === 'reset-password') {
            setResetPasswordModalOpen(true)
            setResetPasswordModalToken(urlParams.get('token'))
        }
    }

    useEffect(() => {
        showRedirectAlerts()
    }, [])

    useEffect(() => {
        if (!accountContextLoading) setHolonHandle('all')
    }, [accountContextLoading])

    useEffect(() => {
        if (holonData.id) getHolonHighlights()
    }, [holonData.id])

    return (
        <div className={styles.homePage}>
            <div className={styles.mainContent}>
                <img className={styles.logo} src='/images/logo-007.png'/>
                <span className={styles.title}>
                    {/* weco<span className={`${styles.title} ${styles.grey}`}>.io</span> */}
                    we{`{`}<span className={`${styles.title} ${styles.grey}`}>collective</span>{`}`}
                </span>
                <span className={styles.subTitle}>holonic social media coop</span>
                {/* <span className={`${styles.subTitle} mb-20`}>evolving social media tools and governance</span> */}
                <div className={styles.underConstruction}>
                    <span className={styles.underConstructionText}>under construction...</span>
                    <img className={styles.icon} src='/icons/tools-solid.svg'/>
                </div>
                {holonHighlights &&
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <Link className={styles.statText} to={'/s/all/posts'}>
                                {`${holonData.total_posts} Posts`}
                            </Link>
                            <div style={{ zIndex: 3 }}>
                                <SmallFlagImage
                                    type='post'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopPosts[0] && holonHighlights.TopPosts[0].urlImage}
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 2 }}>
                                <SmallFlagImage
                                    type='post'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopPosts[1] && holonHighlights.TopPosts[1].urlImage}
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 1 }}>
                                <SmallFlagImage
                                    type='post'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopPosts[2] && holonHighlights.TopPosts[2].urlImage}
                                />
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <Link className={styles.statText} to={'/s/all/spaces'}>
                                {`${holonData.total_spaces} Spaces`}
                            </Link>
                            <div style={{ zIndex: 3 }}>
                                <SmallFlagImage
                                    type='space'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopSpaces[0] && holonHighlights.TopSpaces[0].flagImagePath}
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 2 }}>
                                <SmallFlagImage
                                    type='space'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopSpaces[1] && holonHighlights.TopSpaces[1].flagImagePath}
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 1 }}>
                                <SmallFlagImage
                                    type='space'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopSpaces[2] && holonHighlights.TopSpaces[2].flagImagePath}
                                />
                            </div>
                        </div>
                        <div className={styles.stat}>
                            <Link className={styles.statText} to={'/s/all/users'}>
                                {`${holonData.total_users} Users`}
                            </Link>
                            <div style={{ zIndex: 3 }}>
                                <SmallFlagImage
                                    type='user'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopUsers[0] && holonHighlights.TopUsers[0].flagImagePath}
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 2 }}>
                                <SmallFlagImage
                                    type='user'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopUsers[1] && holonHighlights.TopUsers[1].flagImagePath}
                                />
                            </div>
                            <div style={{ marginLeft: -10, zIndex: 1 }}>
                                <SmallFlagImage
                                    type='user'
                                    size={45}
                                    outline
                                    imagePath={holonHighlights.TopUsers[2] && holonHighlights.TopUsers[2].flagImagePath}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className={styles.waves}>
                <img className={styles.backgroundWave} src='/images/wave.svg'/>
            </div>
            <div className={styles.section2}>
                <div className={styles.list}>
                    <span className={`${styles.largeText} mb-10`}>Working features</span>
                    <span>User accounts</span>
                    <ul className={styles.ul}>
                        <li>Log in / out with JWT authentication and encrypted password</li>
                        {/* <li>Profile page</li> */}
                        <li>Access to followed and moderated spaces</li>
                        <li>Search and filter created posts</li>
                        <li>Recieve account notifications when other users interact with your content</li>
                    </ul>
                    <span className={`mt-20`}>Spaces</span>
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
                        <li>Create posts and tag them with the spaces you want them to appear within</li>
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
                        <li>Personalised stream on user profile (pulling in content from followed spaces)</li>
                        <li>Comment permalinks</li>
                        <li>Up/down vote links between posts</li>
                        <li>Flag posts for moderation</li>
                        <li>Custom filtering of content based on flags</li>
                        <li>Log in through Facebook, Twitter, Google</li>
                        <li>Zoomable circle packing view for spaces</li>
                        <li>Responsive UI for small screens</li>
                    </ul>
                </div>
                <div className={styles.credits}>
                    All icons created by FontAwesome https://fontawesome.com/license
                </div>
            </div>
        </div>
    )
}

export default Homepage


{/* <span className="page-title">Component tree and features</span>
<ul style={{ padding:0 }}>
    <li className={styles.li}> App</li>
    <ul className={styles.ul}>
        <li className={styles.li}> NavBar</li>
        <ul className={styles.ul}>
            <li className={styles.li}> Page routing</li>
            <li className={styles.li}> Dark mode</li>
        </ul>
        <li className={styles.li}> Homepage</li>
        <ul className={styles.ul}>
            <li className={styles.li}> Component tree and features</li>
        </ul>
        <li className={styles.li}> HolonPagePosts</li>
        <ul className={styles.ul}>
            <li className={styles.li}> HolonPagePostsHeader</li>
            <ul className={styles.ul}>
                <li className={styles.li}> CreatePostModal</li>
                <ul className={styles.ul}>
                    <li className={styles.li}> Add username</li>
                    <li className={styles.li}> Add title</li>
                    <li className={styles.li}> Add description</li>
                    <li className={styles.li}><input type="checkbox" checked="" readOnly/> Add tags</li>
                </ul>
                <li className={styles.li}> SearchBar</li>
                <ul className={styles.ul}>
                    <li className={styles.li}> Search by text</li>
                </ul>
                <li className={styles.li}> HolonPagePostsFilters</li>
                <ul className={styles.ul}>
                    <li className={styles.li}> Sort by ID</li>
                    <li className={styles.li}> Sort by Likes</li>
                    <li className={styles.li}> Sort by Date</li>
                    <li className={styles.li}> Sort by Comments</li>
                </ul>
            </ul>
            <li className={styles.li}> Posts</li>
            <ul className={styles.ul}>
                <li className={styles.li}> Like posts</li>
                <li className={styles.li}> Delete posts</li>
                <li className={styles.li}> Display number of comments</li>
                <li className={styles.li}> Include time stap with date</li>
                <li className={styles.li}> Link to unique post page</li>
                <li className={styles.li}> Pin posts</li>
                <li className={styles.li}><input type="checkbox" checked="" readOnly/> Add tags to posts</li>
            </ul>
        </ul>
        <li className={styles.li}> Post pages</li>
        <ul className={styles.ul}>
            <li className={styles.li}> Display post</li>
            <li className={styles.li}> Create comments</li>
            <li className={styles.li}> List comments</li>
        </ul>
        <li className={styles.li}><input type="checkbox" checked="" readOnly/> Holons</li>
        <li className={styles.li}><input type="checkbox" checked="" readOnly/> HolonPageUsers</li>
        <li className={styles.li}><input type="checkbox" checked="" readOnly/> Auth page</li>
    </ul>
</ul> */}
