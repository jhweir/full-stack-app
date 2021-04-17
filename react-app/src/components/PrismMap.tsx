/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import * as d3Hexbin from 'd3-hexbin'
import { IPost } from '../Interfaces'
// import styles from '../styles/components/PrismMap.module.scss'

const PrismMap = (props: { postData: any; prismData: any }): JSX.Element => {
    const { postData, prismData } = props
    // console.log('props: ', props)

    const width = 1200
    const height = 700
    const triangleSide = 55
    const triangleHeight = (triangleSide * Math.sqrt(3)) / 2
    const centerX = width / 2
    const centerY = height / 2
    const xOffset = 21.25
    const yOffset = 4.6

    const colors = [
        '#f7f7f9', // light grey (default)
        '#9583e6', // purple
        '#eb4034', // red
        '#fcba03', // orange
        '#f2dc30', // yellow
        '#3ac75f', // green
        '#57bcff', // blue
    ]
    const [selectedColor, setSelectedColor] = useState(1)

    function handleMouseOver() {
        d3.select(`#${d3.event.target.id}:not(.clicked)`)
            .attr('class', 'mouseover')
            .transition()
            .duration(200)
            .attr('fill', colors[selectedColor])
    }

    function handleMouseClick() {
        d3.select(`#${d3.event.target.id}`)
            .transition()
            .duration(200)
            .attr('fill', colors[selectedColor])
            .attr('class', 'clicked')
    }

    function handleMouseOut() {
        d3.selectAll('.mouseover:not(.clicked)')
            .transition()
            .delay(100)
            .duration(1000)
            .attr('fill', 'transparent')

        d3.selectAll('.mouseover').classed('mouseover', false)
    }

    function createHexagon(
        radius: number,
        xPosition: number,
        yPosition: number,
        fill: string,
        fillOpacity: number,
        stroke: string,
        dashArray: string,
        onClick?: () => void,
        id?: string
    ) {
        const points = [0, 1, 2, 3, 4, 5, 6]
            .map((n, i) => {
                const angle_deg = 60 * i - 30
                const angle_rad = (Math.PI / 180) * angle_deg
                return [
                    width / 2 + radius * Math.cos(angle_rad),
                    height / 2 + radius * Math.sin(angle_rad),
                ]
            })
            .map((p) => p.join(','))
            .join(' ')

        d3.select('#prismSVG')
            .append('g')
            .append('polygon')
            .attr('id', `hex${id || ''}`)
            .attr('points', points)
            .attr('fill', fill)
            .attr('fill-opacity', fillOpacity)
            .attr('stroke', stroke)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', dashArray)
            .attr('transform', () => {
                return `translate(${xPosition},${yPosition})`
            })
            .style('pointer-events', () => (onClick ? 'fill' : 'none'))
            .on('mousedown', onClick)
    }

    function createLine(
        stroke: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number
    ) {
        d3.select('#prismSVG')
            .append('g')
            .attr('class', 'line')
            .append('path')
            .attr('d', `M${startX} ${startY} L${endX} ${endY}`)
            // .attr('points', points)

            .attr('stroke', stroke)
            .attr('stroke-width', 2)
        // .attr('stroke-dasharray', dashArray)
        // .attr('opacity', 0.5)
        // .attr("transform", () => { return `translate(${xPosition},${yPosition})` })
    }

    useEffect(() => {
        console.log('main useeffect run')
        if (prismData.id) {
            const svg = d3
                .select('#prismMap')
                .append('svg')
                .attr('id', 'prismSVG')
                .attr('width', width) // + margin.left + margin.right)
                .attr('height', height)

            // enable zoom and drag
            d3.select('#prismMap').call(
                d3.zoom().on('zoom', () => d3.selectAll('g').attr('transform', d3.event.transform))
            )

            // create triangle grid
            const hexbin = d3Hexbin.hexbin()
            const hexPoints = hexbin
                .radius([triangleSide / 2])
                .extent([
                    [centerX - 1000, centerY - 1000],
                    [centerX + 1000, centerY + 1000],
                ])
                .centers()
            const voronoi = d3.voronoi()

            svg.append('g')
                .attr('class', 'triangles')
                .selectAll('path')
                .data(voronoi.triangles(hexPoints))
                .enter()
                .append('path')
                .attr('id', (d, i) => {
                    return `triangle${i}`
                })
                .attr('fill', 'transparent')
                .attr('stroke-width', 2)
                .attr('stroke', '#eee')
                .attr('d', (d) => {
                    return `M${d}`
                })
                .attr(
                    'transform',
                    `translate(${xOffset},${yOffset}) rotate(90,${centerX},${centerY})`
                )
            // .on('mouseover', handleMouseOver)
            // .on('mouseout', handleMouseOut)
            // .on('mousedown', handleMouseClick)

            const hexColor = '#def2ff'
            // outer hexagon
            createHexagon(triangleHeight * 6, 0, 0, 'white', 0, 'black', '0,0')
            // outer hexagon
            createHexagon(triangleHeight * 5, 0, 0, 'white', 0, '#ccc', '0,0')
            // pre-nucleus hexagon
            createHexagon(
                triangleHeight * 2,
                0,
                0,
                'white',
                0,
                '#aaa',
                `${triangleHeight / 6},${triangleHeight / 6}`
            )
            // center hexagon
            createHexagon(triangleHeight, 0, 0, 'white', 0, 'black', '0,0')
            // top hexagon
            createHexagon(triangleHeight, 0, -triangleHeight * 5, hexColor, 1, 'black', '0,0')
            // top left hexagon
            createHexagon(
                triangleHeight,
                -triangleSide * 3.75,
                -triangleHeight * 2.5,
                hexColor,
                1,
                'black',
                '0,0'
            )
            // bottom left hexagon
            createHexagon(
                triangleHeight,
                -triangleSide * 3.75,
                triangleHeight * 2.5,
                hexColor,
                1,
                'black',
                '0,0'
            )
            // bottom hexagon
            createHexagon(triangleHeight, 0, triangleHeight * 5, hexColor, 1, 'black', '0,0')
            // bottom right hexagon
            createHexagon(
                triangleHeight,
                triangleSide * 3.75,
                triangleHeight * 2.5,
                hexColor,
                1,
                'black',
                '0,0'
            )
            // top right hexagon
            createHexagon(
                triangleHeight,
                triangleSide * 3.75,
                -triangleHeight * 2.5,
                hexColor,
                1,
                'black',
                '0,0'
            )

            // purple hexagon
            createHexagon(
                triangleHeight,
                triangleSide * 9,
                -triangleHeight * 5,
                colors[selectedColor],
                1,
                'black',
                '0,0',
                () => {
                    console.log('selectedColor: ', selectedColor)
                    // if (selectedColor === colors.length - 1) setSelectedColor(0)
                    // else setSelectedColor(selectedColor + 1)
                },
                '-color-key'
            )

            // center to top
            createLine(
                '#ccc',
                centerX,
                centerY - triangleHeight,
                centerX,
                centerY - triangleHeight * 4
            )
            // center to top right
            createLine(
                '#ccc',
                centerX + triangleSide * 0.75,
                centerY - triangleHeight / 2,
                centerX + triangleSide * 3,
                centerY - triangleHeight * 2
            )
            // center to bottom right
            createLine(
                '#ccc',
                centerX + triangleSide * 0.75,
                centerY + triangleHeight / 2,
                centerX + triangleSide * 3,
                centerY + triangleHeight * 2
            )
            // center to bottom
            createLine(
                '#ccc',
                centerX,
                centerY + triangleHeight,
                centerX,
                centerY + triangleHeight * 4
            )
            // center to bottom left
            createLine(
                '#ccc',
                centerX - triangleSide * 0.75,
                centerY + triangleHeight / 2,
                centerX - triangleSide * 3,
                centerY + triangleHeight * 2
            )
            // center to top left
            createLine(
                '#ccc',
                centerX - triangleSide * 0.75,
                centerY - triangleHeight / 2,
                centerX - triangleSide * 3,
                centerY - triangleHeight * 2
            )

            // function createNode({
            //     x,
            //     y,
            //     r,
            //     fill,
            //     opacity,
            //     strokeColor,
            //     strokeWidth,
            //     title,
            //     titleFontSize,
            //     text,
            //     textFontSize,
            // }: {
            //     x: number
            //     y: number
            //     r: number
            //     fill: string
            //     opacity: number
            //     strokeColor: string
            //     strokeWidth: number
            //     title: string
            //     titleFontSize: number
            //     text: string
            //     textFontSize: number
            // }) {
            //     const node = svg.append('g')
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
            //         .attr('y', y - r - 10 - r / 10)

            //     node.append('text')
            //         .text(text)
            //         .style('font-size', textFontSize)
            //         .style('font-weight', 800)
            //         .attr('text-anchor', 'middle')
            //         .attr('dominant-baseline', 'central')
            //         .attr('x', x)
            //         .attr('y', y)
            // }
        }
        // return function cleanup() {
        //     d3.select('#prismMap').selectAll("*").remove()
        // }
    }, [prismData, postData])

    useEffect(() => {
        console.log('first useffect')
        // add space bar listener
        d3.select('body').on('keypress', () => {
            if (d3.event.keyCode === 32 || d3.event.keyCode === 13) {
                if (selectedColor === colors.length - 1) setSelectedColor(0)
                else setSelectedColor(selectedColor + 1)
            }
        })
        // add mouse listeners
        d3.selectAll('.triangles')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('mousedown', handleMouseClick)
        // set hex colour key colour
        d3.select('#hex-color-key').attr('fill', colors[selectedColor])
    }, [prismData, selectedColor])

    return <div id='prismMap' />
}

export default PrismMap

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
