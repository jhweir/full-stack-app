import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/HolonSpaceMap.module.scss'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'
import { useHistory } from "react-router-dom"
import _ from 'lodash'

function HolonSpaceMap() {
    const { holonData, setHolonHandle, holonContextLoading, holonSpaces, holonPostSortByFilter } = useContext(HolonContext)
    const [spaceMapData, setSpaceMapData] = useState()

    const history = useHistory()

    const width = 700
    const height = 700
    const circleRadius = 25
    const maxTextLength = 14

    const tree = d3.tree()
        //.size([width, treeHeight])
        .nodeSize([50, 200])
        .separation((a, b) => { return a.parent == b.parent ? 2 : 2 })


    function getSpaceMapData() {
        axios.get(config.apiURL + `/space-map-data?spaceId=${holonData.id}`)
            .then(res => {
                setSpaceMapData(res.data)
                console.log('spaceMapData: ', res.data)
            })
    }

    // function findParent(object, id){
    //     console.log('object: ', object)
    //     if(object["id"] ==  id)
    //         return object;
    
    //     for(var i=0; i<Object.keys(object).length; i++){
    //         if(typeof object[Object.keys(object)[i]] == "object"){
    //             var o = findParent(object[Object.keys(object)[i]]);
    //             if(o != null)
    //                 return o;
    //         }
    //     }
    
    //     return null;
    // }

    function getChildren(d) {
        // todo: rewrite recursive function, searching 'children' property
        function findParent(object, id){
            if(object.hasOwnProperty('id') && object["id"] ==  d.parent.data.id)
                return object;
        
            for(var i=0; i<Object.keys(object).length; i++){
                if(typeof object[Object.keys(object)[i]] == "object"){
                    var o = findParent(object[Object.keys(object)[i]]);
                    if(o != null)
                        return o;
                }
            }
        
            return null;
        }
        const spaceMapDataClone = _.cloneDeep(spaceMapData)
        console.log('spaceMapDataClone1: ', spaceMapDataClone)
        const parent = findParent(spaceMapDataClone, d.parent.data.id)
        //console.log('d: ', d)
        axios.get(config.apiURL + `/space-map-next-children?spaceId=${d.parent.data.id}&offset=${d.parent.children.length - 1}`)
            .then(res => {
                //setSpaceMapData(res.data)
    
                console.log('parent: ', parent)
                parent.children = parent.children.filter(child => !child.isExpander)
                parent.children.push(...res.data)
                console.log('spaceMapDataClone2: ', spaceMapDataClone)
                // const firstGenParent = spaceMapDataClone.children.find(child => child.id === d.parent.data.id)
                // if (firstGenParent) {
                //     firstGenParent.children = firstGenParent.children.filter(child => !child.isExpander)
                //     firstGenParent.children.push(...res.data)
                // }
                // //console.log('spaceMapDataClone: ', spaceMapDataClone)
                setSpaceMapData(spaceMapDataClone)
            })
    }

    function createCanvas() {
        let xOffset = 0
        let yOffset = 50

        d3.select('#canvas')
            .append('svg')
            .attr('id', 'spaceMapSVG')
            .attr('width', width) //+ margin.left + margin.right)
            .attr('height', height)
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
            .append('defs')
            .attr('id', 'imgdefs')

        d3.select('#spaceMapSVG')
            .call(d3.zoom().on("zoom", () => d3
                .select('#master-group')
                .attr("transform", d3.event.transform)
            ))
    }

    function updateTree(data) {
        const root = d3.hierarchy(data, d => {
            return d.children
        })
        tree(root).links()

        // create links
        d3.select('#link-group')
            .selectAll('.link')
            .data(root.descendants().slice(1), d => d.data.id)
            .join(
                enter => enter
                    .append('path')
                    .attr("class", "link")
                    .attr('stroke', 'black')
                    .attr('fill', 'none')
                    .attr('opacity', 0)
                    .attr("d", function(d) {
                        return "M" + d.x + "," + d.y
                        + "C" + d.x + "," + (d.y + d.parent.y) / 2
                        + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                        + " " + d.parent.x + "," + d.parent.y;
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
                            + " " + d.parent.x + "," + d.parent.y;
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
            .data(root.descendants(), d => d.data.id)
            .join(
                enter => enter
                    .append('circle')
                    .attr('class', 'background-circle')
                    .attr('id', (d, i) => `circle-${i}`)
                    .attr('opacity', 0)
                    .attr('r', circleRadius + 2)
                    .attr('fill', '#aaa')
                    .attr('opacity', 0)
                    .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                    .on('mouseover', (d, i) => {
                        d3.select(`#circle-${i}`)
                        .style("cursor", "pointer")
                            .transition()
                            .duration(200)
                            .attr('fill', '#8ad1ff') //blue
                            .attr('r', circleRadius + 6)
                    })
                    .on('mouseout', (d, i) => {
                        d3.select(`#circle-${i}`)
                            .transition()
                            .duration(600)
                            .attr('fill', '#888') //blue
                            .attr('r', circleRadius + 2)
                    })
                    .on('mousedown', (d) => {
                        if (d.data.isExpander) {
                            getChildren(d)
                        } else {
                            history.push(`/s/${d.data.handle}/spaces`)
                            setHolonHandle(d.data.handle)
                        }
                    })
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
            .data(root.descendants(), d => d.data.id)
            .join(
                enter => enter
                    .append('circle')
                    .attr('class', 'image-circle')
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
                        //} else { return '#ddd' }
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
            .data(root.descendants(), d => d.data.id)
            .join(
                enter => enter
                    .append('text')
                    .attr('class', 'node-text')
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
    }

    useEffect(() => {
        getSpaceMapData()
        createCanvas()
    },[holonData.id])


    useEffect(() => {
        if (spaceMapData) {
            updateTree(spaceMapData)
        }
    }, [spaceMapData])

    return (
        <div id='canvas'/>
    )
}

export default HolonSpaceMap
