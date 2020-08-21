import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../Config'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'

function HolonPostMap() {
    const { holonContextLoading, holonPosts, holonPostSortByFilter, selectedHolonSubPage, holonHandle } = useContext(HolonContext)

    //console.log('holonPosts: ', holonPosts)

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
            .force('x', d3.forceX(width / 2).strength(0.03))
            .force('y', d3.forceY(height / 2).strength(0.03))
            .force('collide', d3.forceCollide(function(d) {
                return radiusScale(d.total_likes) + 2
            }))

        let circles = d3
            .select("#post-map-svg")
            .append('g')
            .selectAll("dot")
            .data(holonPosts)
            .enter()
            .append("circle")
            .attr("r", function(d) {
                return radiusScale(d.total_likes)
            })
            .style("fill", "#71cde3")
            //.exit().remove()
            // .style("opacity", 0)
            // .transition()
            // .duration(3000)
            // .style("opacity", 0.4)

        //circles.selectAll('g').remove()
            
        simulation
            .nodes(holonPosts)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y })
        }

        //simulation.stop()

    },[])

    return (
        <div>
            <svg id={'post-map-svg'} height={height} width={width}>
                {/* <g>
                    {postData.createdAt && pollVotesGroupedByAnswer.map((answer, i) =>
                        <path
                            key={i}
                            id={`line-${answer.key}`}
                            d={line(answer.values)}
                            fill={"transparent"}
                            stroke={colorScale(i)}
                            strokeWidth={3}
                        />
                    )}
                </g> */}
            </svg>
        </div>
    )
}

export default HolonPostMap
