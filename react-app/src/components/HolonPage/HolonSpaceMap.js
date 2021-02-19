import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/HolonSpaceMap.module.scss'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'
import { useHistory } from "react-router-dom"
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';

function HolonSpaceMap() {
    const { holonData, setHolonHandle, holonContextLoading, holonSpaces, holonPostSortByFilter } = useContext(HolonContext)
    const [spaceMapData, setSpaceMapData] = useState()

    const history = useHistory()

    const width = 700
    const height = 700
    const circleRadius = 25
    const maxTextLength = 14
    const xOffset = 0
    const yOffset = 80

    function getSpaceMapData() {
        axios.get(config.apiURL + `/space-map-data?spaceId=${holonData.id}`)
            .then(res => setSpaceMapData(res.data))
    }

    function findParent(tree, itemId){
        if (tree.id === itemId) {
            return tree
        } else if (tree.children) {
            for (let i = 0; i < tree.children.length; i++) {
                let match = findParent(tree.children[i], itemId)
                if (match) return match
            }
        }
    }

    function getChildren(node) {
        axios.get(config.apiURL + `/space-map-next-children?spaceId=${node.data.id}&offset=${node.children.length - 1}`)
            .then(res => {
                const match = findParent(spaceMapData, node.data.id)
                match.children = match.children.filter(child => !child.isExpander)
                match.children.push(...res.data)
                updateTree(spaceMapData)
            })
    }

    function resetTreePosition() {
        d3.select('svg')
            .transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity)
    }

    function collapseChildren(d) {
        if(d.children) {
            d._children = d.children
            d._children.forEach(collapseChildren)
            d.children = null
        }
    }

    const zoom = d3.zoom().on("zoom", () => d3
        .select('#master-group')
        .attr("transform", d3.event.transform))

    function createCanvas() {
        d3.select('#canvas')
            .append('svg')
            .attr('width', width) //+ margin.left + margin.right)
            .attr('height', height)

        d3.select('svg')
            .append('defs')
            .attr('id', 'imgdefs')

        d3.select('svg')
            .append('g')
            .attr('id', 'master-group')

        d3.select('#master-group')
            .append('g')
            .attr('id', 'link-group')
            .attr('transform', 'translate(' + (xOffset + (width / 2)) + ',' + yOffset + ')')

        d3.select('#master-group')
            .append('g')
            .attr('id', 'node-group')
            .attr('transform', 'translate(' + (xOffset + (width / 2)) + ',' + yOffset + ')')
      
        d3.select('svg')
            .call(zoom)
    }

    function updateTree(data) {
        const root = d3.hierarchy(data, d => { return d.children })
        const tree = d3.tree()
            .nodeSize([50, 200])
            .separation(() => { return 2 }) // ((a, b) => { return a.parent == b.parent ? 2 : 1 })

        tree(root).links()
        const links = root.descendants().slice(1)
        const nodes = root.descendants()

        // create links
        d3.select('#link-group')
            .selectAll('.link')
            .data(links, d => d.data.id)
            .join(
                enter => enter
                    .append('path')
                    .classed('link', true)
                    .attr('stroke', 'black')
                    .attr('fill', 'none')
                    .attr('opacity', 0)
                    .attr("d", function(d) {
                        return "M" + d.x + "," + d.y
                        + "C" + d.x + "," + (d.y + d.parent.y) / 2
                        + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                        + " " + d.parent.x + "," + d.parent.y
                    })
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 0.2)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                        .attr("d", function(d) {
                            return "M" + d.x + "," + d.y
                            + "C" + d.x + "," + (d.y + d.parent.y) / 2
                            + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                            + " " + d.parent.x + "," + d.parent.y
                        }),
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        // .attr("d", function(d) {
                        //     console.log('d: ', d)
                        //     return "M" + d.x + "," + d.y
                        //     + "C" + d.x + "," + (d.y + d.parent.y) / 2
                        //     + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                        //     + " " + d.parent.x + "," + d.parent.y;
                        // })
                        .remove()
                    )
            );
        
        // create background circle
        d3.select('#node-group')
            .selectAll('.background-circle')
            .data(nodes, d => d.data.id)
            .join(
                enter => enter
                    .append('circle')
                    .classed('background-circle', true)
                    .attr('id', d => `circle-${d.data.id}`)
                    .attr('opacity', 0)
                    .attr('r', circleRadius + 2)
                    .attr('fill', '#aaa')
                    .attr('stroke-width', 3)
                    .attr('opacity', 0)
                    .attr('transform', d => { return 'translate(' + d.x + ',' + d.y + ')' })
                    .on('mouseover', d => {
                        d3.select(`#circle-${d.data.id}`)
                            .style('cursor', 'pointer')
                            .transition()
                            .duration(200)
                            .attr('fill', '#8ad1ff')
                            .attr('r', circleRadius + 6)
                    })
                    .on('mouseout', (d, i) => {
                        d3.select(`#circle-${d.data.id}`)
                            .transition()
                            .duration(500)
                            .attr('fill', '#aaa')
                            .attr('r', circleRadius + 2)
                    })
                    .on('mousedown', (d) => {
                        if (d.data.isExpander) {
                            getChildren(d.parent, spaceMapData)
                        } else {
                            history.push(`/s/${d.data.handle}/spaces`)
                            setHolonHandle(d.data.handle)
                        }
                    })
                    .call(enter => enter
                        .transition('enter')
                        .duration(1000)
                        .attr('opacity', 1)
                    ),
                update => update
                    .call(update => update
                        .transition('update')
                        .duration(1000)
                        .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                    ),
                exit => exit
                    .call(exit => exit
                        .transition('exit')
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    )
                )

        // create image background for png images
        d3.select('#node-group')
            .selectAll('.image-background-circle')
            .data(nodes, d => d.data.id)
            .join(
                enter => enter
                    .append('circle')
                    .classed('image-background-circle', true)
                    .attr('opacity', 0)
                    .attr('r', circleRadius)
                    .attr('pointer-events', 'none')
                    .style('fill', 'white')
                    .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 1)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                        .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' }),
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    )
                )

        // create image circle
        d3.select('#node-group')
            .selectAll('.image-circle')
            .data(nodes, d => d.data.id)
            .join(
                enter => enter
                    .append('circle')
                    .classed('image-circle', true)
                    .attr('opacity', 0)
                    .attr('r', circleRadius)
                    .attr('pointer-events', 'none')
                    .style('fill', (d) => {
                        let imagePath
                        if (d.data.flagImagePath) {
                            imagePath = d.data.flagImagePath
                        } else {
                            imagePath = '/icons/default-space-flag.jpg'
                        }
                        if (d.data.isExpander) {
                            imagePath = '/icons/plus-icon.jpg'
                        }
                        d3.select('defs').append('pattern')
                            .attr('id', `image-${d.data.id}`)
                            .attr('height', 1)
                            .attr('width', 1)
                            .attr('x', '0')
                            .attr('y', '0')
                            .append('image')
                            .attr('preserveAspectRatio', "xMidYMid slice")
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('height', circleRadius * 2)
                            .attr('width', circleRadius * 2)
                            //.attr('width', 30)
                            .attr("xlink:href", imagePath)

                        return `url(#image-${d.data.id})`
                    })
                    .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 1)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                        .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' }),
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    )
                )
        
        // create node text
        d3.select('#node-group')
            .selectAll('.node-text')
            .data(nodes, d => d.data.id)
            .join(
                enter => enter
                    .append('text')
                    .classed('node-text', true)
                    .text((d) => {
                        var croppedText = d.data.name.length > maxTextLength ? d.data.name.substring(0, maxTextLength - 3) + "..." : d.data.name
                        return croppedText
                    })
                    .attr('font-size', 12)
                    .attr('opacity', 0)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('y', -40)
                    .attr('x', 0)
                    .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                    .call(enter => enter
                        .transition()
                        .duration(1000)
                        .attr('opacity', 1)
                    ),
                update => update
                    .call(update => update
                        .transition()
                        .duration(1000)
                        .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                    ),
                exit => exit
                    .call(exit => exit
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    )
                )
    }

    useEffect(() => {
        getSpaceMapData()
        createCanvas()
        resetTreePosition()
    },[holonData.id])


    useEffect(() => {
        if (spaceMapData) updateTree(spaceMapData)
    }, [spaceMapData])

    return (
        <div id='canvas'/>
    )
}

export default HolonSpaceMap
