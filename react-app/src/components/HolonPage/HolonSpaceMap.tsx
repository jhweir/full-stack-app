import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import { useHistory } from 'react-router-dom'
import config from '../../Config'
// import styles from '../../styles/components/HolonSpaceMap.module.scss'
import { SpaceContext } from '../../contexts/SpaceContext'
import { ISpaceMapData } from '../../Interfaces'

const HolonSpaceMap = (): JSX.Element => {
    const {
        spaceData,
        setSpaceHandle,
        fullScreen,
        spaceSpacesTypeFilter,
        spaceSpacesSortByFilter,
        spaceSpacesSortOrderFilter,
        spaceSpacesTimeRangeFilter,
        spaceSpacesDepthFilter,
        spaceSpacesSearchFilter,
    } = useContext(SpaceContext)
    const [spaceMapData, setSpaceMapData] = useState<Partial<ISpaceMapData>>({})
    const [width, setWidth] = useState<number | string>(700)
    const [spaceTransitioning, setSpaceTransitioning] = useState<boolean>(true)

    const history = useHistory()

    const height = 700
    const circleRadius = 25
    const maxTextLength = 14
    const xOffset = 0
    const yOffset = 80

    const getSpaceMapData = (): void => {
        console.log('HolonSpaceMap: getSpaceMapData')
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/space-map-data?spaceId=${spaceData.id
                }&offset=${0
                }&spaceType=${spaceSpacesTypeFilter
                }&sortBy=${spaceSpacesSortByFilter
                }&sortOrder=${spaceSpacesSortOrderFilter
                }&timeRange=${spaceSpacesTimeRangeFilter
                }&depth=${spaceSpacesDepthFilter
                }&searchQuery=${spaceSpacesSearchFilter}`
            )
            .then((res) => setSpaceMapData(res.data))
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

    const zoom = d3
        .zoom()
        .on('zoom', () =>
            d3.select('#space-map-master-group').attr('transform', d3.event.transform)
        )

    function resetTreePosition() {
        d3.select('#space-map-svg')
            .transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity)
    }

    function createCanvas() {
        d3.select('#canvas')
            .append('svg')
            .attr('id', 'space-map-svg')
            .attr('width', width) // + margin.left + margin.right)
            .attr('height', height)

        d3.select('#space-map-svg').append('defs').attr('id', 'imgdefs')

        d3.select('#space-map-svg').append('g').attr('id', 'space-map-master-group')

        const newWidth = parseInt(d3.select('#space-map-svg').style('width'), 10)

        d3.select('#space-map-master-group')
            .append('g')
            .attr('id', 'link-group')
            .attr('transform', `translate(${xOffset + newWidth / 2},${yOffset})`)

        d3.select('#space-map-master-group')
            .append('g')
            .attr('id', 'node-group')
            .attr('transform', `translate(${xOffset + newWidth / 2},${yOffset})`)

        d3.select('#space-map-svg').call(zoom)
    }

    function updateCanvasSize() {
        d3.select('#canvas').style('width', width)

        d3.select('#space-map-svg').attr('width', width)

        const newWidth = parseInt(d3.select('#space-map-svg').style('width'), 10)

        d3.select('#link-group').attr(
            'transform',
            `translate(${xOffset + newWidth / 2},${yOffset})`
        )

        d3.select('#node-group').attr(
            'transform',
            `translate(${xOffset + newWidth / 2},${yOffset})`
        )
    }

    function interruptRunningTransitions(data) {
        d3.selectAll('.background-circle').each((d) => {
            if (!findParent(data, d.data.id)) {
                d3.select(`#background-circle-${d.data.id}`).interrupt('background-circle-enter')
            }
        })
        // d3.selectAll('.image-background-circle').each((d) => {
        //     if (!findParent(data, d.data.id)) {
        //         d3.select(`#image-background-circle-${d.data.id}`).interrupt('image-background-circle-enter')
        //     }
        // })
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

    function updateTree(data) {
        const root = d3.hierarchy(data, (d) => {
            return d.children
        })
        const tree = d3
            .tree()
            .nodeSize([50, 200])
            .separation(() => {
                return 2
            }) // ((a, b) => { return a.parent == b.parent ? 2 : 1 })

        tree(root).links()
        const links = root.descendants().slice(1)
        const nodes = root.descendants()

        interruptRunningTransitions(data)

        function getChildren(node) {
            console.log('HolonSpaceMap: getSpaceMapData')
            axios
                .get(
                    /* prettier-ignore */
                    `${config.apiURL}/space-map-data?spaceId=${node.data.id
                    }&offset=${node.children.length - 1
                    }&spaceType=${spaceSpacesTypeFilter
                    }&sortBy=${spaceSpacesSortByFilter
                    }&sortOrder=${spaceSpacesSortOrderFilter
                    }&timeRange=${spaceSpacesTimeRangeFilter
                    }&depth=${spaceSpacesDepthFilter
                    }&searchQuery=${spaceSpacesSearchFilter}`
                )
                .then((res) => {
                    // console.log(res)
                    const match = findParent(spaceMapData, node.data.uuid)
                    match.children = match.children.filter((child) => !child.isExpander)
                    match.children.push(...res.data)
                    // setSpaceMapData(_.cloneDeep(spaceMapData))
                    updateTree(spaceMapData)
                })
        }

        function findTransitonId(d) {
            if (spaceTransitioning) return d.data.id
            return d.data.uuid
        }

        // create links
        d3.select('#link-group')
            .selectAll('.link')
            .data(links, (d) => findTransitonId(d))
            .join(
                (enter) =>
                    enter
                        .append('path')
                        .classed('link', true)
                        .attr('stroke', 'black')
                        .attr('fill', 'none')
                        .attr('opacity', 0)
                        .attr('d', (d) => {
                            return `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${
                                (d.y + d.parent.y) / 2
                            } ${d.parent.x},${d.parent.y}`
                        })
                        .call((node) => node.transition().duration(1000).attr('opacity', 0.2)),
                (update) =>
                    update.call((node) =>
                        node
                            .transition('link-update')
                            .duration(1000)
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
                            .duration(500)
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

        // create background circle
        d3.select('#node-group')
            .selectAll('.background-circle')
            .data(nodes, (d) => findTransitonId(d))
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .classed('background-circle', true)
                        .attr('id', (d) => `background-circle-${d.data.id}`)
                        .attr('opacity', 0)
                        .attr('r', circleRadius + 2)
                        .attr('fill', '#aaa')
                        .attr('stroke-width', 3)
                        .attr('opacity', 0)
                        .attr('transform', (d) => {
                            return `translate(${d.x},${d.y})`
                        })
                        .style('cursor', 'pointer')
                        .on('mouseover', (d) => {
                            d3.select(`#background-circle-${d.data.id}`)
                                .transition()
                                .duration(200)
                                .attr('fill', '#8ad1ff')
                                .attr('r', circleRadius + 6)
                        })
                        .on('mouseout', (d) => {
                            d3.select(`#background-circle-${d.data.id}`)
                                .transition()
                                .duration(500)
                                .attr('fill', '#aaa')
                                .attr('r', circleRadius + 2)
                        })
                        .on('mousedown', (d) => {
                            if (d.data.isExpander) {
                                getChildren(d.parent)
                            } else {
                                setSpaceTransitioning(true)
                                history.push(`/s/${d.data.handle}/spaces`)
                                setSpaceHandle(d.data.handle)
                            }
                        })
                        .call((node) =>
                            node
                                .transition('background-circle-enter')
                                .duration(1000)
                                .attr('opacity', 1)
                        ),
                (update) =>
                    update.call((node) =>
                        node
                            .transition('background-circle-update')
                            .duration(1000)
                            .attr('transform', (d) => {
                                return `translate(${d.x},${d.y})`
                            })
                    ),
                (exit) =>
                    exit.call((node) =>
                        node
                            .transition('background-circle-exit')
                            .duration(500)
                            .attr('opacity', 0)
                            .remove()
                    )
            )

        // create image background for png images
        d3.select('#node-group')
            .selectAll('.image-background-circle')
            .data(nodes, (d) => findTransitonId(d))
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .classed('image-background-circle', true)
                        .attr('id', (d) => `image-background-circle-${d.data.id}`)
                        .attr('opacity', 0)
                        .attr('r', circleRadius - 0.1)
                        .attr('pointer-events', 'none')
                        .style('fill', 'white')
                        .attr('transform', (d) => {
                            return `translate(${d.x},${d.y})`
                        })
                        .call((node) =>
                            node
                                // .transition('image-background-circle-enter')
                                .transition()
                                .duration(1000)
                                .attr('opacity', 1)
                        ),
                (update) =>
                    update.call((node) =>
                        node
                            // .transition('image-background-circle-update')
                            .transition()
                            .duration(1000)
                            .attr('transform', (d) => {
                                return `translate(${d.x},${d.y})`
                            })
                    ),
                (exit) =>
                    exit.call((node) =>
                        node
                            // .transition('image-background-circle-exit')
                            .transition()
                            .duration(500)
                            .attr('opacity', 0)
                            .remove()
                    )
            )

        // create image circle
        d3.select('#node-group')
            .selectAll('.image-circle')
            .data(nodes, (d) => findTransitonId(d))
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .classed('image-circle', true)
                        .attr('id', (d) => `image-circle-${d.data.id}`)
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
                            d3.select('defs')
                                .append('pattern')
                                .attr('id', `image-${d.data.id}`)
                                .attr('height', 1)
                                .attr('width', 1)
                                .attr('x', '0')
                                .attr('y', '0')
                                .append('image')
                                .attr('preserveAspectRatio', 'xMidYMid slice')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('height', circleRadius * 2)
                                .attr('width', circleRadius * 2)
                                .attr('xlink:href', imagePath)

                            return `url(#image-${d.data.id})`
                        })
                        .attr('transform', (d) => {
                            return `translate(${d.x},${d.y})`
                        })
                        .call((node) =>
                            node.transition('image-circle-enter').duration(1000).attr('opacity', 1)
                        ),
                (update) =>
                    update.call((node) =>
                        node
                            .transition('image-circle-update')
                            .duration(1000)
                            .attr('transform', (d) => {
                                return `translate(${d.x},${d.y})`
                            })
                    ),
                (exit) =>
                    exit.call((node) =>
                        node
                            .transition('image-circle-exit')
                            .duration(500)
                            .attr('opacity', 0)
                            .remove()
                    )
            )

        // create node text
        d3.select('#node-group')
            .selectAll('.node-text')
            .data(nodes, (d) => findTransitonId(d))
            .join(
                (enter) =>
                    enter
                        .append('text')
                        .classed('node-text', true)
                        .attr('id', (d) => `node-text-${d.data.id}`)
                        .text((d) => {
                            const croppedText =
                                d.data.name && d.data.name.length > maxTextLength
                                    ? `${d.data.name.substring(0, maxTextLength - 3)}...`
                                    : d.data.name
                            return croppedText
                        })
                        .attr('font-size', 12)
                        .attr('opacity', 0)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'central')
                        .attr('y', -40)
                        .attr('x', 0)
                        .attr('transform', (d) => {
                            return `translate(${d.x},${d.y})`
                        })
                        .call((node) =>
                            node.transition('node-text-enter').duration(1000).attr('opacity', 1)
                        ),
                (update) =>
                    update.call((node) =>
                        node
                            .transition('node-text-update')
                            .duration(1000)
                            .attr('transform', (d) => {
                                return `translate(${d.x},${d.y})`
                            })
                    ),
                (exit) =>
                    exit.call((node) =>
                        node.transition('node-text-exit').duration(500).attr('opacity', 0).remove()
                    )
            )

        // create node +/- buttons
        d3.select('#node-group')
            .selectAll('.node-button')
            .data(nodes, (d) => d.data.uuid)
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
                            updateTree(data)
                        })
                        .call((node) =>
                            node
                                .transition('node-button-enter')
                                .duration(1000)
                                .attr('opacity', 0.15)
                        ),
                (update) =>
                    update.call((node) =>
                        node
                            .transition('node-text-update')
                            .duration(1000)
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
                        node.transition('node-text-exit').duration(500).attr('opacity', 0).remove()
                    )
            )
    }

    useEffect(() => {
        createCanvas()
    }, [])

    useEffect(() => {
        if (spaceData.id) {
            setSpaceTransitioning(true)
            getSpaceMapData()
            resetTreePosition()
        }
    }, [
        spaceData.id,
        spaceSpacesTypeFilter,
        spaceSpacesSortByFilter,
        spaceSpacesSortOrderFilter,
        spaceSpacesTimeRangeFilter,
        spaceSpacesDepthFilter,
        spaceSpacesSearchFilter,
    ])

    useEffect(() => {
        setWidth(fullScreen ? '100%' : 700)
    }, [fullScreen])

    useEffect(() => {
        updateCanvasSize()
    }, [width])

    useEffect(() => {
        if (spaceMapData.id) {
            updateTree(spaceMapData)
            if (spaceTransitioning) setSpaceTransitioning(false)
        }
    }, [spaceMapData])

    return <div id='canvas' />
}

export default HolonSpaceMap
