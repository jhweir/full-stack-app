import * as React from "react"
import * as d3 from "d3"

function PollResultsPieChart(props) {
    const height = 300
    const width = 300
    const data = props.pollAnswers.map((answer) => answer.Labels.length)

    let pieChart = d3.pie()(data)

    let arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(100)

    d3.select("path").append("text")
        .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"})
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("opacity", 1)
        .text(function(d) { return 'test'})

    return (
        <svg height={height} width={width}>
            <g transform={`translate(${width / 2},${height / 2})`}>
                {pieChart.map((slice, index) => {
                    let sliceColor = d3.interpolateRgb("#eaaf79", "#bc3358")(index / (pieChart.length - 1))
                    return <path key={index} d={arc(slice)} fill={sliceColor} />
                })}
            </g>
        </svg>
    )
}

export default PollResultsPieChart



// import React, { useRef, useState, useEffect } from 'react'
// import * as d3 from "d3";
// import styles from '../styles/components/PollResultsPieChart.module.scss'



// function PollResultsPieChart(props) {
//     const ref = useRef()
//     const pollData = [
//         {title: "title1", value: 5},
//         {title: "title2", value: 15},
//         {title: "title3", value: 25},
//         {title: "title4", value: 34},
//         {title: "title5", value: 7},
//     ]

//     useEffect(() => {
//         const svg = d3.select(ref.current)
//             .append("svg")
//             .attr("width", 300)
//             .attr("height", 300)
//             .style("background", "grey")
//         const pieChartData = d3.pie()
//             .sort(null)
//             .value(function(d){ return d.value })(pollData)
//         const pieChartSegments = d3.arc()
//             .innerRadius(0)
//             .outerRadius(0)
//             .padAngle(.05)
//             .padRadius(50)
//         const sections = svg.append("g").attr("transform", "translate(250, 250)").selectAll("path").data(pieChartData)
//         sections.enter().append("path").attr("d", pieChartSegments)
//     }, [])
//     return (
//         <div ref={ref} />
//     )
// }
    
// export default PollResultsPieChart


// const d3Container = useRef(null);
// useEffect(
//     () => {
//         var svg = d3.select(d3Container.current)

//     },[])

// return (
//     <svg
//         className="d3-component"
//         width={400}
//         height={200}
//         ref={d3Container}
//     />
// );