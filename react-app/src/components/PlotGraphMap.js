import React, { useState, useEffect, useContext } from 'react'
import styles from '../styles/components/PrismMap.module.scss'
import * as d3 from 'd3'
import * as d3Hexbin from "d3-hexbin";
import { Delaunay } from "d3-delaunay";
import { schemeSet3 } from 'd3';

function PlotGraphMap(props) {
    const { postData, plotGraphData } = props

    console.log('plotGraphData: ', plotGraphData)
    
    const width = 1200
    const height = 700
    let centerX = width / 2
    let centerY = height / 2
    let xOffset = 21.25
    let yOffset = 4.6

    const colors = [
        '#f7f7f9', // light grey (default)
        '#9583e6', // purple
        '#eb4034', // red
        '#fcba03', // orange
        '#f2dc30', // yellow
        '#3ac75f', // green
        '#57bcff', // blue
    ]

    function onClick() {
        // console.log('d3.mouse(this): ', d3.mouse(this))
        let node = d3.select('#node-group').append('g').attr('id', `node`)
        node.append('circle')
            .attr('r', function(d) { return 20 })
            .attr("cx", function(d) { return d3.mouse(this)[0] })
            .attr("cy", function(d) { return d3.mouse(this)[1] })
            .style('fill', function(d) { return 'red' })
    }

    function createNode() {

    }

    useEffect(() => {
        if (plotGraphData.id) { 

            // create svg
            d3.select('#container')
                .append('svg')
                .attr('id', 'plot-graph-svg')
                .attr('width', width) //+ margin.left + margin.right)
                .attr('height', height)
                .on('mousedown', onClick)

            // enable zoom and drag
            d3.select('#container').call(d3.zoom().on("zoom", () => d3.select('#master-group').attr("transform", d3.event.transform)))

            // create master group
            d3.select('#plot-graph-svg').append('g').attr('id', 'master-group')
            let masterGroup = d3.select('#master-group')

            // create node group
            masterGroup.append('g').attr('id', 'node-group')
            let nodeGroup = d3.select('#node-group')

            // add event listeners
            //d3.select('#plotGraphSVG').on('mousedown', handleMouseClick)

            const arrowPoints = 'M 0 0 12 6 0 12 3 6'
            // const reverseArrowPoints = 'M 12 0 0 6 12 12 9 6'
            //const arrowPointsSmaller = 'M 0 0 8 4 0 8 2 4'

            masterGroup.append("svg:defs").append("svg:marker")
                .attr("id", 'arrow')
                .attr("refX", 6)
                .attr("refY", 6)
                .attr("markerWidth", 40)
                .attr("markerHeight", 40)
                .attr('orient', 'auto-start-reverse')
                .append("path")
                .attr("d", arrowPoints)
                .style("fill", "#ddd")

            function createText(x, y, text) {
                masterGroup.append('g')
                    .attr('class', 'text')
                    .append('text')
                    .text(text)
                    .style('font-size', 20)
                    .style('font-weight', 400)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('x', x)
                    .attr('y', y)
            }

            function createAxisLine(startX, startY, endX, endY, stroke, strokeWidth) {
                masterGroup.append('g')
                    .attr('class', 'line')
                    .append('path')
                    .attr('d', `M${startX} ${startY} L${endX} ${endY}`)
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth)
                    .attr("marker-end", "url(#arrow)")
                    //.attr('opacity', 0.5)
                    //.attr("transform", () => { return `translate(${xPosition},${yPosition})` })
            }

            if (plotGraphData.numberOfPlotGraphAxes > 0) {
                createText(100, centerY, plotGraphData.axis1Left)
                createText(width - 100, centerY, plotGraphData.axis1Right)
                // center to right
                createAxisLine(width / 2, centerY, width - 200, centerY, '#ddd', 2)
                // center to left
                createAxisLine(width / 2, centerY, 200, centerY, '#ddd', 2)
            }

            if (plotGraphData.numberOfPlotGraphAxes > 1) {
                createText(centerX, 20, plotGraphData.axis2Top)
                createText(centerX, height - 20, plotGraphData.axis2Bottom)
                // center to top
                createAxisLine(centerX, height / 2, centerX, 80, '#ddd', 2)
                // center to bottom
                createAxisLine(centerX, height / 2, centerX, height - 80, '#ddd', 2)
            }

                // center to top
            

                // function createNode({ x, y, r, fill, opacity, strokeColor, strokeWidth, title, titleFontSize, text, textFontSize }) {
                //     var node = svg.append('g')
                //     node.append('circle')
                //         .attr('id', 'center-node')
                //         .attr('stroke', strokeColor)
                //         .attr('fill', fill)
                //         .attr('stroke-width', strokeWidth)
                //         .attr('r', r)
                //         .attr('cx', x)
                //         .attr('cy', y)
                //         .attr('opacity', opacity)

                //     node.append('text')
                //         .text(title)
                //         .style('font-size', titleFontSize)
                //         .style('font-weight', 800)
                //         .attr('text-anchor', 'middle')
                //         .attr('dominant-baseline', 'central')
                //         .attr('x', x)
                //         .attr('y', y - r - 10 - (r / 10))

                //     node.append('text')
                //         .text(text)
                //         .style('font-size', textFontSize)
                //         .style('font-weight', 800)
                //         .attr('text-anchor', 'middle')
                //         .attr('dominant-baseline', 'central')
                //         .attr('x', x)
                //         .attr('y', y)
                // }
            // return function cleanup() {
            //     d3.select('#prismMap').selectAll("*").remove()
            // }
        }
    }, [plotGraphData])

    return (
        <div id='container'/>
    )
}

export default PlotGraphMap

// // // create hexagonal grids
// const radius = 28
// const xOffset = 54.7
// const yOffset = -28
// const hexGroup1 = svg.append('g')
// const hexGen1 = d3Hexbin.hexbin()
// const points1 = hexGen1.radius([radius]).extent([[0 - width, - (height + 100)], [width * 2 + 30, height * 2 + 20]]).centers()
// hexGroup1.selectAll('path')
//     .data(hexGen1(points1))
//     .enter()
//     .append('path')
//     .attr('d', function(d) { return 'M' + (d.x - xOffset) + ',' + (d.y + yOffset) + hexGen1.hexagon() })
//     .attr('fill', 'transparent')
//     .attr('stroke', '#eee')
//     .attr('stroke-width', 2)
//     //.attr('opacity', 0.05)