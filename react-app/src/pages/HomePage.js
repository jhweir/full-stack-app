import React, { useContext, useEffect } from 'react'
import styles from '../styles/pages/HomePage.module.scss'
import { AccountContext } from '../contexts/AccountContext'

function Homepage() {
    const { setAlertMessage, setAlertModalOpen, setResetPasswordModalOpen, setResetPasswordModalToken } = useContext(AccountContext)
    const urlParams = new URLSearchParams(window.location.search)
    const alert = urlParams.get('alert')

    useEffect(() => {
        if (alert === 'email-verified') {
            setAlertMessage('Success! Your email has been verified. Log in to start using your account.')
            setAlertModalOpen(true)
        }
        if (alert === 'reset-password') {
            //console.log('token: ', urlParams.get('token'))
            setResetPasswordModalOpen(true)
            setResetPasswordModalToken(urlParams.get('token'))
            // setAlertMessage(`Reset your password. Token: ${urlParams.get('token')}`)
            // setAlertModalOpen(true)
        }
    }, [])

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
            </div>
            <div className={styles.waves}>
                <img className={styles.backgroundWave} src='/images/wave.svg'/>
            </div>
            <div className={styles.section2}>
                <div className={styles.list}>
                    <span className={`${styles.largeText} mb-10`}>Working features</span>
                    <span>User accounts</span>
                    <ul className={styles.ul}>
                        <li><input type="checkbox" checked={true} readOnly/>Log in / out with JWT authentication and encrypted password</li>
                        {/* <li><input type="checkbox" checked={true} readOnly/>Profile page</li> */}
                        <li><input type="checkbox" checked={true} readOnly/>Access to followed and moderated spaces</li>
                        <li><input type="checkbox" checked={true} readOnly/>Search and filter created posts</li>
                    </ul>
                    <span className={`mt-20`}>Spaces</span>
                    <ul className={styles.ul}>
                        <li><input type="checkbox" checked={true} readOnly/>Create spaces within spaces within spaces to any depth</li>
                        <li><input type="checkbox" checked={true} readOnly/>Edit space name, url handle, and bio</li>
                        <li><input type="checkbox" checked={true} readOnly/>Upload space flag and cover images</li>
                        <li><input type="checkbox" checked={true} readOnly/>Add new moderators</li>
                        <li><input type="checkbox" checked={true} readOnly/>Search and filter child spaces</li>
                        <li><input type="checkbox" checked={true} readOnly/>Navigate up and down spaces</li>
                        <li><input type="checkbox" checked={true} readOnly/>Connect to new parent spaces</li>
                        <li><input type="checkbox" checked={true} readOnly/>Toggle view of spaces between scrollable list or tree diagram</li>
                    </ul>
                    <span className='mt-20'>Posts</span>
                    <ul className={styles.ul}>
                        <li><input type="checkbox" checked={true} readOnly/>Create posts and tag them with the spaces you want them to appear within</li>
                        <li><input type="checkbox" checked={true} readOnly/>Choose from different post types</li>
                        <ul>
                            <li><input type="checkbox" checked={true} readOnly/>Text</li>
                            <li><input type="checkbox" checked={true} readOnly/>Url: includes image and metadata from url</li>
                            <li><input type="checkbox" checked={true} readOnly/>Poll: single choice, multiple choice, or weighted choice</li>
                            <li><input type="checkbox" checked={true} readOnly/>Glass bead: allows turn based linking of posts</li>
                        </ul>
                        <li><input type="checkbox" checked={true} readOnly/>Comment on posts</li>
                        <li><input type="checkbox" checked={true} readOnly/>React to posts</li>
                        <ul>
                            <li><input type="checkbox" checked={true} readOnly/>Like posts</li>
                            <li><input type="checkbox" checked={true} readOnly/>Repost posts</li>
                            <li><input type="checkbox" checked={true} readOnly/>Rate posts</li>
                            <li><input type="checkbox" checked={true} readOnly/>Link posts to other posts</li>
                        </ul>
                        <li><input type="checkbox" checked={true} readOnly/>Vote and view results on poll posts</li>
                        <li><input type="checkbox" checked={true} readOnly/>Toggle view of posts between scrollable list and post map</li>
                        <li><input type="checkbox" checked={true} readOnly/>Posts and links visualised on post map</li>
                    </ul>
                    <span className={`${styles.largeText} mt-50`}>Coming features</span>
                    <ul className={styles.ul}>
                        <li><input type="checkbox" checked={false} readOnly/>Account notifications</li>
                        <li><input type="checkbox" checked={false} readOnly/>User to user messaging</li>
                        <li><input type="checkbox" checked={false} readOnly/>Personalised stream (pulling in content from followed spaces) on user profile</li>
                        <li><input type="checkbox" checked={false} readOnly/>Post types</li>
                        <ul>
                            <li><input type="checkbox" checked={false} readOnly/>Plot graphs</li>
                            <li><input type="checkbox" checked={false} readOnly/>Decision trees</li>
                            <li><input type="checkbox" checked={false} readOnly/>Knowledge maps</li>
                        </ul>
                        <li><input type="checkbox" checked={false} readOnly/>Nested comment replies</li>
                        <li><input type="checkbox" checked={false} readOnly/>Comment permalinks</li>
                        <li><input type="checkbox" checked={false} readOnly/>Up/down vote links between posts</li>
                        <li><input type="checkbox" checked={false} readOnly/>Flag posts for moderation</li>
                        <li><input type="checkbox" checked={false} readOnly/>Custom filtering of content based on flags</li>
                        <li><input type="checkbox" checked={false} readOnly/>Log in through Facebook, Twitter, Google</li>
                        <li><input type="checkbox" checked={false} readOnly/>Zoomable circle packing view for spaces</li>
                        <li><input type="checkbox" checked={false} readOnly/>Responsive UI for small screens</li>
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
    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> App</li>
    <ul className={styles.ul}>
        <li className={styles.li}><input type="checkbox" checked={true} readOnly/> NavBar</li>
        <ul className={styles.ul}>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Page routing</li>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Dark mode</li>
        </ul>
        <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Homepage</li>
        <ul className={styles.ul}>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Component tree and features</li>
        </ul>
        <li className={styles.li}><input type="checkbox" checked={true} readOnly/> HolonPagePosts</li>
        <ul className={styles.ul}>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> HolonPagePostsHeader</li>
            <ul className={styles.ul}>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> CreatePostModal</li>
                <ul className={styles.ul}>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Add username</li>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Add title</li>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Add description</li>
                    <li className={styles.li}><input type="checkbox" checked="" readOnly/> Add tags</li>
                </ul>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> SearchBar</li>
                <ul className={styles.ul}>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Search by text</li>
                </ul>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> HolonPagePostsFilters</li>
                <ul className={styles.ul}>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Sort by ID</li>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Sort by Likes</li>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Sort by Date</li>
                    <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Sort by Comments</li>
                </ul>
            </ul>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Posts</li>
            <ul className={styles.ul}>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Like posts</li>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Delete posts</li>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Display number of comments</li>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Include time stap with date</li>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Link to unique post page</li>
                <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Pin posts</li>
                <li className={styles.li}><input type="checkbox" checked="" readOnly/> Add tags to posts</li>
            </ul>
        </ul>
        <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Post pages</li>
        <ul className={styles.ul}>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Display post</li>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> Create comments</li>
            <li className={styles.li}><input type="checkbox" checked={true} readOnly/> List comments</li>
        </ul>
        <li className={styles.li}><input type="checkbox" checked="" readOnly/> Holons</li>
        <li className={styles.li}><input type="checkbox" checked="" readOnly/> HolonPageUsers</li>
        <li className={styles.li}><input type="checkbox" checked="" readOnly/> Auth page</li>
    </ul>
</ul> */}
