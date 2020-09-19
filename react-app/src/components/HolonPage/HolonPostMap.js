import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../Config'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'

function HolonPostMap() {
    const { holonContextLoading, holonPosts, holonPostSortByFilter, selectedHolonSubPage, holonHandle } = useContext(HolonContext)

    console.log('holonPosts: ', holonPosts)

    const width = 600
    const height = 350
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    // let rangeBottom
    // if (holonPostSortByFilter === 'Likes') { rangeBottom =  }

    useEffect(() => {
        console.log('post map useEffect run')
        const domainMin = 0
        const domainMax = d3.max(holonPosts.map(post => post.total_likes))

        let radiusScale = d3.scaleLinear()
            .domain([domainMin, domainMax]) // data values range
            .range([20, 60]) // radius range

        let simulation = d3
            .forceSimulation(holonPosts)
            .force('x', d3.forceX(width / 2).strength(0.08))
            .force('y', d3.forceY(height / 2).strength(0.08))
            .force('collide', d3.forceCollide(function(d) {
                return radiusScale(d.total_likes) + 5
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

        // create nodes
        let nodes = d3
            .select("#post-map-svg")
            .selectAll("node")
            .data(holonPosts)
            .enter()
            .append('g')

        // add circles to nodes
        nodes
            .append("circle")
            .attr("r", function(d) {
                return radiusScale(d.total_likes)
            })
            .style("fill", function(d){
               if (d.type === 'url') { return "#71cde3" }
               if (d.type === 'poll') { return 'red' }
               if (d.type === 'text') { return 'yellow' }
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        // add text to nodes
        nodes
            .append("text")
            .text(function(d){ return d.text })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        // add images to nodes
        nodes
            .filter(function(d) { return d.urlImage !== null })
            .append("image")
            .attr("xlink:href", function(d) { return d.urlImage })
            .attr("width", 80)
            .attr("height", 80)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            
        simulation
            .nodes(holonPosts)
            .on('tick', ticked)

        function ticked() {
            d3
                .selectAll('circle')
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y })

            d3
                .selectAll('text')
                .attr('text-anchor', 'middle')
                .attr("x", function(d) { return d.x })
                .attr("y", function(d) { return d.y })

            d3
                .selectAll('image')
                .attr("x", function(d) { return d.x - 40 })
                .attr("y", function(d) { return d.y - 40 })
        }

        //simulation.stop()

    },[])

    return (
        <div>
            <svg id={'post-map-svg'} height={height} width={width}>
            </svg>
        </div>
    )
}

export default HolonPostMap
