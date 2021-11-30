import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/PlotGraph.module.scss'
import { PostContext } from '../contexts/PostContext'
import PostCard from './Cards/PostCard/PostCard'
import PlotGraphMap from './PlotGraphMap'

const PlotGraph = (): JSX.Element => {
    const { postData } = useContext(PostContext)
    const [plotGraphData, setPlotGraphData] = useState({})

    function getPlotGraphData() {
        console.log('PlotGraph: getPlotGraphData')
        axios
            .get(`${config.apiURL}/plot-graph-data?postId=${postData.id}`)
            .then((res) => setPlotGraphData(res.data))
    }

    useEffect(() => {
        getPlotGraphData()
    }, [postData])

    return (
        <div className={styles.plotGraph}>
            <div className={styles.postCardContainer}>
                <PostCard post={postData} location='post-page' />
            </div>
            {/* <div className={styles.infoBar}>
                <span><b>Number of axes: </b>{plotGraphData.numberOfPlotGraphAxes}</span>
                {plotGraphData.numberOfPlotGraphAxes > 0 &&
                    <>
                        <span><b>Axis1Left: </b>{plotGraphData.axis1Left}</span>
                        <span><b>Axis1Right: </b>{plotGraphData.axis1Right}</span>
                    </>
                }
                {plotGraphData.numberOfPlotGraphAxes > 1 &&
                    <>
                        <span><b>Axis2Top: </b>{plotGraphData.axis2Top}</span>
                        <span><b>Axis2Bottom: </b>{plotGraphData.axis2Bottom}</span>
                    </>
                }
            </div> */}
            <PlotGraphMap plotGraphData={plotGraphData} />
        </div>
    )
}

export default PlotGraph
