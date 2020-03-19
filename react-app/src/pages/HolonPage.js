import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import CoverImage from '../components/CoverImage'
import Wall from '../components/Wall'
import EmptyPage from './EmptyPage'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

function HolonPage(props) {
    const holon = props.match.params.holonHandle
    const { setHolon } = useContext(HolonContext)

    useEffect(() => {
        setHolon(holon) // Sets the holon in the HolonContext and triggers a call to the database to retrieve holon data
    }, [])

    return (
        <>
            <CoverImage/>
            <Switch>
                <Route path={`${props.match.url}/wall`} component={ Wall } exact/>
                {/* Cover image used as test. Change to child-holon list component */}
                <Route path={`${props.match.url}/child-holons`} component={ CoverImage } exact/>
                {/* <Route path={`${props.match.url}/about`} component={ About } exact/> */}
                <Route component={ EmptyPage }/>
            </Switch>

            <style jsx="true">{`
                //
            `}</style>
        </>
    )
}

export default HolonPage