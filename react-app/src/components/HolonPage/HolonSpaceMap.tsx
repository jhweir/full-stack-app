/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import { useHistory } from 'react-router-dom'
import config from '@src/Config'
// import styles from '../../styles/components/HolonSpaceMap.module.scss'
import { SpaceContext } from '@contexts/SpaceContext'
import { ISpaceMapData } from '@src/Interfaces'

const HolonSpaceMap = (): JSX.Element => {
    const {
        spaceData,
        // setSpaceHandle,
        // fullScreen,
        spaceSpacesFilters,
        updateSpaceSpacesFilter,
        // spaceSpacesTypeFilter,
        // spaceSpacesSortByFilter,
        // spaceSpacesSortOrderFilter,
        // spaceSpacesTimeRangeFilter,
        // spaceSpacesDepthFilter,
        // setSpaceSpacesDepthFilter,
        // spaceSpacesSearchFilter,
        // setSpaceSpacesSearchFilter,
    } = useContext(SpaceContext)

    const { type, sortBy, sortOrder, timeRange, depth, searchQuery } = spaceSpacesFilters
    // console.log('spaceSpacesFilters: ', spaceSpacesFilters)

    const [spaceMapData, setSpaceMapData] = useState<Partial<ISpaceMapData>>({})
    // const [width, setWidth] = useState<number | string>(700)
    const [firstRun, setFirstRun] = useState<boolean>(true)
    // const [spaceTransitioning, setSpaceTransitioning] = useState<boolean>(true)
    const spaceTransitioning = useRef<boolean>(false)

    const history = useHistory()

    // const width = '100%'
    // const height = '100%'
    const circleRadius = 25
    const maxTextLength = 14
    // const xOffset = 0
    // const yOffset = 180
    const duration = 1000

    const getSpaceMapData = (): void => {
        console.log('HolonSpaceMap: getSpaceMapData 1')
        // console.log('searchQuery: ', searchQuery)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/space-map-data?spaceId=${spaceData.id
                }&offset=${0
                }&spaceType=${type
                }&sortBy=${sortBy
                }&sortOrder=${sortOrder
                }&timeRange=${timeRange
                }&depth=${depth
                }&searchQuery=${searchQuery}`
            )
            .then((res) => {
                // if res.data.id
                updateTree(res.data, true)
                // setSpaceMapData(res.data)
                // console.log('res.data: ', res.data)
            })
    }

    const findParent = (tree: any, itemId: string): any => {
        if (tree.uuid === itemId) {
            return tree
        }
        if (tree.children) {
            for (let i = 0; i < tree.children.length; i += 1) {
                const match = findParent(tree.children[i], itemId)
                if (match) return match
            }
        }
        return null
    }

    function toggleChildren(d) {
        if (d.children) {
            d.hiddenChildren = d.children
            d.children = null
        } else {
            d.children = d.hiddenChildren
            d.hiddenChildren = null
        }
    }

    function findRadius(d) {
        if (d.data.id === spaceData.id) return circleRadius * 2
        return circleRadius
    }

    function isRoot(d) {
        return d.data.id === spaceData.id
    }

    function findFill(d) {
        const existingImage = d3.select(`#image-${d.data.id}`)
        if (existingImage.node()) {
            // scale and reposition existing image (if no imageCircle, transition size instantly)
            const existingImageCircle = d3.select(`#image-circle-${d.data.id}`).node()
            existingImage
                .transition()
                .duration(existingImageCircle ? duration : 0)
                .attr('height', findRadius(d) * 2)
                .attr('width', findRadius(d) * 2)
        } else {
            // create new pattern
            const pattern = d3
                .select('defs')
                .append('pattern')
                .attr('id', `pattern-${d.data.id}`)
                .attr('height', 1)
                .attr('width', 1)
            // append new image to pattern
            pattern
                .append('image')
                .attr('id', `image-${d.data.id}`)
                .attr('height', findRadius(d) * 2)
                .attr('width', findRadius(d) * 2)
                .attr('preserveAspectRatio', 'xMidYMid slice')
                .attr(
                    'xlink:href',
                    d.data.isExpander
                        ? '/icons/plus-icon.jpg'
                        : d.data.flagImagePath || '/icons/default-space-flag.jpg'
                )
            // .on('error', () => {
            //     const newImage = d3.select(`#image-${d.id}`)
            //     // try image proxy
            //     if (!newImage.attr('xlink:href').includes('//images.weserv.nl/')) {
            //         newImage.attr('xlink:href', `//images.weserv.nl/?url=${d.urlImage}`)
            //     } else {
            //         // fall back on placeholder
            //         newImage.attr('xlink:href', '/images/placeholders/broken-image-left.jpg')
            //     }
            // })
        }
        return `url(#pattern-${d.data.id})`
    }

    const zoom = d3
        .zoom()
        .on('zoom', () =>
            d3.select('#space-map-master-group').attr('transform', d3.event.transform)
        )

    function resetTreePosition() {
        console.log('resetTreePosition')
        const svg = d3.select('#space-map-svg')
        const svgWidth = parseInt(svg.style('width'), 10)
        const svgHeight = parseInt(svg.style('height'), 10)
        const yOffset = spaceData.DirectParentHolons!.length ? 180 : 80
        // d3.select('#post-map-svg')
        //     .transition()
        //     .duration(2000)
        //     .call(
        //         zoom.transform,
        //         d3.zoomIdentity.scale(scale).translate(svgWidth / scale / 2, height / scale / 2)
        // )
        // // reset tree position
        svg.transition()
            .duration(duration)
            .call(zoom.transform, d3.zoomIdentity.scale(1).translate(svgWidth / 2, yOffset))

        // // when transition complete, calculate new scale and adjust zoom to fit tree in canvas
        // setTimeout(() => {
        //     // const svg = d3.select('#space-map-svg')
        //     // const svgWidth = parseInt(svg.style('width'), 10)
        //     // const svgHeight = parseInt(svg.style('height'), 10)
        //     const treeBBox = d3.select('#space-map-master-group').node().getBBox()
        //     // console.log('svg width: ', svgWidth)
        //     // console.log('svg height: ', svgHeight)
        //     // console.log('treeBBox: ', treeBBox)
        //     // if tree width or height greater than svg width or height sclae
        //     // if both tree width and tree height greater than svg pick the one that has more difference
        //     const widthRatio = svgWidth / treeBBox.width
        //     const heightRatio = svgHeight / treeBBox.height
        //     // console.log('widthRatio: ', widthRatio)
        //     // console.log('heightRatio: ', heightRatio)
        //     // console.log('spacedata: ', spaceData)
        //     const yOffset = spaceData.DirectParentHolons.length ? 180 : 80
        //     // if (widthRatio < 1 || heightRatio < 1) {
        //     if (widthRatio < heightRatio) {
        //         // console.log('scale to width')
        //         const ratioOffset = 0.1 // widthRatio < 1 ? 0.1 : 0.3
        //         const xOffset = svgWidth / 2 / (widthRatio - ratioOffset)
        //         d3.select('#space-map-svg')
        //             .transition()
        //             .duration(duration)
        //             .call(
        //                 zoom.transform,
        //                 d3.zoomIdentity.scale(widthRatio - ratioOffset).translate(xOffset, yOffset)
        //             )
        //     } else {
        //         // console.log('scale to height')
        //         const ratioOffset = 0.1 // heightRatio < 1 ? 0.1 : 0.3
        //         const xOffset = svgWidth / 2 / (heightRatio - ratioOffset)
        //         d3.select('#space-map-svg')
        //             .transition()
        //             .duration(duration)
        //             .call(
        //                 zoom.transform,
        //                 d3.zoomIdentity.scale(heightRatio - ratioOffset).translate(xOffset, yOffset)
        //             )
        //     }
        // }, duration + 500)
    }

    function createCanvas() {
        const width = '100%'
        const height = window.innerHeight - 300
        const yOffset = spaceData.DirectParentHolons.length ? 180 : 80
        const svg = d3
            .select('#canvas')
            .append('svg')
            .attr('id', 'space-map-svg')
            .attr('width', width)
            .attr('height', height)
        // .attr('transform', () => {
        //     const newWidth = parseInt(d3.select('#space-map-svg').style('width'), 10)
        //     return `translate(${newWidth / 2},${yOffset})`
        // })

        const newWidth = parseInt(svg.style('width'), 10)

        svg.append('defs').attr('id', 'imgdefs')
        const masterGroup = svg.append('g').attr('id', 'space-map-master-group')

        masterGroup.append('g').attr('id', 'link-group')
        masterGroup
            .append('g')
            .attr('id', 'parent-link-group')
            .attr('transform', `translate(0,0),rotate(180,0,0)`)
        masterGroup
            .append('g')
            .attr('id', 'parent-node-group')
            .attr('transform', `translate(0,0),rotate(180,0,0)`)
        masterGroup.append('g').attr('id', 'node-group')

        svg.call(zoom)
        svg.call(zoom.transform, d3.zoomIdentity.translate(newWidth / 2, yOffset))
    }

    // function updateCanvasSize() {
    //     d3.select('#canvas').style('width', width)
    //     d3.select('#space-map-svg').attr('width', width)

    //     // const offset = spaceData.id
    //     // console.log(spaceData)

    //     // const newWidth = parseInt(d3.select('#space-map-svg').style('width'), 10)
    //     // const transform = `translate(${newWidth / 2},${yOffset})`
    //     // const parentTransform = `translate(${newWidth / 2},${yOffset}),rotate(180,0,0)`
    //     const transform = `translate(0,0)`
    //     const parentTransform = `translate(0,0),rotate(180,0,0)`

    //     d3.select('#link-group').attr('transform', transform)
    //     d3.select('#node-group').attr('transform', transform)
    //     d3.select('#parent-link-group').attr('transform', parentTransform)
    //     d3.select('#parent-node-group').attr('transform', parentTransform)
    // }

    function interruptRunningTransitions(data) {
        d3.selectAll('.background-circle').each((d) => {
            if (!findParent(data, d.data.id)) {
                d3.select(`#background-circle-${d.data.id}`).interrupt('background-circle-enter')
            }
        })
        d3.selectAll('.image-background-circle').each((d) => {
            if (!findParent(data, d.data.id)) {
                d3.select(`#image-background-circle-${d.data.id}`).interrupt(
                    'image-background-circle-enter'
                )
            }
        })
        d3.selectAll('.image-circle').each((d) => {
            if (!findParent(data, d.data.id)) {
                d3.select(`#image-circle-${d.data.id}`).interrupt('image-circle-enter')
            }
        })
        d3.selectAll('.node-text').each((d) => {
            if (!findParent(data, d.data.id)) {
                d3.select(`#node-text-${d.data.id}`).interrupt('node-text-enter')
            }
        })
    }

    function updateTree(data, resetPosition) {
        console.log('updateTree')

        if (resetPosition) resetTreePosition()

        setTimeout(() => {
            d3.selectAll('.background-circle').classed('transitioning', false)
            spaceTransitioning.current = false
        }, duration + 100)

        // create parent tree
        const parents = d3.hierarchy(data, (d) => {
            return d.DirectParentHolons
        })
        const parentTree = d3
            .tree()
            .nodeSize([50, 130])
            .separation(() => {
                return 2 // ((a, b) => { return a.parent == b.parent ? 2 : 1 })
            })
        parentTree(parents).links()
        const parentLinks = parents.descendants().slice(1)
        const parentNodes = parents.descendants().slice(1)

        // create main tree
        const root = d3.hierarchy(data, (d) => {
            return d.children
        })
        const tree = d3
            .tree()
            .nodeSize([50, 200])
            .separation(() => {
                return 2 // ((a, b) => { return a.parent == b.parent ? 2 : 1 })
            })

        tree(root).links()
        const links = root.descendants().slice(1)
        const nodes = root.descendants()

        interruptRunningTransitions(data)

        // move out of update tree function ?
        function getChildren(node) {
            console.log('HolonSpaceMap: getSpaceMapData 2')
            axios
                .get(
                    /* prettier-ignore */
                    `${config.apiURL}/space-map-data?spaceId=${node.data.id
                    }&offset=${node.children.length - 1
                    }&spaceType=${type
                    }&sortBy=${sortBy
                    }&sortOrder=${sortOrder
                    }&timeRange=${timeRange
                    }&depth=${depth
                    }&searchQuery=${searchQuery}`
                )
                .then((res) => {
                    // console.log(res)
                    const match = findParent(data, node.data.uuid)
                    match.children = match.children.filter((child) => !child.isExpander)
                    match.children.push(...res.data)
                    // setSpaceMapData(_.cloneDeep(spaceMapData))
                    updateTree(data, false)
                })
        }

        function findTransitonId(d) {
            // space id used during space transitions (allows duplicates)
            if (spaceTransitioning.current) return d.data.id
            // unique id used when expanding spaces (no duplicates)
            return d.data.uuid
        }

        // const newWidth = parseInt(d3.select('#space-map-svg').style('width'), 10)
        // const transform = `translate(${newWidth / 2},${
        //     data.DirectParentHolons.length ? yOffset : 80
        // })`

        // d3.select('#link-group').transition().duration(duration).attr('transform', transform)
        // d3.select('#node-group').transition().duration(duration).attr('transform', transform)

        // const parentTransform = `translate(${newWidth / 2},${
        //     data.DirectParentHolons.length ? yOffset : 80
        // }),rotate(180,0,0)`

        // d3.select('#parent-link-group')
        //     .transition()
        //     .duration(duration)
        //     .attr('transform', parentTransform)
        // d3.select('#parent-node-group')
        //     .transition()
        //     .duration(duration)
        //     .attr('transform', parentTransform)

        function createLinks(linkGroup, linkData) {
            d3.select(linkGroup)
                .selectAll('.link')
                .data(linkData, (d) => findTransitonId(d))
                .join(
                    (enter) =>
                        enter
                            .append('path')
                            .classed('link', true)
                            .attr('stroke', 'black')
                            .attr('fill', 'none')
                            .attr('opacity', 0)
                            .attr('d', (d) => {
                                return `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${
                                    d.parent.x
                                },${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`
                            })
                            .call((node) =>
                                node.transition().duration(duration).attr('opacity', 0.2)
                            ),
                    (update) =>
                        update.call((node) =>
                            node
                                .transition('link-update')
                                .duration(duration)
                                .attr('d', (d) => {
                                    return `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${
                                        d.parent.x
                                    },${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`
                                })
                        ),
                    (exit) =>
                        exit.call((node) =>
                            node
                                .transition()
                                .duration(duration / 2)
                                .attr('opacity', 0)
                                // .attr("d", d => {
                                //     console.log('d: ', d)
                                //     return "M" + d.x + "," + d.y
                                //     + "C" + d.x + "," + (d.y + d.parent.y) / 2
                                //     + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                                //     + " " + d.parent.x + "," + d.parent.y;
                                // })
                                .remove()
                        )
                )
        }

        function findStartRadius(d, name, isParent, offset) {
            // if parent and match, return match radius
            const match = d3.select(`#${isParent ? '' : 'parent-'}${name}-${d.data.id}`)
            if (match.node()) return match.attr('r')
            return findRadius(d) + offset
        }

        function findStartOpacity(d, name, isParent) {
            // if parent and match, start at full opacity
            const match = d3.select(`#${isParent ? '' : 'parent-'}${name}-${d.data.id}`)
            if (match.node()) return 1
            return 0
        }

        function findStartFontSize(d, name, isParent) {
            // if parent and match, return match font size
            const match = d3.select(`#${isParent ? '' : 'parent-'}${name}-${d.data.id}`)
            if (match.node()) return match.attr('font-size')
            return isRoot(d) ? 16 : 12
        }

        function findStartTransform(d, name, isParent) {
            // if parent, rotate transform
            // if also match, copy and invert translation then remove match
            const match = d3.select(`#${isParent ? '' : 'parent-'}${name}-${d.data.id}`)
            if (match.node()) {
                const t = match.attr('transform').split(/[(,)]/)
                const x = +t[1]
                const y = +t[2]
                match.remove()
                return `translate(${-x || 0},${-y || 0})${isParent ? ',rotate(180,0,0)' : ''}`
            }
            return `translate(${d.x},${d.y})${isParent ? ',rotate(180,0,0)' : ''}`
        }

        function createBackgroundCircles(nodeGroup, nodeData) {
            const isParent = nodeGroup === '#parent-node-group'
            d3.select(nodeGroup)
                .selectAll('.background-circle')
                .data(nodeData, (d) => findTransitonId(d))
                .join(
                    (enter) =>
                        enter
                            .append('circle')
                            .classed('background-circle', true)
                            .classed('transitioning', (d) => {
                                const match = d3.select(
                                    `#${isParent ? '' : 'parent-'}background-circle-${d.data.id}`
                                )
                                if (match.node()) return true
                                return false
                            })
                            .attr(
                                'id',
                                (d) => `${isParent ? 'parent-' : ''}background-circle-${d.data.id}`
                            )
                            .attr('opacity', (d) =>
                                findStartOpacity(d, 'background-circle', isParent)
                            )
                            .attr('r', (d) => findStartRadius(d, 'background-circle', isParent, 2))
                            .attr('fill', '#aaa')
                            .attr('stroke-width', 3)
                            .attr('transform', (d) =>
                                findStartTransform(d, 'background-circle', isParent)
                            )
                            .style('cursor', 'pointer')
                            .on('mouseover', (d) => {
                                const node = d3.select(
                                    `#${isParent ? 'parent-' : ''}background-circle-${d.data.id}`
                                )
                                if (!node.classed('transitioning')) {
                                    node.transition()
                                        .duration(duration / 5)
                                        .attr('fill', '#8ad1ff')
                                        .attr('r', findRadius(d) + 6)
                                }
                            })
                            .on('mouseout', (d) => {
                                const node = d3.select(
                                    `#${isParent ? 'parent-' : ''}background-circle-${d.data.id}`
                                )
                                if (!node.classed('transitioning')) {
                                    node.transition()
                                        .duration(duration / 2)
                                        .attr('fill', '#aaa')
                                        .attr('r', findRadius(d) + 2)
                                }
                            })
                            .on('mousedown', (d) => {
                                if (!spaceTransitioning.current) {
                                    if (d.data.isExpander) {
                                        getChildren(d.parent)
                                    } else if (d.parent) {
                                        spaceTransitioning.current = true
                                        history.push(`/s/${d.data.handle}/spaces`)
                                        d3.selectAll('.background-circle').classed(
                                            'transitioning',
                                            true
                                        )
                                    }
                                }
                            })
                            .call((node) =>
                                node
                                    .transition('background-circle-enter')
                                    .duration(duration)
                                    .attr('opacity', 1)
                                    .attr('r', (d) => findRadius(d) + 2)
                                    .attr('transform', (d) => `translate(${d.x},${d.y})`)
                                    .on('end', () => {
                                        // console.log('end')
                                        // d3.selectAll('.background-circle').classed(
                                        //     'transitioning',
                                        //     false
                                        // )
                                        // spaceTransitioning.current = false
                                    })
                            ),
                    (update) =>
                        update.call((node) =>
                            node
                                .on('mouseover', (d) => {
                                    const node2 = d3.select(
                                        `#${isParent ? 'parent-' : ''}background-circle-${
                                            d.data.id
                                        }`
                                    )
                                    if (!node2.classed('transitioning')) {
                                        node2
                                            .transition()
                                            .duration(duration / 5)
                                            .attr('fill', '#8ad1ff')
                                            .attr('r', findRadius(d) + 6)
                                    }
                                })
                                .on('mouseout', (d) => {
                                    const node2 = d3.select(
                                        `#${isParent ? 'parent-' : ''}background-circle-${
                                            d.data.id
                                        }`
                                    )
                                    if (!node2.classed('transitioning')) {
                                        node2
                                            .transition()
                                            .duration(duration / 2)
                                            .attr('fill', '#aaa')
                                            .attr('r', findRadius(d) + 2)
                                    }
                                })
                                .transition('background-circle-update')
                                .duration(duration)
                                .attr('r', (d) => findRadius(d) + 2)
                                .attr('transform', (d) => `translate(${d.x},${d.y})`)
                        ),
                    (exit) =>
                        exit.call((node) =>
                            node
                                .transition('background-circle-exit')
                                .duration(duration / 2)
                                .attr('opacity', 0)
                                .remove()
                        )
                )
        }

        function createImageBackgrounds(nodeGroup, nodeData) {
            const isParent = nodeGroup === '#parent-node-group'
            d3.select(nodeGroup)
                .selectAll('.image-background-circle')
                .data(nodeData, (d) => findTransitonId(d))
                .join(
                    (enter) =>
                        enter
                            .append('circle')
                            .classed('image-background-circle', true)
                            .attr(
                                'id',
                                (d) =>
                                    `${isParent ? 'parent-' : ''}image-background-circle-${
                                        d.data.id
                                    }`
                            )
                            .attr('opacity', (d) =>
                                findStartOpacity(d, 'image-background-circle', isParent)
                            )
                            .attr('r', (d) =>
                                findStartRadius(d, 'image-background-circle', isParent, -0.1)
                            )
                            .attr('pointer-events', 'none')
                            .style('fill', 'white')
                            .attr('transform', (d) =>
                                findStartTransform(d, 'image-background-circle', isParent)
                            )
                            .call((node) =>
                                node
                                    // .transition('image-background-circle-enter')
                                    .transition()
                                    .duration(duration)
                                    .attr('opacity', 1)
                                    .attr('transform', (d) => `translate(${d.x},${d.y})`)
                                    .attr('r', (d) => findRadius(d) - 0.1)
                            ),
                    (update) =>
                        update.call((node) =>
                            node
                                // .transition('image-background-circle-update')
                                .transition()
                                .duration(duration)
                                .attr('r', (d) => findRadius(d) - 0.1)
                                .attr('transform', (d) => {
                                    return `translate(${d.x},${d.y})`
                                })
                        ),
                    (exit) =>
                        exit.call((node) =>
                            node
                                // .transition('image-background-circle-exit')
                                .transition()
                                .duration(duration / 2)
                                .attr('opacity', 0)
                                .remove()
                        )
                )
        }

        function createImages(nodeGroup, nodeData) {
            const isParent = nodeGroup === '#parent-node-group'
            d3.select(nodeGroup)
                .selectAll('.image-circle')
                .data(nodeData, (d) => findTransitonId(d))
                .join(
                    (enter) =>
                        enter
                            .append('circle')
                            .classed('image-circle', true)
                            .attr('id', (d) => `image-circle-${d.data.id}`)
                            .attr(
                                'id',
                                (d) => `${isParent ? 'parent-' : ''}image-circle-${d.data.id}`
                            )
                            .attr('opacity', (d) => findStartOpacity(d, 'image-circle', isParent))
                            .attr('r', (d) => findStartRadius(d, 'image-circle', isParent, 0))
                            .attr('pointer-events', 'none')
                            .style('fill', (d) => findFill(d))
                            .attr('transform', (d) =>
                                findStartTransform(d, 'image-circle', isParent)
                            )
                            .call((node) =>
                                node
                                    .transition('image-circle-enter')
                                    .duration(duration)
                                    .attr('opacity', 1)
                                    .attr('r', (d) => findRadius(d))
                                    .attr('transform', (d) => {
                                        if (isParent)
                                            return `translate(${d.x},${d.y}),rotate(180,0,0)`
                                        return `translate(${d.x},${d.y})`
                                    })
                            ),
                    (update) =>
                        update.call(
                            (node) =>
                                node
                                    .transition('image-circle-update')
                                    .duration(duration)
                                    .attr('r', (d) => findRadius(d))
                                    .style('fill', (d) => findFill(d))
                                    .attr('transform', (d) => {
                                        if (isParent)
                                            return `translate(${d.x},${d.y}),rotate(180,0,0)`
                                        return `translate(${d.x},${d.y})`
                                    })
                            // .attr('transform', (d) =>
                            //     findStartTransform(d, 'image-circle', isParent)
                            // )
                            // .attr('transform', (d) => {
                            //     return `translate(${d.x},${d.y})`
                            // })
                        ),
                    (exit) =>
                        exit.call((node) =>
                            node
                                .transition('image-circle-exit')
                                .duration(duration / 2)
                                .attr('opacity', 0)
                                .remove()
                        )
                )
        }

        function createText(nodeGroup, nodeData) {
            const isParent = nodeGroup === '#parent-node-group'
            d3.select(nodeGroup)
                .selectAll('.node-text')
                .data(nodeData, (d) => findTransitonId(d))
                .join(
                    (enter) =>
                        enter
                            .append('text')
                            .classed('node-text', true)
                            .attr('id', (d) => `${isParent ? 'parent-' : ''}node-text-${d.data.id}`)
                            .text((d) => {
                                const croppedText =
                                    d.data.name && d.data.name.length > maxTextLength
                                        ? `${d.data.name.substring(0, maxTextLength - 3)}...`
                                        : d.data.name
                                return isRoot(d) ? d.data.name : croppedText
                            })
                            .attr('font-size', (d) => findStartFontSize(d, 'node-text', isParent)) // (isRoot(d) ? 16 : 12))
                            .attr('opacity', (d) => findStartOpacity(d, 'node-text', isParent))
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'central')
                            .attr('y', (d) => {
                                const match = d3.select(
                                    `#${isParent ? '' : 'parent-'}node-text-${d.data.id}`
                                )
                                if (match.node()) return match.attr('y')
                                return isRoot(d) ? -65 : -40
                            })
                            .attr('x', 0)
                            .attr('transform', (d) => findStartTransform(d, 'node-text', isParent))
                            .call((node) =>
                                node
                                    .transition('node-text-enter')
                                    .duration(duration)
                                    .attr('opacity', 1)
                                    .attr('y', (d) => (isRoot(d) ? -65 : -40))
                                    .attr('font-size', (d) => (isRoot(d) ? 16 : 12))
                                    .attr('transform', (d) => {
                                        if (isParent)
                                            return `translate(${d.x},${d.y}),rotate(180,0,0)`
                                        return `translate(${d.x},${d.y})`
                                    })
                            ),
                    (update) =>
                        update.call((node) =>
                            node
                                .transition('node-text-update')
                                .duration(duration)
                                .attr('y', (d) => (isRoot(d) ? -65 : -40))
                                .attr('font-size', (d) => (isRoot(d) ? 16 : 12))
                                .attr('transform', (d) => {
                                    return `translate(${d.x},${d.y})${
                                        isParent ? ',rotate(180,0,0)' : ''
                                    }`
                                })
                                .text((d) => {
                                    const croppedText =
                                        d.data.name && d.data.name.length > maxTextLength
                                            ? `${d.data.name.substring(0, maxTextLength - 3)}...`
                                            : d.data.name
                                    return isRoot(d) ? d.data.name : croppedText
                                })
                        ),
                    (exit) =>
                        exit.call((node) =>
                            node
                                .transition('node-text-exit')
                                .duration(duration / 2)
                                .attr('opacity', 0)
                                .remove()
                        )
                )
        }

        function createPlusMinusButtons(nodeGroup, nodeData) {
            d3.select(nodeGroup)
                .selectAll('.node-button')
                .data(nodeData, (d) => d.data.uuid)
                .join(
                    (enter) =>
                        enter
                            .filter((d) => {
                                return d.data.total_results > 0 && d.depth > 0
                            })
                            .append('svg:image')
                            .attr('xlink:href', (d) => {
                                return d.data.collapsed === true
                                    ? '/icons/plus.svg'
                                    : '/icons/minus-solid.svg'
                            })
                            .classed('node-button', true)
                            .attr('id', (d) => `node-button-${d.data.id}`)
                            .attr('opacity', 0)
                            .attr('width', 15)
                            .attr('height', 15)
                            .attr('y', -7)
                            .attr('x', 32)
                            .attr('transform', (d) => {
                                return `translate(${d.x},${d.y})`
                            })
                            .style('cursor', 'pointer')
                            .on('click', (d) => {
                                const match = findParent(data, d.data.uuid)
                                if (d.data.collapsed === true) match.collapsed = false
                                else match.collapsed = true
                                toggleChildren(match)
                                updateTree(data, false)
                            })
                            .call((node) =>
                                node
                                    .transition('node-button-enter')
                                    .duration(duration)
                                    .attr('opacity', 0.15)
                            ),
                    (update) =>
                        update.call((node) =>
                            node
                                .transition('node-text-update')
                                .duration(duration)
                                .attr('xlink:href', (d) => {
                                    return d.data.collapsed === true
                                        ? '/icons/plus.svg'
                                        : '/icons/minus-solid.svg'
                                })
                                .attr('transform', (d) => {
                                    return `translate(${d.x},${d.y})`
                                })
                        ),
                    (exit) =>
                        exit.call((node) =>
                            node
                                .transition('node-text-exit')
                                .duration(duration / 2)
                                .attr('opacity', 0)
                                .remove()
                        )
                )
        }

        createLinks('#link-group', links)
        createLinks('#parent-link-group', parentLinks)

        createBackgroundCircles('#node-group', nodes)
        createImageBackgrounds('#node-group', nodes)
        createImages('#node-group', nodes)
        createText('#node-group', nodes)
        createPlusMinusButtons('#node-group', nodes)

        createBackgroundCircles('#parent-node-group', parentNodes)
        createImageBackgrounds('#parent-node-group', parentNodes)
        createImages('#parent-node-group', parentNodes)
        createText('#parent-node-group', parentNodes)
    }

    useEffect(() => {
        createCanvas()
    }, [])

    // first run
    useEffect(() => {
        if (spaceData.id) {
            if (firstRun) setFirstRun(false)
            // if (searchQuery) {
            //     updateSpaceSpacesFilter('searchQuery', '')
            //     // todo: get this to update search in search bar
            // }
            // else getData()
            getSpaceMapData()
        }
    }, [spaceData.id])

    // filter updates
    useEffect(() => {
        if (!firstRun) {
            spaceTransitioning.current = true
            getSpaceMapData()
        }
    }, [type, sortBy, sortOrder, depth, searchQuery, timeRange])

    // useEffect(() => {
    //     setWidth(fullScreen ? '100%' : 700)
    // }, [fullScreen])

    // useEffect(() => {
    //     updateCanvasSize()
    // }, [width])

    return <div id='canvas' />
    // style={{ width: '100%', height: '100%' }}
}

export default HolonSpaceMap
