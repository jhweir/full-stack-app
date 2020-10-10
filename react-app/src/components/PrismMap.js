import React, { useState, useEffect, useContext } from 'react'
import styles from '../styles/components/PrismMap.module.scss'
import * as d3 from 'd3'
import * as d3Hexbin from "d3-hexbin";

function PrismMap(props) {
    const { postData, prismData } = props
    
    const width = 1200
    const height = 700

    const blue = '#57bcff'

    console.log('prismData: ', prismData)

    // function getPrismData() {
    //     console.log('Prism: getPrismData')
    //     axios.get(config.environmentURL + `/prism-data?postId=${postData.id}`)
    //         .then(res => setPrismData(res.data))
    // }

    useEffect(() => {
        if (prismData.id) {
            let svg = d3.select('#prismMap')
                .append('svg')
                .attr('width', width) //+ margin.left + margin.right)
                .attr('height', height)

            // create center point
            // svg.append('g')
            //     .append('circle')
            //     .attr('id', 'center-node')
            //     .attr('fill', 'red')
            //     .attr('stroke-width', 5)
            //     .attr('r', 0.1)
            //     .attr('cx', width / 2)
            //     .attr('cy', height / 2)

            // enable zoom and drag
            d3.select('#prismMap').call(d3.zoom().on("zoom", () => d3.selectAll('g').attr("transform", d3.event.transform)))

            // create hexagonal grids
            const radius = 28
            const xOffset = 54.7
            const yOffset = -28

            const hexGroup1 = svg.append('g')
            const hexGen1 = d3Hexbin.hexbin()
            const points1 = hexGen1.radius([radius]).extent([[0 - width, - (height + 100)], [width * 2 + 30, height * 2 + 20]]).centers()
            hexGroup1.selectAll('path')
                .data(hexGen1(points1))
                .enter()
                .append('path')
                .attr('d', function(d) { return 'M' + (d.x - xOffset) + ',' + (d.y + yOffset) + hexGen1.hexagon() })
                .attr('fill', 'transparent')
                .attr('stroke', '#eee')
                .attr('stroke-width', 2)
                //.attr('opacity', 0.05)

            const hexGroup2 = svg.append('g')
            const hexGen2 = d3Hexbin.hexbin()
            const points2 = hexGen2.radius([radius * 3]).extent([[0 - width, 0 - height], [width * 2, height * 2]]).centers()
            hexGroup2.selectAll('path')
                .data(hexGen2(points2))
                .enter()
                .append('path')
                .attr('d', function(d) { return 'M' + (d.x - xOffset) + ',' + (d.y + yOffset) + hexGen2.hexagon() })
                .attr('fill', 'transparent')
                .attr('stroke', '#eee')
                .attr('stroke-width', 2)
                //.attr('opacity', 0.05)

            function createNode({ x, y, r, fill, opacity, strokeColor, strokeWidth, title, titleFontSize, text, textFontSize }) {
                var node = svg.append('g')
                node.append('circle')
                    .attr('id', 'center-node')
                    .attr('stroke', strokeColor)
                    .attr('fill', fill)
                    .attr('stroke-width', strokeWidth)
                    .attr('r', r)
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('opacity', opacity)

                node.append('text')
                    .text(title)
                    .style('font-size', titleFontSize)
                    .style('font-weight', 800)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('x', x)
                    .attr('y', y - r - 10 - (r / 10))

                node.append('text')
                    .text(text)
                    .style('font-size', textFontSize)
                    .style('font-weight', 800)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('x', x)
                    .attr('y', y)
            }

            // create center node
            createNode({
                x: width / 2,
                y: height / 2,
                r: radius * 3 - 10,
                fill: '#d6eeff',
                opacity: 0.5,
                strokeColor: blue,
                strokeWidth: 3,
                //title: 'Prism focus:',
                titleFontSize: 10,
                text: postData.text,
                textFontSize: 15
            })
            // create outer boundary node
            createNode({
                x: width / 2,
                y: height / 2,
                r: 28 * 3 * 3,
                fill: 'transparent',
                strokeColor: '#bfe4ff',
                strokeWidth: 3
            })
            // create user nodes
            let nodeRadius = 25
            let fill = 'white'
            let opacity = 1
            let strokeWidth = 3
            let titleFontSize = 8
            createNode({
                x: width / 2,
                y: height / 2 - 252,
                r: nodeRadius,
                fill,
                opacity,
                strokeColor: blue,
                strokeWidth,
                title: 'Player 1: ',
                titleFontSize,
                text: prismData.Users[0] ? prismData.Users[0].name : '?',
                textFontSize: prismData.Users[0] ? 10 : 30,
                index: 0
            })
            createNode({
                x: width / 2 - 218,
                y: height / 2 + 126,
                r: nodeRadius,
                fill,
                opacity,
                strokeColor: blue,
                strokeWidth,
                title: 'Player 2: ',
                titleFontSize,
                text: prismData.Users[1] ? prismData.Users[1].name : '?',
                textFontSize: prismData.Users[1] ? 10 : 30,
                index: 1
            })
            createNode({
                x: width / 2 + 218,
                y: height / 2 + 126,
                r: nodeRadius,
                fill,
                opacity,
                strokeColor: blue,
                strokeWidth,
                title: 'Player 3: ',
                titleFontSize,
                text: prismData.Users[2] ? prismData.Users[2].name : '?',
                textFontSize: prismData.Users[2] ? 10 : 30,
                index: 2
            })
        }

        
    }, [prismData, postData])

    return (
        <div id='prismMap'/>
    )
}

export default PrismMap