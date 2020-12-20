import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPostMap.module.scss'
import colors from '../../styles/Colors.module.scss'
import PostCard from '../Cards/PostCard/PostCard'

function HolonPostMap() {
    const {
        holonPosts,
        totalMatchingPosts,
        getAllHolonPosts,
        holonPostSortByFilter,
        holonPostSortOrderFilter
    } = useContext(HolonContext)

    const [selectedPost, setSelectedPost] = useState({ creator: {}, DirectSpaces: [] })
    const [rangeValue, setRangeValue] = useState(50)
    const [showKey, setShowKey] = useState(false)

    //console.log('holonPosts: ', holonPosts)
    // let selectedPost = holonPosts.find(post => post.id = selectedPostId)
    // console.log('selectedPost: ', selectedPost)

    const range = useRef()

    const width = 700
    const height = 500

    function updateRangeInput() {
        // console.log('setRangeValue: ', range.current.value)
        setRangeValue(range.current.value)
    }
    
    useEffect(() => {
        setSelectedPost(holonPosts[0])
        // let rangeValue2 = rangeValue
        let rangeValue2 = rangeValue;
        console.log('HolonPostMap: first useEffect')
        let dMin = 0, dMax
        if (holonPostSortByFilter === 'Reactions') dMax = d3.max(holonPosts.map(post => post.total_reactions))
        if (holonPostSortByFilter === 'Likes') dMax = d3.max(holonPosts.map(post => post.total_likes))
        if (holonPostSortByFilter === 'Reposts') dMax = d3.max(holonPosts.map(post => post.total_reposts))
        if (holonPostSortByFilter === 'Ratings') dMax = d3.max(holonPosts.map(post => post.total_ratings))
        if (holonPostSortByFilter === 'Comments') dMax = d3.max(holonPosts.map(post => post.total_comments))
        if (holonPostSortByFilter === 'Date') {
            dMin = d3.min(holonPosts.map(post => Date.parse(post.createdAt)))
            dMax = d3.max(holonPosts.map(post => Date.parse(post.createdAt)))
        }

        let domainMin, domainMax
        if (holonPostSortOrderFilter === 'Descending') { domainMin = dMin; domainMax = dMax }
        if (holonPostSortOrderFilter === 'Ascending') { domainMin = dMax; domainMax = dMin }

        let radiusScale = d3.scaleLinear()
            .domain([domainMin, domainMax]) // data values range
            .range([20, 60]) // radius range

        // create link arrays
        let textLinkData = []
        let turnLinkData = []
        holonPosts.forEach((post, postIndex) => {
            let filteredLinks = post.OutgoingLinks.filter(link => link.state === 'visible')
            filteredLinks.forEach(link => {
                let targetIndex = null
                // search posts using id to find target index
                holonPosts.forEach((p, i) => {
                    if (p.id === link.itemBId) {
                        console.log('i: ', i)
                        targetIndex = i
                    }
                })
                if (targetIndex !== null) {
                    let linkData = {
                        source: postIndex,
                        target: targetIndex
                    }
                    if (link.relationship === 'text') textLinkData.push(linkData)
                    if (link.relationship === 'turn') turnLinkData.push(linkData)
                }
            })
        })
        console.log('textLinkData', textLinkData)
        console.log('turnLinkData', turnLinkData)

        let simulation = d3
            .forceSimulation(holonPosts)
            .force('charge', d3.forceManyBody().strength(function (d) {
                //let charge = -80 - (d.total_likes * d.total_likes * 100)
                // let charge = -200 - (d.total_likes * d.total_likes * 300)
                let charge
                if (holonPostSortByFilter === 'Reactions') { charge = d.total_reactions; return -100 - (charge * 100) }
                if (holonPostSortByFilter === 'Likes') charge = d.total_likes
                if (holonPostSortByFilter === 'Reposts') charge = d.total_reposts
                if (holonPostSortByFilter === 'Ratings') charge = d.total_ratings
                if (holonPostSortByFilter === 'Comments') charge = d.total_comments
                if (holonPostSortByFilter === 'Date') { charge = - Date.parse(d.createdAt) / 10000000000; return charge }
                let newCharge = -100 - (charge * 100)//-100 - (charge * 400)
                return newCharge
            }))
            .force('center', d3.forceCenter(width/2, height/2))
            .force('x', d3.forceX(width/2).strength(rangeValue2/1000)) //0.05
            .force('y', d3.forceY(height/2).strength(rangeValue2/1000))
            .force('textLinks', d3.forceLink().links(textLinkData).strength(0.05))
            .force('turnLinks', d3.forceLink().links(turnLinkData).strength(0.09))
            // .force('x', d3.forceX(width / 2).strength(0.2))
            // .force('y', d3.forceY(height / 2).strength(0.2))
            .force('collide', d3.forceCollide(function(d) {
                let radius
                if (holonPostSortByFilter === 'Reactions') radius = d.total_reactions
                if (holonPostSortByFilter === 'Likes') radius = d.total_likes
                if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
                if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
                if (holonPostSortByFilter === 'Comments') radius = d.total_comments
                if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)
                return radiusScale(radius) + 5
                //return radiusScale(d.total_likes) + 5
            }))

        function dragstarted(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(.03).restart()
                d.fx = d.x
                d.fy = d.y
            }
        }

        function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        }

        function dragended(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(.03)
                d.fx = null
                d.fy = null
            }
        }

        d3.select("#canvas")
            .append("svg")
            .attr('id', 'canvas-svg')
            .attr("width", width) //+ margin.left + margin.right)
            .attr("height", height) // + margin.top + margin.bottom)
            // .call(d3.zoom().on("zoom", () => nodes.attr("transform", d3.event.transform)))

        var svg = d3.select("#canvas-svg")

        const arrowPoints = 'M 0 0 6 3 0 6 1.5 3'

        // create text links
        svg.append("svg:defs").append("svg:marker")
            .attr("id", 'blue-arrow')
            .attr("refX", 5)
            .attr("refY", 3)
            .attr("markerWidth", 40)
            .attr("markerHeight", 40)
            .attr('orient', 'auto-start-reverse')
            .append("path")
            .attr("d", arrowPoints)
            .style("fill", colors.blue)
        let textLinks = svg.append("g").attr("class", "textLinks")
            .selectAll("#textLink")
            .data(textLinkData)
            .enter()
            .append("line")
            .attr("id", "textLink")
            .attr("stroke", 'black')//colors.blue)
            .attr("stroke-width", "3px")
            .attr('opacity', 0.3)
            //.attr('stroke-dasharray', 3)
            //.attr("marker-end", "url(#blue-arrow)")

        // create nodes
        let nodes = svg.selectAll("node")
            .data(holonPosts)
            .enter()
            .append('g')
            //.call(d3.zoom().on("zoom", () => nodes.attr("transform", d3.event.transform)))

        // create turn links
        svg.append("svg:defs").append("svg:marker")
            .attr("id", 'green-arrow')
            .attr("refX", 5)
            .attr("refY", 3)
            .attr("markerWidth", 40)
            .attr("markerHeight", 40)
            .attr('orient', 'auto-start-reverse')
            .append("path")
            .attr("d", arrowPoints)
            .style("fill", 'black')//colors.darkGreen)
        let turnLinks = svg.append("g").attr("class", "turnLinks")
            .selectAll("#turnLink")
            .data(turnLinkData)
            .enter()
            .append("line")
            .attr("id", "turnLink")
            .attr("stroke", 'black')//colors.darkGreen)
            .attr("stroke-width", "3px")
            .attr('stroke-dasharray', 3)
            .attr('opacity', 0.3)
            .attr("marker-end", "url(#green-arrow)")

        var defs = svg.append("defs").attr("id", "imgdefs")

        // add circles to nodes
        nodes
            .append("circle")
            .attr('class', 'post-map-node')
            .attr('id', d => `post-map-node-${d.id}`)
            .attr("r", function(d) {
                let radius
                if (holonPostSortByFilter === 'Reactions') radius = d.total_reactions
                if (holonPostSortByFilter === 'Likes') radius = d.total_likes
                if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
                if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
                if (holonPostSortByFilter === 'Comments') radius = d.total_comments
                if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)
                return radiusScale(radius)
            })
            .style("fill", function(d){
                if (d.urlImage !== null) {
                    var pattern = defs.append("pattern")
                        .attr("id", `${d.id}`)
                        .attr("height", 1)
                        .attr("width", 1)
                        .attr("x", "0")
                        .attr("y", "0")
        
                    pattern.append("image")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("height", function() {
                            let radius
                            if (holonPostSortByFilter === 'Reactions') radius = d.total_reactions
                            if (holonPostSortByFilter === 'Likes') radius = d.total_likes
                            if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
                            if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
                            if (holonPostSortByFilter === 'Comments') radius = d.total_comments
                            if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)
                            return radiusScale(radius) * 2
                        })
                        .attr("xlink:href", d.urlImage)

                    return `url(#${d.id})`
                }
                else {
                    if (d.type === 'url') { return colors.yellow }
                    if (d.type === 'poll') { return colors.red }
                    if (d.type === 'text') { return colors.green }
                    if (d.type === 'prism') { return colors.purple }
                    if (d.type === 'glass-bead') { return colors.blue }
                    if (d.type === 'plot-graph') { return colors.orange }
                }
            })
            .style("stroke", d => (d.account_like || d.account_repost || d.account_rating || d.account_link > 0) ? '#83b0ff' : 'rgb(140 140 140)')//"transparent")
            .style("stroke-width", (d, i) => i === 0 ? 6 : 2 )
            .attr('opacity', 0.9)
            .on('click', e => {
                setSelectedPost(holonPosts.find(post => post.id === e.id))
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
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        // add text to nodes
        nodes
            .append("text")
            .attr('class', 'post-map-node-text')
            .text(function(d){ 
                let text = d.text.substring(0, 30)
                if (text.length === 50) text = text.concat('...')
                return text
            })
            .on('click', e => {
                setSelectedPost(holonPosts.find(post => post.id === e.id))
                d3.selectAll('.post-map-node')
                    .transition()
                    .duration(200)
                    .style("stroke-width", 2)
                d3.select(`#post-map-node-${e.id}`)
                    .transition()
                    .duration(200)
                    .style("stroke-width", 6)
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))


        svg.call(d3.zoom().on("zoom", () => {
            nodes.attr("transform", d3.event.transform)
            turnLinks.attr("transform", d3.event.transform)
            textLinks.attr("transform", d3.event.transform)
        }))
            
        simulation
            .nodes(holonPosts)
            .on('tick', update)

        function update() {
            d3.selectAll('.post-map-node')
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y })

            d3.selectAll('.post-map-node-text')
                .attr('text-anchor', 'middle')
                .attr("x", function(d) { return d.x })
                .attr("y", function(d) { return d.y })

            d3.selectAll('#node-images')
                .attr("x", function(d) { return d.x - 40 })
                .attr("y", function(d) { return d.y - 40 })

            turnLinks.call(updateLink)
            textLinks.call(updateLink)
        }

        function fixna(x) {
            if (isFinite(x)) return x;
            return 0;
        }

        function updateLink(link) {
            link.attr("x1", function(d) { return fixna(d.source.x); })
                .attr("y1", function(d) { return fixna(d.source.y); })
                .attr("x2", function(d) { return fixna(d.target.x); })
                .attr("y2", function(d) { return fixna(d.target.y); });
        }
    
        d3.select("#range").on("input", function() {
            //update(+this.value);
            
            // rangeValue2 = range.current.value
            console.log('range changed: ', range.current.value)
            // simulation.force('x', d3.forceX(width/2).strength(rangeValue/1000)) //0.05
            // .force('y', d3.forceY(height/2).strength(rangeValue/1000))

            let forceX = simulation.force("x")
            let forceY = simulation.force("y")
            forceX.strength(range.current.value/1000)
            forceY.strength(range.current.value/1000)
            //simulation.restart()
            simulation.alphaTarget(.03).restart()
        });

        return function cleanup() {
            d3.select('#canvas').selectAll("*").remove()
        }

    },[holonPosts])

    return (
        <div className={styles.holonPostMap}>
            <div className={styles.controls}>
                <div className={styles.controlsLeft}>
                    <div className={styles.item}>
                        Showing {holonPosts.length} of {totalMatchingPosts} posts
                        <span className={`blueText ml-10`} onClick={getAllHolonPosts}>
                            load all
                        </span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.rangeText}>Gravity:</span>
                        <input ref={range} id='range' className={styles.rangeInput} type="range" value={rangeValue} min="-200" max="200" onChange={updateRangeInput}/>
                        <span className={styles.rangeValue}>{ rangeValue }</span>
                    </div>
                </div>
                <div className={styles.key}>
                    <img className={styles.keyButton} src='/icons/key-solid.svg' onClick={() => setShowKey(!showKey)}/>
                    {showKey &&
                        <div className={styles.keyItems}>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Text</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.green }}/>
                                {/* <span className={styles.text}>Text</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Url</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.yellow }}/>
                                {/* <span className={styles.text}>Url</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Poll</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.red }}/>
                                {/* <span className={styles.text}>Poll</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Glass Bead</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.blue }}/>
                                {/* <span className={styles.text}>Glass Bead</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Prism</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.purple }}/>
                                {/* <span className={styles.text}>Prism</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Plot Graph</span>
                                <div className={styles.colorBox} style={{ backgroundColor: colors.orange }}/>
                                {/* <span className={styles.text}>Plot Graph</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>No Account Reaction</span>
                                <div className={styles.colorBox} style={{ border: '2px solid rgb(140 140 140)' }}/>
                                {/* <span className={styles.text}>No Reaction</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Account Reaction</span>
                                <div className={styles.colorBox} style={{ border: '2px solid #83b0ff' }}/>
                                {/* <span className={styles.text}>Reaction</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Text Link</span>
                                <div className={styles.textLink}/>
                                {/* <span className={styles.text}>Reaction</span> */}
                            </div>
                            <div className={styles.postMapKeyItem}>
                                <span className={styles.text}>Turn Link</span>
                                <div className={styles.turnLink}/>
                                {/* <span className={styles.text}>Reaction</span> */}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div id='canvas' style={{ height, width }}/>
            <div className={styles.selectedPostWrapper}>
                <PostCard postData={selectedPost} location='holon-post-map'/>
            </div>
        </div>
    )
}

export default HolonPostMap
