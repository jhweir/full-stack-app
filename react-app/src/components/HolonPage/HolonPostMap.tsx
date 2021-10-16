/* eslint-disable no-param-reassign */
import React, { useContext, useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import axios from 'axios'
import { SpaceContext } from '@contexts/SpaceContext'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/HolonPostMap.module.scss'
import colors from '@styles/Colors.module.scss'
import PostCard from '@components/Cards/PostCard/PostCard'
import config from '@src/Config'
import { IPost } from '@src/Interfaces'

const HolonPostMap = (): JSX.Element => {
    const { accountData, isLoggedIn } = useContext(AccountContext)
    const {
        spaceData,
        spacePostsFilters,
        // spacePostsSortByFilter,
        // spacePostsSortOrderFilter,
        // spacePostsTimeRangeFilter,
        // spacePostsTypeFilter,
        // spacePostsDepthFilter,
        // spacePostsSearchFilter,
        fullScreen,
    } = useContext(SpaceContext)

    const { sortBy, sortOrder, timeRange, type, depth, searchQuery } = spacePostsFilters

    const [postMapData, setPostMapData] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const defaultGravity = 30
    const [gravity, setGravity] = useState(defaultGravity)
    const [showKey, setShowKey] = useState(false)
    // const [postMapPaginationLimit, setPostMapPaginationLimit] = useState(50)
    const postMapPaginationLimit = 50
    const [totalMatchingPosts, setTotalMatchingPosts] = useState(0)
    const [width, setWidth] = useState<number | string>(700)
    const height = 500
    const arrowPoints = 'M 0 0 6 3 0 6 1.5 3'
    const gravitySlider = useRef<HTMLInputElement>(null)
    const gravityInput = useRef<HTMLInputElement>(null)

    function getPostMapData(limit) {
        console.log(`getPostMapData (0 to ${postMapPaginationLimit})`)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/space-posts?accountId=${isLoggedIn ? accountData.id : null
                }&spaceId=${spaceData.id
                }&sortBy=${sortBy
                }&sortOrder=${sortOrder
                }&timeRange=${timeRange
                }&postType=${type
                }&depth=${depth
                }&searchQuery=${searchQuery
                }&limit=${limit
                }&offset=0`
            )
            .then((res) => {
                // store previous node positions
                interface INodePosition {
                    id: number
                    x: number
                    y: number
                    vx: number
                    vy: number
                }
                const previousNodePositions = [] as INodePosition[]
                d3.selectAll('circle').each((d) => {
                    previousNodePositions.push({
                        id: d.id,
                        x: d.x,
                        y: d.y,
                        vx: d.vx,
                        vy: d.vy,
                    })
                })
                // add previous positions to matching new nodes
                res.data.posts.forEach((post) => {
                    const match = previousNodePositions.find((node) => node.id === post.id)
                    if (match) {
                        post.x = match.x
                        post.y = match.y
                        post.vx = match.vx
                        post.vy = match.vy
                    } else {
                        // if no match randomise starting position outside of viewport
                        const randomX = (Math.random() - 0.5) * 5000
                        const randomY = (Math.random() - 0.5) * 5000
                        post.x = randomX > 0 ? randomX + 200 : randomX - 200
                        post.y = randomY > 0 ? randomY + 200 : randomY - 200
                    }
                })
                setPostMapData(res.data.posts)
                setTotalMatchingPosts(res.data.totalMatchingPosts)
            })
    }

    function findDomain() {
        let dMin = 0
        let dMax
        if (sortBy === 'Reactions')
            dMax = d3.max(postMapData.map((post: IPost) => post.total_reactions))
        if (sortBy === 'Likes') dMax = d3.max(postMapData.map((post: IPost) => post.total_likes))
        if (sortBy === 'Reposts')
            dMax = d3.max(postMapData.map((post: IPost) => post.total_reposts))
        if (sortBy === 'Ratings')
            dMax = d3.max(postMapData.map((post: IPost) => post.total_ratings))
        if (sortBy === 'Comments')
            dMax = d3.max(postMapData.map((post: IPost) => post.total_comments))
        if (sortBy === 'Date') {
            dMin = d3.min(postMapData.map((post: IPost) => Date.parse(post.createdAt)))
            dMax = d3.max(postMapData.map((post: IPost) => Date.parse(post.createdAt)))
        }
        let domainMin
        let domainMax
        if (sortOrder === 'Descending') {
            domainMin = dMin
            domainMax = dMax
        }
        if (sortOrder === 'Ascending') {
            domainMin = dMax
            domainMax = dMin
        }
        return [domainMin, domainMax]
    }

    function findRadius(d) {
        const radiusScale = d3
            .scaleLinear()
            .domain(findDomain()) // data values spread
            .range([20, 60]) // radius size spread

        let radius
        if (sortBy === 'Reactions') radius = d.total_reactions
        if (sortBy === 'Likes') radius = d.total_likes
        if (sortBy === 'Reposts') radius = d.total_reposts
        if (sortBy === 'Ratings') radius = d.total_ratings
        if (sortBy === 'Comments') radius = d.total_comments
        if (sortBy === 'Date') radius = Date.parse(d.createdAt)

        return radiusScale(radius)
    }

    function findFill(d) {
        if (d.urlImage) {
            const existingImage = d3.select(`#image-${d.id}`)
            if (existingImage.node()) {
                // scale and reposition existing image
                existingImage
                    .transition()
                    .duration(1000)
                    .attr('height', findRadius(d) * 2)
            } else {
                // create new pattern
                const pattern = d3
                    .select('#image-defs')
                    .append('pattern')
                    .attr('id', `pattern-${d.id}`)
                    .attr('height', 1)
                    .attr('width', 1)
                // append new image to pattern
                pattern
                    .append('image')
                    .attr('id', `image-${d.id}`)
                    .attr('height', findRadius(d) * 2)
                    .attr('xlink:href', d.urlImage)
                    .on('error', () => {
                        const newImage = d3.select(`#image-${d.id}`)
                        // try image proxy
                        if (!newImage.attr('xlink:href').includes('//images.weserv.nl/')) {
                            newImage.attr('xlink:href', `//images.weserv.nl/?url=${d.urlImage}`)
                        } else {
                            // fall back on placeholder
                            newImage.attr(
                                'xlink:href',
                                '/images/placeholders/broken-image-left.jpg'
                            )
                        }
                    })
            }
            // return pattern url
            return `url(#pattern-${d.id})`
        }
        // return color based on post type
        if (d.type === 'url') {
            return colors.yellow
        }
        if (d.type === 'poll') {
            return colors.red
        }
        if (d.type === 'text') {
            return colors.green
        }
        if (d.type === 'prism') {
            return colors.purple
        }
        if (d.type === 'glass-bead-game') {
            return colors.blue
        }
        if (d.type === 'plot-graph') {
            return colors.orange
        }
        return null
    }

    function findStroke(d) {
        if (d.account_like || d.account_repost || d.account_rating || d.account_link)
            return '#83b0ff'
        return 'rgb(140 140 140)'
    }

    function createLinkData(posts, linkType) {
        interface ILinkData {
            source: number
            target: number
        }
        const linkData = [] as ILinkData[]
        posts.forEach((post, postIndex) => {
            const filteredLinks = post.OutgoingLinks.filter(
                (link) => link.state === 'visible' && link.relationship === linkType
            )
            filteredLinks.forEach((link) => {
                let targetIndex = null
                // search posts by id to find target index
                posts.forEach((p, i) => {
                    if (p.id === link.itemBId) targetIndex = i
                })
                if (targetIndex !== null) {
                    const data = {
                        source: postIndex,
                        target: targetIndex,
                    }
                    linkData.push(data)
                }
            })
        })
        return linkData
    }

    const zoom = d3.zoom().on('zoom', () => {
        d3.select('#post-map-master-group').attr('transform', d3.event.transform)
    })

    function createCanvas() {
        d3.select('#canvas')
            .append('svg')
            .attr('id', 'post-map-svg')
            .attr('width', width)
            .attr('height', height)

        // create defs
        d3.select('#post-map-svg').append('defs').attr('id', 'image-defs')

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
        d3.select('#post-map-svg').append('g').attr('id', 'post-map-master-group')

        // create node group
        d3.select('#post-map-master-group').append('g').attr('id', 'post-map-node-group')

        // create link group
        d3.select('#post-map-master-group').append('g').attr('id', 'post-map-link-group')

        // create zoom listener and set initial position
        d3.select('#post-map-svg').call(zoom)
        d3.select('#post-map-svg').call(
            zoom.transform,
            d3.zoomIdentity.scale(1).translate(+width / 2, height / 2)
        )

        // listen for 'p' keypress during node drag to pin or unpin selected node
        d3.select('body').on('keydown', () => {
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

    function repositionMap(data) {
        // work out total node area
        const areaValues = [] as number[]
        data.forEach((d) => {
            const radius = findRadius(d) + 5
            const area = radius * radius * Math.PI
            areaValues.push(area)
        })
        const totalArea = areaValues.reduce((a, b) => a + b, 0)
        // calculate required viewport scale from total area
        let scale
        if (totalArea === 0) scale = 1
        else scale = 30000 / totalArea + 0.4 // + 0.5
        // return map to default position at required scale
        const svgWidth = parseInt(d3.select('#post-map-svg').style('width'), 10)
        d3.select('#post-map-svg')
            .transition()
            .duration(2000)
            .call(
                zoom.transform,
                d3.zoomIdentity.scale(scale).translate(svgWidth / scale / 2, height / scale / 2)
            )
    }

    function updateCanvasSize() {
        d3.select('#canvas').style('width', width)
        d3.select('#post-map-svg').attr('width', width)
        const newWidth = parseInt(d3.select('#post-map-svg').style('width'), 10)

        // todo: smoothly transition size and scale
        // d3.select('#post-map-svg').call(zoom.transform, d3.zoomIdentity.scale(scale).translate(newWidth/scale/2,height/scale/2))

        d3.select('#post-map-svg').call(
            zoom.transform,
            d3.zoomIdentity.scale(1).translate(newWidth / 2, height / 2)
        )
        repositionMap(postMapData)
    }

    function updateMap(data) {
        setGravity(defaultGravity)
        repositionMap(data)

        const textLinkData = createLinkData(data, 'text')
        const turnLinkData = createLinkData(data, 'turn')

        function updateLink(link) {
            function fixna(x) {
                if (Number.isFinite(x)) return x
                return 0
            }
            link.attr('x1', (d) => fixna(d.source.x))
                .attr('y1', (d) => fixna(d.source.y))
                .attr('x2', (d) => fixna(d.target.x))
                .attr('y2', (d) => fixna(d.target.y))
        }

        function updateSimulation() {
            d3.selectAll('.post-map-node')
                .attr('cx', (d) => d.x)
                .attr('cy', (d) => d.y)

            d3.selectAll('.post-map-node-text')
                .attr('text-anchor', 'middle')
                .attr('x', (d) => d.x)
                .attr('y', (d) => d.y)

            d3.selectAll('.post-map-text-link').call(updateLink)
            d3.selectAll('.post-map-turn-link').call(updateLink)
        }

        const simulation = d3
            .forceSimulation(data)
            .force(
                'collide',
                d3
                    .forceCollide()
                    .strength(0.9)
                    .radius((d) => findRadius(d) + 5)
                    .iterations(10)
            )
            .force(
                'charge',
                d3.forceManyBody().strength((d) => -findRadius(d) * 8)
            )
            .force('x', d3.forceX(0).strength(gravity / 500)) // (50 / 500 = 0.1)
            .force('y', d3.forceY(0).strength(gravity / 500))
            .force('textLinks', d3.forceLink().links(textLinkData).strength(0.05))
            .force('turnLinks', d3.forceLink().links(turnLinkData).strength(0.09))
            .alpha(1)
            .alphaTarget(0)
            .alphaMin(0.01)
            .alphaDecay(0.002)
            .velocityDecay(0.7)
            .nodes(data)
            .on('tick', updateSimulation)

        function dragStarted(d) {
            const node = d3.select(`#post-map-node-${d.id}`)
            node.classed('active-drag', true)
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
            const node = d3.select(`#post-map-node-${d.id}`)
            node.classed('active-drag', false)
            if (!d3.event.active && !node.classed('pinned')) {
                d.fx = null
                d.fy = null
            }
            simulation.alpha(1)
        }

        // connect simulation gravity to slider
        d3.select('#gravity-slider').on('input', () => {
            const { current } = gravitySlider
            if (current) {
                simulation.force('x').strength(+current.value / 500)
                simulation.force('y').strength(+current.value / 500)
                simulation.alpha(1)
            }
        })
        d3.select('#gravity-input').on('input', () => {
            const { current } = gravityInput
            if (current) {
                simulation.force('x').strength(+current.value / 500)
                simulation.force('y').strength(+current.value / 500)
                simulation.alpha(1)
            }
        })

        // reaheat simulation on svg click
        d3.select('#post-map-svg').on('click', () => simulation.alpha(1))

        // create nodes
        d3.select('#post-map-node-group')
            .selectAll('.post-map-node')
            .data(data, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .classed('post-map-node', true)
                        .attr('id', (d) => `post-map-node-${d.id}`)
                        .attr('r', findRadius)
                        .style('fill', findFill)
                        .style('stroke', findStroke)
                        .style('stroke-width', 2)
                        .attr('opacity', 0)
                        .on('click', (e) => {
                            simulation.alpha(1)
                            setSelectedPost(data.find((post) => post.id === e.id))
                            d3.selectAll('.post-map-node')
                                .transition()
                                .duration(200)
                                .style('stroke-width', 2)
                            d3.select(d3.event.target)
                                .transition()
                                .duration(200)
                                .style('stroke-width', 6)
                        })
                        .call(
                            d3
                                .drag()
                                .on('start', dragStarted)
                                .on('drag', dragged)
                                .on('end', dragEnded)
                        )
                        .call((node) => node.transition().duration(1000).attr('opacity', 1)),
                (update) =>
                    update.call((node) =>
                        node
                            .transition()
                            .duration(1000)
                            .attr('r', findRadius)
                            .style('fill', findFill)
                    ),
                (exit) =>
                    exit.call((node) =>
                        node
                            .transition()
                            .duration(1000)
                            .attr('opacity', 0)
                            .attr('r', 0)
                            .remove()
                            .on('end', (d) => d3.select(`#pattern-${d.id}`).remove())
                    )
            )

        // create text
        d3.select('#post-map-node-group')
            .selectAll('.post-map-node-text')
            .data(data, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append('text')
                        .classed('post-map-node-text', true)
                        .text((d) => {
                            let text = d.text.substring(0, 20)
                            if (text.length === 20) text = text.concat('...')
                            return text
                        })
                        .attr('opacity', 0)
                        .attr('pointer-events', 'none')
                        .on('click', (e) => {
                            setSelectedPost(data.find((post) => post.id === e.id))
                            d3.selectAll('.post-map-node')
                                .transition()
                                .duration(200)
                                .style('stroke-width', 2)
                            d3.select(`#post-map-node-${e.id}`)
                                .transition()
                                .duration(200)
                                .style('stroke-width', 6)
                        })
                        .call((node) => node.transition().duration(1000).attr('opacity', 1)),
                (update) => update.call((node) => node.transition().duration(1000)),
                (exit) =>
                    exit.call((node) =>
                        node.transition().duration(1000).attr('opacity', 0).remove()
                    )
            )

        // create text links
        d3.select('#post-map-link-group')
            .selectAll('.post-map-text-link')
            .data(textLinkData)
            .join(
                (enter) =>
                    enter
                        .append('line')
                        .classed('post-map-text-link', true)
                        .attr('stroke', 'black')
                        .attr('stroke-width', '3px')
                        .attr('marker-end', 'url(#text-link-arrow)')
                        .attr('opacity', 0)
                        .call((node) => node.transition().duration(1000).attr('opacity', 0.3)),
                (update) => update.call((node) => node.transition().duration(1000)),
                (exit) =>
                    exit.call((node) =>
                        node.transition().duration(1000).attr('opacity', 0).remove()
                    )
            )

        // create turn links
        d3.select('#post-map-link-group')
            .selectAll('.post-map-turn-link')
            .data(turnLinkData)
            .join(
                (enter) =>
                    enter
                        .append('line')
                        .classed('post-map-turn-link', true)
                        .attr('stroke', 'black')
                        .attr('stroke-width', '3px')
                        .attr('stroke-dasharray', 3)
                        .attr('marker-end', 'url(#turn-link-arrow)')
                        .attr('opacity', 0)
                        .call((node) => node.transition().duration(1000).attr('opacity', 0.3)),
                (update) => update.call((node) => node.transition().duration(1000)),
                (exit) =>
                    exit.call((node) =>
                        node.transition().duration(1000).attr('opacity', 0).remove()
                    )
            )

        // if no selected post and posts present, select top post
        if (!selectedPost && data[0]) {
            setSelectedPost(data[0])
            d3.select(`#post-map-node-${data[0].id}`).style('stroke-width', 6)
        }
    }

    useEffect(() => {
        createCanvas()
    }, [])

    useEffect(() => {
        getPostMapData(postMapPaginationLimit)
    }, [spaceData.id, spacePostsFilters])

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
                        <div
                            className='blueText ml-10'
                            role='button'
                            tabIndex={0}
                            onClick={() => getPostMapData(totalMatchingPosts)}
                            onKeyDown={() => getPostMapData(totalMatchingPosts)}
                        >
                            load all
                        </div>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.gravityText}>Gravity:</span>
                        {/* todo: add regex to gavity input */}
                        <input
                            ref={gravitySlider}
                            id='gravity-slider'
                            className={styles.gravitySlider}
                            type='range'
                            value={gravity}
                            min='-50'
                            max='150'
                            onChange={() => {
                                const { current } = gravitySlider
                                if (current) {
                                    setGravity(+current.value)
                                }
                            }}
                        />
                        <input
                            ref={gravityInput}
                            id='gravity-input'
                            className={styles.gravityInput}
                            value={gravity}
                            type='number'
                            onChange={(e) => setGravity(+e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.key}>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => setShowKey(!showKey)}
                        onKeyDown={() => setShowKey(!showKey)}
                    >
                        <img
                            className={styles.keyButton}
                            src='/icons/key-solid.svg'
                            aria-label='key'
                        />
                    </div>
                    {showKey && (
                        <div className={styles.keyItems}>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>No Account Reaction</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ border: '2px solid rgb(140 140 140)' }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Account Reaction</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ border: '2px solid #83b0ff' }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Text Link</span>
                                <div className={styles.textLink} />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Turn Link</span>
                                <div className={styles.turnLink} />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Text</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ backgroundColor: colors.green }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Url</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ backgroundColor: colors.yellow }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Poll</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ backgroundColor: colors.red }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Glass Bead</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ backgroundColor: colors.blue }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Prism</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ backgroundColor: colors.purple }}
                                />
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Plot Graph</span>
                                <div
                                    className={styles.colorBox}
                                    style={{ backgroundColor: colors.orange }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div id='canvas' />
            {selectedPost && (
                <div className={styles.selectedPostWrapper}>
                    <PostCard postData={selectedPost || {}} location='holon-post-map' />
                </div>
            )}
        </div>
    )
}

export default HolonPostMap
