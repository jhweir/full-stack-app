import React, { useContext, useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/HolonPostMap.module.scss'
import colors from '../../styles/Colors.module.scss'
import PostCard from '../Cards/PostCard/PostCard'
import axios from 'axios'
import config from '../../Config'

function HolonPostMap() {
    const { accountData, isLoggedIn } = useContext(AccountContext)
    const {
        holonData,
        holonPostSortByFilter,
        holonPostSortOrderFilter,
        holonPostTimeRangeFilter,
        holonPostTypeFilter,
        holonPostDepthFilter,
        holonPostSearchFilter,
        fullScreen,
    } = useContext(HolonContext)

    const [postMapData, setPostMapData] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const [gravity, setGravity] = useState(50)
    const [showKey, setShowKey] = useState(false)
    const [postMapPaginationLimit, setPostMapPaginationLimit] = useState(50)
    const [totalMatchingPosts, setTotalMatchingPosts] = useState(0)
    const [width, setWidth] = useState(700)
    const height = 500
    const arrowPoints = 'M 0 0 6 3 0 6 1.5 3'
    const gravitySlider = useRef()
    const gravityInput = useRef()

    function getPostMapData(limit) {
        console.log(`getPostMapData (0 to ${postMapPaginationLimit})`)
        axios.get(config.apiURL + 
            `/holon-posts?accountId=${isLoggedIn ? accountData.id : null
            }&handle=${holonData.handle
            }&sortBy=${holonPostSortByFilter
            }&sortOrder=${holonPostSortOrderFilter
            }&timeRange=${holonPostTimeRangeFilter
            }&postType=${holonPostTypeFilter
            }&depth=${holonPostDepthFilter
            }&searchQuery=${holonPostSearchFilter
            }&limit=${limit
            }&offset=0`)
            .then(res => {
                // store previous node positions
                let previousNodePositions = []
                d3.selectAll('circle').each(d => {
                    previousNodePositions.push({
                        id: d.id,
                        x: d.x,
                        y: d.y,
                        vx: d.vx,
                        vy: d.vy
                    })
                })
                // add previous positions to matching new nodes
                res.data.posts.forEach(post => {
                    const match = previousNodePositions.find(node => node.id === post.id)
                    if (match) {
                        post.x = match.x
                        post.y = match.y
                        post.vx = match.vx
                        post.vy = match.vy
                    } else {
                        // if no match randomise starting position outside of viewport
                        let randomX = ((Math.random() - 0.5) * 5000)
                        let randomY = ((Math.random() - 0.5) * 5000)
                        post.x = randomX > 0 ? randomX + 200 : randomX - 200
                        post.y = randomY > 0 ? randomY + 200 : randomY - 200
                    }
                })
                setPostMapData(res.data.posts)
                setTotalMatchingPosts(res.data.totalMatchingPosts)
            })
    }

    function findDomain() {
        let dMin = 0, dMax
        if (holonPostSortByFilter === 'Reactions') dMax = d3.max(postMapData.map(post => post.total_reactions))
        if (holonPostSortByFilter === 'Likes') dMax = d3.max(postMapData.map(post => post.total_likes))
        if (holonPostSortByFilter === 'Reposts') dMax = d3.max(postMapData.map(post => post.total_reposts))
        if (holonPostSortByFilter === 'Ratings') dMax = d3.max(postMapData.map(post => post.total_ratings))
        if (holonPostSortByFilter === 'Comments') dMax = d3.max(postMapData.map(post => post.total_comments))
        if (holonPostSortByFilter === 'Date') {
            dMin = d3.min(postMapData.map(post => Date.parse(post.createdAt)))
            dMax = d3.max(postMapData.map(post => Date.parse(post.createdAt)))
        }
        let domainMin, domainMax
        if (holonPostSortOrderFilter === 'Descending') { domainMin = dMin; domainMax = dMax }
        if (holonPostSortOrderFilter === 'Ascending') { domainMin = dMax; domainMax = dMin }
        return [domainMin, domainMax]
    }

    function findRadius(d) {
        const radiusScale = d3.scaleLinear()
            .domain(findDomain()) // data values spread
            .range([20, 60]) // radius size spread

        let radius
        if (holonPostSortByFilter === 'Reactions') radius = d.total_reactions
        if (holonPostSortByFilter === 'Likes') radius = d.total_likes
        if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
        if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
        if (holonPostSortByFilter === 'Comments') radius = d.total_comments
        if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)

        return radiusScale(radius)
    }

    function findFill(d) {
        if (d.urlImage) {
            const existingImage = d3.select(`#image-${d.id}`)._groups[0][0]
            if (existingImage) {
                // scale and reposition existing image
                d3.select(`#image-${d.id}`)
                    .transition()
                    .duration(1000)
                    .attr('height', findRadius(d) * 2)
            } else {
                // create new pattern
                var pattern = d3.select('#image-defs')
                    .append('pattern')
                    .attr('id', `pattern-${d.id}`)
                    .attr('height', 1)
                    .attr('width', 1)
                // append new image to pattern
                pattern.append('image')
                    .attr('id', `image-${d.id}`)
                    .attr('height', findRadius(d) * 2)
                    .attr('xlink:href', d.urlImage)
            }
            // return pattern url
            return `url(#pattern-${d.id})`
        } else {
            // return color based on post type
            if (d.type === 'url') { return colors.yellow }
            if (d.type === 'poll') { return colors.red }
            if (d.type === 'text') { return colors.green }
            if (d.type === 'prism') { return colors.purple }
            if (d.type === 'glass-bead') { return colors.blue }
            if (d.type === 'plot-graph') { return colors.orange }
        }
    }

    function findStroke(d) {
        if (d.account_like || d.account_repost || d.account_rating || d.account_link) return '#83b0ff'
        else return 'rgb(140 140 140)'
    }

    function createLinkData(data, linkType) {
        const linkData = []
        data.forEach((post, postIndex) => {
            const filteredLinks = post.OutgoingLinks.filter(link => link.state === 'visible' && link.relationship === linkType)
            filteredLinks.forEach(link => {
                let targetIndex = null
                // search posts by id to find target index
                data.forEach((p, i) => { if (p.id === link.itemBId) targetIndex = i })
                if (targetIndex !== null) {
                    let link = {
                        source: postIndex,
                        target: targetIndex
                    }
                    linkData.push(link)
                }
            })
        })
        return linkData
    }

    const zoom = d3.zoom().on("zoom", () => {
        d3.select('#post-map-master-group').attr("transform", d3.event.transform)
    })

    function createCanvas() {
        d3.select('#canvas')
            .append('svg')
            .attr('id', 'post-map-svg')
            .attr('width', width)
            .attr('height', height)

        // create defs
        d3.select('#post-map-svg')
            .append("defs")
            .attr("id", "image-defs")

        // create text link arrow
        d3.select('#post-map-svg')
            .append('defs')
            .attr('id', 'text-link-arrow-defs')
            .append('marker')
            .attr('id', 'text-link-arrow')
            .attr('refX', 5)
            .attr('refY', 3)
            .attr('markerWidth', 40)
            .attr('markerHeight', 40)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', arrowPoints)
            .style('fill', 'black')

        // create turn link arrow (currently === text link arrow)
        d3.select('#post-map-svg')
            .append('defs')
            .attr('id', 'turn-link-arrow-defs')
            .append('marker')
            .attr('id', 'turn-link-arrow')
            .attr('refX', 5)
            .attr('refY', 3)
            .attr('markerWidth', 40)
            .attr('markerHeight', 40)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', arrowPoints)
            .style('fill', 'black')

        // create master group
        d3.select('#post-map-svg')
            .append('g')
            .attr('id', 'post-map-master-group')

        // create node group
        d3.select('#post-map-master-group')
            .append('g')
            .attr('id', 'post-map-node-group')

        // create link group
        d3.select('#post-map-master-group')
            .append('g')
            .attr('id', 'post-map-link-group')

        // create zoom listener and set initial position
        d3.select('#post-map-svg').call(zoom)
        d3.select('#post-map-svg').call(zoom.transform, d3.zoomIdentity.scale(1).translate(width/2,height/2))

        // listen for 'p' keypress during node drag to pin or unpin selected node
        d3.select("body").on("keydown", function() {
            if (d3.event.keyCode === 80) {
                const activeDrag = d3.select('.active-drag')
                if (activeDrag.node()) {
                    if (activeDrag.classed('pinned')) {
                        activeDrag.classed('pinned', false)
                    } else {
                        activeDrag.classed('pinned', true)
                    }
                }
            }
        })
    }

    function updateCanvasSize() {
        d3.select('#canvas').style('width', width)
        d3.select('#post-map-svg').attr('width', width)
        const newWidth = parseInt(d3.select('#post-map-svg').style('width'), 10)

        // todo: smoothly transition size and scale
        //d3.select('#post-map-svg').call(zoom.transform, d3.zoomIdentity.scale(scale).translate(newWidth/scale/2,height/scale/2))
        
        d3.select('#post-map-svg').call(zoom.transform, d3.zoomIdentity.scale(1).translate(newWidth/2,height/2))
        repositionMap(postMapData)
    }

    function repositionMap(data) {
        // work out total node area
        const areaValues = []
        data.forEach(d => {
            let radius = findRadius(d) + 5
            let area = radius * radius * Math.PI
            areaValues.push(area)
        })
        const totalArea = areaValues.reduce((a, b) => a + b, 0)
        // calculate required viewport scale from total area
        var scale
        if (totalArea === 0) scale = 1
        else scale = (30000 / totalArea) + 0.5
        // return map to default position at required scale
        const svgWidth = parseInt(d3.select('#post-map-svg').style('width'), 10)
        d3.select('#post-map-svg')
            .transition()
            .duration(2000)
            .call(zoom.transform, d3.zoomIdentity.scale(scale).translate(svgWidth/scale/2,height/scale/2))
    }

    function updateMap(data) {
        setGravity(50)
        repositionMap(data)

        const textLinkData = createLinkData(data, 'text')
        const turnLinkData = createLinkData(data, 'turn')

        const simulation = d3.forceSimulation(data)
            .force('collide', d3.forceCollide().strength(.9).radius(d => findRadius(d) + 5).iterations(10))
            .force('charge', d3.forceManyBody().strength(d => - findRadius(d) * 8))
            .force('x', d3.forceX(0).strength(0.1)) // (50 / 500 = 0.1)
            .force('y', d3.forceY(0).strength(0.1))
            .force('textLinks', d3.forceLink().links(textLinkData).strength(0.05))
            .force('turnLinks', d3.forceLink().links(turnLinkData).strength(0.09))
            .alpha(1)
            .alphaTarget(0)
            .alphaMin(0.01)
            .alphaDecay(.002)
            .velocityDecay(0.7)
            .nodes(data)
            .on('tick', updateSimulation)

        function updateSimulation() {
            d3.selectAll('.post-map-node')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            d3.selectAll('.post-map-node-text')
                .attr('text-anchor', 'middle')
                .attr('x', d => d.x)
                .attr('y', d => d.y)

            d3.selectAll('.post-map-text-link').call(updateLink)
            d3.selectAll('.post-map-turn-link').call(updateLink)
        }

        function updateLink(link) {
            function fixna(x) {
                if (isFinite(x)) return x
                return 0
            }
            link.attr('x1', d => fixna(d.source.x))
                .attr('y1', d => fixna(d.source.y))
                .attr('x2', d => fixna(d.target.x))
                .attr('y2', d => fixna(d.target.y))
        }

        function dragStarted(d) {
            d3.select(this).classed('active-drag', true)
            if (!d3.event.active) {
                d.fx = d.x
                d.fy = d.y
            }
            simulation.alpha(1)
        }

        function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        }

        function dragEnded(d) {
            d3.select(this).classed('active-drag', false)
            if (!d3.event.active && !d3.select(this).classed('pinned')) {
                d.fx = null
                d.fy = null
            }
            simulation.alpha(1)
        }

        // connect simulation gravity to slider
        d3.select('#gravity-slider').on('input', () => {
            simulation.force('x').strength(gravitySlider.current.value/500)
            simulation.force('y').strength(gravitySlider.current.value/500)
            simulation.alpha(1)
        })
        d3.select('#gravity-input').on('input', () => {
            simulation.force('x').strength(gravityInput.current.value/500)
            simulation.force('y').strength(gravityInput.current.value/500)
            simulation.alpha(1)
        })

        // reaheat simulation on svg click
        d3.select('#post-map-svg').on('click', () => simulation.alpha(1))

        // create nodes
        d3.select('#post-map-node-group')
            .selectAll('.post-map-node')
            .data(data, d => d.id)
            .join(
                enter => enter
                    .append("circle")
                    .classed('post-map-node', true)
                    .attr('id', d => `post-map-node-${d.id}`)
                    .attr("r", findRadius)
                    .style("fill", findFill)
                    .style("stroke", findStroke)
                    .style("stroke-width", 2)
                    .attr('opacity', 0)
                    .on('click', e => {
                        simulation.alpha(1)
                        setSelectedPost(data.find(post => post.id === e.id))
                        d3.selectAll('.post-map-node')
                            .transition()
                            .duration(200)
                            .style("stroke-width", 2)
                        d3.select(d3.event.target)
                            .transition()
                            .duration(200)
                            .style("stroke-width", 6)
                    })
                    .call(d3.drag()
                        .on("start", dragStarted)
                        .on("drag", dragged)
                        .on("end", dragEnded)
                    )
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 1)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                        .attr("r", findRadius)
                        .style("fill", findFill)
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0)
                        .attr('r', 0)
                        .remove()
                        .on('end', d => d3.select(`#pattern-${d.id}`).remove())
                    )
            )
            
        // create text 
        d3.select('#post-map-node-group')
            .selectAll(".post-map-node-text")
            .data(data, d => d.id)
            .join(
                enter => enter
                    .append("text")
                    .classed('post-map-node-text', true)
                    .text(function(d){ 
                        let text = d.text.substring(0, 20)
                        if (text.length === 20) text = text.concat('...')
                        return text
                    })
                    .attr('opacity', 0)
                    .attr('pointer-events', 'none')
                    .on('click', e => {
                        setSelectedPost(data.find(post => post.id === e.id))
                        d3.selectAll('.post-map-node')
                            .transition()
                            .duration(200)
                            .style("stroke-width", 2)
                        d3.select(`#post-map-node-${e.id}`)
                            .transition()
                            .duration(200)
                            .style("stroke-width", 6)
                    })
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 1)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0)
                        .remove()
                    )
            )

        // create text links
        d3.select('#post-map-link-group')
            .selectAll(".post-map-text-link")
            .data(textLinkData)
            .join(
                enter => enter
                    .append('line')
                    .classed('post-map-text-link', true)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '3px')
                    .attr('marker-end', 'url(#text-link-arrow)')
                    .attr('opacity', 0)
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0.3)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0)
                        .remove()
                    )
            )

        // create turn links
        d3.select('#post-map-link-group')
            .selectAll(".post-map-turn-link")
            .data(turnLinkData)
            .join(
                enter => enter
                    .append('line')
                    .classed('post-map-turn-link', true)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '3px')
                    .attr('stroke-dasharray', 3)
                    .attr('marker-end', 'url(#turn-link-arrow)')
                    .attr('opacity', 0)
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0.3)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0)
                        .remove()
                    )
            )

        // if no selected post and posts present, select top post
        if (!selectedPost && data[0]) {
            setSelectedPost(data[0])
            d3.select(`#post-map-node-${data[0].id}`).style("stroke-width", 6)
        }
    }

    useEffect(() => {
        createCanvas()
    }, [])

    useEffect(() => {
        getPostMapData(postMapPaginationLimit)
    }, [
        holonData.id,
        holonPostSortByFilter,
        holonPostSortOrderFilter,
        holonPostTimeRangeFilter,
        holonPostTypeFilter,
        holonPostDepthFilter,
        holonPostSearchFilter,
    ])

    useEffect(() => {
        if (postMapData) updateMap(postMapData)
    }, [postMapData])

    useEffect(() => {
        setWidth(fullScreen ? '100%' : 700)
    }, [fullScreen])

    useEffect(() => {
        updateCanvasSize()
    }, [width])

    return (
        <div className={styles.postMapWrapper}>
            <div className={styles.controlsWrapper}>
                <div className={styles.controls}>
                    <div className={styles.item}>
                        Showing {postMapData.length} of {totalMatchingPosts} posts
                        <span className={`blueText ml-10`} onClick={() => getPostMapData(totalMatchingPosts)}>
                            load all
                        </span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.gravityText}>Gravity:</span>
                        {/* todo: add regex to gavity input */}
                        <input
                            ref={gravitySlider}
                            id='gravity-slider'
                            className={styles.gravitySlider}
                            type="range"
                            value={gravity}
                            min="-50"
                            max="150"
                            onChange={() => setGravity(gravitySlider.current.value)}
                        />
                        <input
                            ref={gravityInput}
                            id='gravity-input'
                            className={styles.gravityInput}
                            value={gravity}
                            type='number'
                            onChange={e => setGravity(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.key}>
                    <img className={styles.keyButton} src='/icons/key-solid.svg' onClick={() => setShowKey(!showKey)}/>
                    {showKey &&
                        <div className={styles.keyItems}>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>No Account Reaction</span>
                                <div className={styles.colorBox} style={{ border: '2px solid rgb(140 140 140)' }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Account Reaction</span>
                                <div className={styles.colorBox} style={{ border: '2px solid #83b0ff' }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Text Link</span>
                                <div className={styles.textLink}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Turn Link</span>
                                <div className={styles.turnLink}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Text</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.green }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Url</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.yellow }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Poll</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.red }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Glass Bead</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.blue }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Prism</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.purple }}/>
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Plot Graph</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.orange }}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div id='canvas'/>
            {selectedPost &&
                <div className={styles.selectedPostWrapper}>
                    <PostCard postData={selectedPost} location='holon-post-map'/>
                </div>
            }
        </div>
    )
}

export default HolonPostMap
