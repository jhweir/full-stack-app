import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import AccountContextProvider from './contexts/AccountContext'
import SpaceContextProvider from './contexts/SpaceContext'
import UserContextProvider from './contexts/UserContext'
import PostContextProvider from './contexts/PostContext'
import config from './Config'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import CoopPage from './pages/CoopPage'
import HolonPage from './pages/HolonPage'
import PostPage from './pages/PostPage'
import UserPage from './pages/UserPage'
import EmptyPage from './pages/EmptyPage'
import NavBar from './components/NavBar'
import Modals from './components/Modals'

const App = (): JSX.Element => {
    const [pageBottomReached, setPageBottomReached] = useState(false)

    function checkPageBottomReached() {
        const d = document.documentElement
        const offset = 150
        const bottomReached = d.scrollHeight - d.scrollTop - offset < d.clientHeight
        setPageBottomReached(bottomReached)
    }

    useEffect(() => {
        window.addEventListener('scroll', checkPageBottomReached)
    }, [])

    return (
        <div className='app'>
            <BrowserRouter history={createBrowserHistory}>
                <AccountContextProvider pageBottomReached={pageBottomReached}>
                    <SpaceContextProvider>
                        <UserContextProvider>
                            <PostContextProvider>
                                <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
                                    <NavBar />
                                    <Modals />
                                    <Switch>
                                        <Route path='/' exact component={HomePage} />
                                        <Route path='/features' exact component={FeaturesPage} />
                                        <Route path='/coop' exact component={CoopPage} />
                                        <Route path='/s/:spaceHandle' component={HolonPage} />
                                        <Route path='/p/:postId' component={PostPage} />
                                        <Route path='/u/:userHandle' component={UserPage} />
                                        <Route component={EmptyPage} />
                                    </Switch>
                                </GoogleReCaptchaProvider>
                            </PostContextProvider>
                        </UserContextProvider>
                    </SpaceContextProvider>
                </AccountContextProvider>
            </BrowserRouter>
        </div>
    )
}

export default App
