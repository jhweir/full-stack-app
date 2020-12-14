import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../Config'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'

function HolonPostMap() {
    const { holonData, holonContextLoading, holonPosts, holonPostSortByFilter, holonPostSortOrderFilter, selectedHolonSubPage, holonHandle } = useContext(HolonContext)
    const [postMapData, setPostMapData] = useState()

    console.log('holonPosts: ', holonPosts)

    const width = 700
    const height = 700

    // function getPostMapData() {
    //     axios
    //         .get(config.environmentURL + `/post-map-data?spaceId=${holonData.id}`)
    //         .then(res => setPostMapData(res.data))
    // }
    
    useEffect(() => {
        console.log('HolonPostMap: first useEffect')
        let dMin = 0, dMax
        if (holonPostSortByFilter === 'Total Reactions') dMax = d3.max(holonPosts.map(post => post.total_reactions))
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

        // var links = [
        //     {source: 0, target: 1},
        //     {source: 0, target: 2},
        //     {source: 0, target: 3},
        //     {source: 1, target: 6},
        //     {source: 3, target: 4},
        //     {source: 3, target: 7},
        //     {source: 4, target: 5},
        //     {source: 4, target: 7}
        // ]

        // gather links
        let links = []
        holonPosts.forEach((post, index) => {
            post.PostsLinkedTo.forEach(plt => {
                let pltIndex
                holonPosts.forEach((p, i) => {
                    if (p.id === plt.id) pltIndex = i
                })
                if (pltIndex) {
                    let link = {
                        source: index,
                        target: pltIndex
                    }
                    links.push(link)
                }
            })
        })

        console.log('links', links)

        let simulation = d3
            .forceSimulation(holonPosts)
            .force('charge', d3.forceManyBody().strength(function (d) {
                //let charge = -80 - (d.total_likes * d.total_likes * 100)
                // let charge = -200 - (d.total_likes * d.total_likes * 300)
                let charge
                if (holonPostSortByFilter === 'Total Reactions') { charge = d.total_reactions; return -100 - (charge * 100) }
                if (holonPostSortByFilter === 'Likes') charge = d.total_likes
                if (holonPostSortByFilter === 'Reposts') charge = d.total_reposts
                if (holonPostSortByFilter === 'Ratings') charge = d.total_ratings
                if (holonPostSortByFilter === 'Comments') charge = d.total_comments
                if (holonPostSortByFilter === 'Date') { charge = - Date.parse(d.createdAt) / 10000000000; return charge }
                let newCharge = -100 - (charge * 300)
                return newCharge
            }))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX(width / 2).strength(0.07))
            .force('y', d3.forceY(height / 2).strength(0.07))
            .force('link', d3.forceLink().links(links).strength(0.05))
            // .force('x', d3.forceX(width / 2).strength(0.2))
            // .force('y', d3.forceY(height / 2).strength(0.2))
            .force('collide', d3.forceCollide(function(d) {
                let radius
                if (holonPostSortByFilter === 'Total Reactions') radius = d.total_reactions
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

        d3.select("#container")
            .append("svg")
            .attr('id', 'container-svg')
            .attr("width", width) //+ margin.left + margin.right)
            .attr("height", height) // + margin.top + margin.bottom)
            // .call(d3.zoom().on("zoom", () => nodes.attr("transform", d3.event.transform)))

        var svg = d3.select("#container-svg")

        // create nodes
        let nodes = svg.selectAll("node")
            .data(holonPosts)
            .enter()
            .append('g')
            //.call(d3.zoom().on("zoom", () => nodes.attr("transform", d3.event.transform)))

        const arrowPoints = 'M 0 0 12 6 0 12 3 6'

        svg.append("svg:defs").append("svg:marker")
            .attr("id", 'arrow')
            .attr("refX", 6)
            .attr("refY", 6)
            .attr("markerWidth", 40)
            .attr("markerHeight", 40)
            .attr('orient', 'auto-start-reverse')
            .append("path")
            .attr("d", arrowPoints)
            .style("fill", "#ddd")
        
        let edges = svg.append("g").attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke", "#aaa")
            .attr("stroke-width", "2px")
            .attr("marker-end", "url(#arrow)")

        var defs = svg.append("defs").attr("id", "imgdefs")

        // add circles to nodes
        nodes
            .append("circle")
            .attr('id', 'circle-node')
            .attr("r", function(d) {
                let radius
                if (holonPostSortByFilter === 'Total Reactions') radius = d.total_reactions
                if (holonPostSortByFilter === 'Likes') radius = d.total_likes
                if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
                if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
                if (holonPostSortByFilter === 'Comments') radius = d.total_comments
                if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)
                return radiusScale(radius)
                //return radiusScale(d.total_likes)
            })
            // .attr("fill", "url(#catpattern)")
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
                            if (holonPostSortByFilter === 'Total Reactions') radius = d.total_reactions
                            if (holonPostSortByFilter === 'Likes') radius = d.total_likes
                            if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
                            if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
                            if (holonPostSortByFilter === 'Comments') radius = d.total_comments
                            if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)
                            return radiusScale(radius) * 2
                        })
                        //.attr("width", radiusScale(d.total_likes) * 2)
                        .attr("xlink:href", d.urlImage)

                    return `url(#${d.id})`
                }
                else {
                    if (d.type === 'url') { return '#71cde3' }
                    if (d.type === 'poll') { return '#ff4040' }
                    if (d.type === 'text') { return '#82ed4c' }
                    if (d.type === 'prism') { return '#9c5cf7' }
                }
            })
            //.attr("fill", "url(#catpattern)")
            .style("stroke", d => (d.account_like || d.account_repost || d.account_rating > 0) ? '#83b0ff' : "transparent")
            .style("stroke-width", 4)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        // add text to nodes
        nodes
            .append("text")
            .attr('class', 'post-text')
            .text(function(d){ return d.text })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        svg.call(d3.zoom().on("zoom", () => {
            nodes.attr("transform", d3.event.transform)
            edges.attr("transform", d3.event.transform)
        }))
            
        simulation
            .nodes(holonPosts)
            .on('tick', update)

        function update() {
            d3.selectAll('#circle-node')
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y })

            d3.selectAll('.post-text')
                .attr('text-anchor', 'middle')
                .attr("x", function(d) { return d.x })
                .attr("y", function(d) { return d.y })

            d3.selectAll('#node-images')
                .attr("x", function(d) { return d.x - 40 })
                .attr("y", function(d) { return d.y - 40 })

            edges.call(updateLink)
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

        return function cleanup() {
            d3.select('#container').selectAll("*").remove()
        }

    },[holonPosts])

    return (
        <div id='container' style={{ height: height, width:width, overflow: 'hidden' }} />
    )
}

export default HolonPostMap
