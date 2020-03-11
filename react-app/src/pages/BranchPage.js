import React, { useContext, useState, useEffect } from 'react'
import { BranchContext } from '../contexts/BranchContext'
import CoverImage from '../components/CoverImage'
import Wall from '../components/Wall'

function BranchPage(props) {
    const branch = props.match.params.branchHandle
    const { setBranch } = useContext(BranchContext)

    useEffect(() => {
        setBranch(branch) // Sets the branch in the BranchContext and triggers a call to the database to retrieve the posts
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

export default BranchPage