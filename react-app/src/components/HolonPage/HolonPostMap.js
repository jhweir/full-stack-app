import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../Config'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'

function HolonPostMap() {
    const { holonContextLoading, holonPosts, holonPostSortByFilter, holonPostSortOrderFilter, selectedHolonSubPage, holonHandle } = useContext(HolonContext)

    console.log('holonPosts: ', holonPosts)

    const width = 700
    const height = 700
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    // let rangeBottom
    // if (holonPostSortByFilter === 'Likes') { rangeBottom =  }
    
    useEffect(() => {
        console.log('post map useEffect run')
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

        let simulation = d3
            .forceSimulation(holonPosts)
            .force('x', d3.forceX(width / 2).strength(0.02))
            .force('y', d3.forceY(height / 2).strength(0.02))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide(function(d) {
                let radius
                if (holonPostSortByFilter === 'Total Reactions') radius = d.total_reactions
                if (holonPostSortByFilter === 'Likes') radius = d.total_likes
                if (holonPostSortByFilter === 'Reposts') radius = d.total_reposts
                if (holonPostSortByFilter === 'Ratings') radius = d.total_ratings
                if (holonPostSortByFilter === 'Comments') radius = d.total_comments
                if (holonPostSortByFilter === 'Date') radius = Date.parse(d.createdAt)
                return radiusScale(radius) + 10
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

        // add images to nodes
        // nodes
        //     .filter(function(d) { return d.urlImage !== null })
        //     .append("image")
        //     .attr('id', 'node-images')
        //     .attr("xlink:href", function(d) { return d.urlImage })
        //     //.attr("clip-path", "url(#clip-path)")
        //     .attr("width", 80)
        //     .attr("height", 80)
        //     .call(d3.drag()
        //         .on("start", dragstarted)
        //         .on("drag", dragged)
        //         .on("end", dragended))

        svg.call(d3.zoom().on("zoom", () => nodes.attr("transform", d3.event.transform)))
            
        simulation
            .nodes(holonPosts)
            .on('tick', ticked)

        function ticked() {
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

            // d3.selectAll('#clip-path')
            //     .attr("cx", function(d) { return d.x })
            //     .attr("cy", function(d) { return d.y })
            
        }
        //simulation.stop()
        return function cleanup() {
            d3.select('#container').selectAll("*").remove()
        }

    },[holonPosts])

    return (
        <div id='container' style={{ height: height, width:width, overflow: 'hidden' }}> 
            {/* <svg id={'post-map-svg'} height={height} width={width}>
            </svg> */}
        </div>
    )
}

export default HolonPostMap
