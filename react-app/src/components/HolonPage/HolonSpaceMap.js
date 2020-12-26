import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/HolonSpaceMap.module.scss'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'
import { useHistory } from "react-router-dom"

function HolonSpaceMap() {
    const { holonData, setHolonHandle, holonContextLoading, holonSpaces, holonPostSortByFilter } = useContext(HolonContext)
    const [spaceMapData, setSpaceMapData] = useState()

    const history = useHistory()

    // console.log('holonSpaces: ', holonSpaces)

    const width = 700
    const height = 700

    function getSpaceMapData() {
        axios.get(config.apiURL + `/space-map-data?spaceId=${holonData.id}`)
            .then(res => setSpaceMapData(res.data))
    }

    const data = {
        name: 'all',
        children: [
            {
                name: 'science',
                children: [
                    {
                        name: 'biology',
                        //children: []
                    },
                    {
                        name: 'physics',
                        //children: []
                    },
                    {
                        name: 'chemistry',
                        //children: []
                    }
                ]
            },
            {
                name: 'art',
                children: [
                    {
                        name: 'painting',
                        //children: []
                    },
                    {
                        name: 'drawing',
                        //children: []
                    }
                ]
            },
            {
                name: 'technology',
                //children: []
            }
        ]
    }

    useEffect(() => {
        getSpaceMapData()
    },[holonData.id])

    useEffect(() => {
        if (spaceMapData) {
            console.log('spaceMapData: ', spaceMapData)
            let xOffset = 0
            let yOffset = 50

            // create svg and main group
            d3.select('#holonSpaceMap')
                .append('svg')
                .attr('id', 'spaceMapSVG')
                .attr('width', width) //+ margin.left + margin.right)
                .attr('height', height)
                .append('g')
                .attr('id', 'master-group')
                //.attr('transform', 'translate(' + (xOffset + (width / 2)) + ',' + yOffset + ')')

            // create link group
            d3.select('#master-group')
                .append('g')
                .attr('id', 'main-group')
                .attr('transform', 'translate(' + (xOffset + (width / 2)) + ',' + yOffset + ')')

            // create link group
            d3.select('#main-group')
                .append('g')
                .attr('id', 'link-group')
                .attr('opacity', 0.2)
                .attr('transform', 'translate(' + xOffset + ',' + yOffset + ')')

            // create node group
            d3.select('#main-group')
                .append('g')
                .attr('id', 'node-group')
                .attr('transform', 'translate(' + xOffset + ',' + yOffset + ')')

            // let treeWidth = 900
            // let treeHeight = 500
            //let height = treemap.nodeSize()[1] * nodes.length; 
            let root = d3.hierarchy(spaceMapData, (d) => { return d.DirectChildHolons })

            function countGrandChildren(node) {
                let childrenAtCurrentDepth = 0
                node.children && node.children.forEach(child => {
                    if (child.children) {
                        childrenAtCurrentDepth = childrenAtCurrentDepth + child.children.length
                    }
                })
                return childrenAtCurrentDepth
            }

            var totalNodes = 0
            function countNodes(node){
                if(node.children) {
                    //console.log(node.children)
                    //go through all its children
                    for(var i = 0; i<node.children.length; i++){
                        //if the current child in the for loop has children of its own
                        //call recurse again on it to decend the whole tree
                        if (node.children[i].children){
                            countNodes(node.children[i])
                            totalNodes++
                        }
                        //if not then it is a leaf so we count it
                        else{
                            totalNodes++
                        }
                    }
                }
            }

            countNodes(root)

            console.log('gc: ', countGrandChildren(root))
            //let maxWidth = countGrandChildren(root) > (root.children ? root.children.length : 0) ? countGrandChildren(root) : (root.children ? root.children.length : 0)
            //let maxWidth = totalNodes > 6 ? 

            let treeHeight = height / 4 * root.height
            let treeWidth = width / 7 * totalNodes

            let tree = d3.tree()
                //.size([width, treeHeight])
                .nodeSize([50, 200])
                .separation((a, b) => { return a.parent == b.parent ? 2 : 2 })
            
            tree(root).links()
            // console.log('tree: ', tree)
            console.log('root: ', root)



            let childrenAtEachDepth = []
            
            // function countChildren(node) {
            //     childrenAtCurrentDepth = childrenAtCurrentDepth + node.children.length
            // }
            //d3.select('#main-group').attr('transform', () => { return 'translate(' + width / 2 + ',' + 0 + ')' })

            // countNodes(root)
            // countGrandChildren(root)

            console.log('totalNodes: ', totalNodes)
            console.log('childrenAtEachDepth: ', childrenAtEachDepth)

            let defs = d3.select('svg').append('defs').attr('id', 'imgdefs')

            let nodes = d3.select('#node-group')
                .selectAll('.node')
                .data(root.descendants())
                .enter()
                .append('g')
                .attr('id', (d, i) => `node-${i}`)
                .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })
                // .on('mousedown', (d) => {
                //     history.push(`/s/${d.data.handle}`)
                //     setHolonHandle(d.data.handle)
                // })

            let circleRadius = 25
            // create background circle
            nodes.append('circle')
                .attr('id', (d, i) => `circle-${i}`)
                .attr('r', circleRadius + 2)
                .attr('fill', '#aaa')
                .on('mouseover', (d, i) => {
                    //d3.select(this).style("cursor", "pointer");
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
                    history.push(`/s/${d.data.handle}/spaces`)
                    setHolonHandle(d.data.handle)
                })
            // create image circle
            nodes.append('circle')
                .attr('r', circleRadius)
                .attr('pointer-events', 'none')
                .style('fill', (d) => {
                    if (d.data.flagImagePath !== null) {
                        defs.append('pattern')
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
                            .attr("xlink:href", d.data.flagImagePath)
    
                        return `url(#image-${d.data.id})`
                    } else { return '#ddd' }
                })

            nodes.append('text')
                .text((d) => { return d.data.name })
                .attr('font-size', 12)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('y', -40)
                .attr('x', 0)

            d3.select('#link-group')
                .selectAll('.link')
                .data(root.descendants().slice(1))
                .enter()
                .append('path')
                .attr("class", "link")
                .attr('stroke', 'black')
                .attr('fill', 'none')
                .attr("d", function(d) {
                    return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
                    });

            // enable zoom and drag
            d3.select('#spaceMapSVG').call(d3.zoom().on("zoom", () => d3.select('#master-group').attr("transform", d3.event.transform)))
        }

        return () => { d3.select('#holonSpaceMap').selectAll('*').remove() }
    }, [spaceMapData])

    return (
        <div id='holonSpaceMap'/>
    )
}

export default HolonSpaceMap
