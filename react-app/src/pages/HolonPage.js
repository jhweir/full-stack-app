import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import CoverImage from '../components/CoverImage'
import Wall from '../components/Wall'

function HolonPage(props) {
    const holon = props.match.params.holonHandle
    const { setHolon } = useContext(HolonContext)

    useEffect(() => {
        setHolon(holon) // Sets the holon in the HolonContext and triggers a call to the database to retrieve the posts
    }, [])

    return (
        <>
            <CoverImage/>
            <Wall/>

            <style jsx="true">{`
                //
            `}</style>
        </>
    )
}

export default HolonPage