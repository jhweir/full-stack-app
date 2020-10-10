import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import config from './../Config'
import styles from '../styles/components/Prism.module.scss'
import { PostContext } from '../contexts/PostContext'
import PostCard from './Cards/PostCard/PostCard'
import PrismMap from './PrismMap'

function Prism() {
    const { postData } = useContext(PostContext)
    const [prismData, setPrismData] = useState({})

    function getPrismData() {
        console.log('Prism: getPrismData')
        axios.get(config.environmentURL + `/prism-data?postId=${postData.id}`)
            .then(res => setPrismData(res.data))
    }

    useEffect(() => {
        getPrismData()
    }, [])

    return (
        <div className={styles.prism}>
            <div className={styles.postCardContainer}>
                <PostCard postData={postData} location='post-page'/>
            </div>
            <div className={styles.infoBar}>
                <span><b>Number of players: </b>{prismData.numberOfPlayers}</span>
                <span><b>Duration: </b>{prismData.duration}</span>
                <span><b>Privacy: </b>{prismData.privacy}</span>
            </div>
            <PrismMap postData={postData} prismData={prismData}/>
        </div>
    )
}

export default Prism