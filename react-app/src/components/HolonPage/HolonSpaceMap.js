import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/HolonSpaceMap.module.scss'
import * as d3 from 'd3'
import { HolonContext } from '../../contexts/HolonContext'

function HolonSpaceMap() {
    const { holonData, holonContextLoading, holonSpaces, holonPostSortByFilter } = useContext(HolonContext)
    const [spaceMapData, setSpaceMapData] = useState()

    // console.log('holonSpaces: ', holonSpaces)

    const width = 700
    const height = 700

    function getSpaceMapData() {
        axios.get(config.environmentURL + `/space-map-data?spaceId=${holonData.id}`)
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
            let treeWidth = 500
            let treeHeight = 300
            let xOffset = width / 2 - (treeWidth / 2)
            let yOffset = 100

            // create svg and main group
            d3.select('#holonSpaceMap')
                .append('svg')
                .attr('id', '#spaceMapSVG')
                .attr('width', width) //+ margin.left + margin.right)
                .attr('height', height)
                .append('g')
                .attr('id', 'main-group')

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

            let tree = d3.tree().size([treeWidth, treeHeight])//.separation((a, b) => { return a.parent == b.parent ? 2 : 2 })
            let root = d3.hierarchy(spaceMapData, (d) => { return d.DirectChildHolons })
            tree(root).links()

            let defs = d3.select('svg').append('defs').attr('id', 'imgdefs')

            let nodes = d3.select('#node-group')
                .selectAll('.node')
                .data(root.descendants())
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')' })

            nodes.append('circle')
                .attr('r', 15)
                //.attr('fill', '#57bcff')
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
                            .attr('height', 30)
                            .attr('width', 30)
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
                .attr('y', -30)
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
            d3.select('#spaceMapSVG').call(d3.zoom().on("zoom", () => d3.select('#main-group').attr("transform", d3.event.transform)))
        }

        return () => { d3.select('#holonSpaceMap').selectAll('*').remove() }
    }, [spaceMapData])

    return (
        <div id='holonSpaceMap'/>
    )
}

export default HolonSpaceMap
