import React, { useEffect } from 'react'
import * as d3 from "d3"

function PollResultsPieChart(props) {
    // const { post, pollAnswersSortedByScore, totalPollVotes, colorScale } = props
    // let width = 450,
    // height = 450,
    // radius = 150
    useEffect(() => {
        // console.log('pollAnswers: ', pollAnswers)
        // console.log('pollAnswersSortedByScore: ', pollAnswersSortedByScore)
        const { post, pollAnswersSortedByScore, totalPollVotes, colorScale } = props
        let width = 450,
        height = 450,
        radius = 150

        let arc = d3.arc()
            .outerRadius(radius - 20)
            .innerRadius(80)

        let pie = d3.pie()
            //.sort(null)
            .value(function(d) {
                if (post.subType === 'weighted-choice') { return d.total_score }
                else { return d.total_votes }
            })

        let angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()())

        let svg = d3.select('.chart')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        let g = svg.selectAll()
            .data(pie(pollAnswersSortedByScore))
            .enter()
            .append("g")

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) {
                return colorScale(i)
            })
            .style("stroke", "#f7f7f9")
            .style("stroke-width", 2)
            .style("opacity", 0)
            .attr("transform","translate(0, 0) scale(0)")
            .transition()
            .duration(1000)
            .attr("transform","translate(0, 0) scale(1)")
            .style("opacity", 1)
            .attrTween("d", d => {
                let originalEnd = d.endAngle;
                return t => {
                    let currentAngle = angleInterpolation(t)
                    if (currentAngle < d.startAngle) { return "" } else
                    d.endAngle = Math.min(currentAngle, originalEnd)
                    return arc(d)
                }
            })

        g.append("text")
            .attr("transform", function(d) {
                let _d = arc.centroid(d)
                _d[0] = _d[0] * 1.7 //1.9 - 30
                _d[1] = _d[1] * 1.7 - 15
                return "translate(" + _d + ")"
            })
            .attr("dy", ".50em")
            .style("font-weight", 800)
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .transition()
            .duration(2000)
            .style("opacity", 1)
            .text(function(d) {
                if (post.subType === 'weighted-choice') {
                    if (((d.data.total_score / totalPollVotes) * 100) < 4) { return '' }
                    return `${d.data.total_score} ↑` //↑⇧⇑⇪⬆
                } else {
                    if (((d.data.total_votes / totalPollVotes) * 100).toFixed(1) < 4) { return '' }
                    return `${d.data.total_votes} ↑` //↑⇧⇑⇪⬆
                }
            })

        g.append("text")
            .attr("class", "percentage")
            .attr("transform", function(d) {
                let _d = arc.centroid(d)
                _d[0] = _d[0] * 1.7 //1.9 + 20 // width
                _d[1] = _d[1] * 1.7 + 10 // height
                return "translate(" + _d + ")"
            })
            .attr("dy", ".50em")
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .transition()
            .duration(2000)
            .style("opacity", 1)
            .text(function(d) {
                if (((d.data.total_score / totalPollVotes) * 100).toFixed(2) < 4) { return '' }
                return `${((d.data.total_score / totalPollVotes) * 100).toFixed(1)}%`
            })

        g.append("text")
            .attr("transform", function(d) {
                let _d = arc.centroid(d)
                _d[0] += 0
                _d[1] += 0
                return "translate(" + _d + ")"
            })
            .attr("dy", ".50em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("opacity", 0)
            .transition()
            .duration(2000)
            .style("opacity", 1)
            .text(function(d,i) {
                if (((d.data.total_votes / totalPollVotes) * 100).toFixed(2) < 4) { return '' }
                return `${i + 1}`
            })
     
        d3.select('svg').append("text")
            .attr("text-anchor", "middle")
            .attr('font-size', '3em')
            .attr('x', width / 2)
            .attr('y', height / 2 + 10)
            .text(totalPollVotes.toFixed(0))
            .style("opacity", 0)
            .transition()
            .duration(2000)
            .style("opacity", 1)

        d3.select('svg').append("text")
            .attr("text-anchor", "middle")
            .attr('font-size', '1em')
            .attr('x', width / 2)
            .attr('y', height / 2 + 35)
            .text('votes')
            .style("opacity", 0)
            .transition()
            .duration(2000)
            .style("opacity", 1)
    }, [props])
    return (
        <div className="chart" style={{width: 450}}></div>
    )
}

export default PollResultsPieChart



// import React, { useEffect } from 'react'
// import * as d3 from "d3"

// function PollResultsPieChart(props) {
//     const height = 300
//     const width = 300
//     const data = [3, 6, 26, 1, 2]// props.pollAnswers.map((answer) => answer.total_votes)

//     useEffect(() => {
//         let svg = d3.select(".chart").append("svg")
//             .attr("width", 300)
//             .attr("height", 300)
            
//         svg.append("rect")
//             .attr("x", 0)
//             .attr("y", 0)
//             .attr("width", 220)
//             .attr("height", 120)
//             .style('fill', 'orange')

//         let pieChart = d3.pie()(data)
        
//         let arc = d3
//             .arc()
//             .innerRadius(0)
//             .outerRadius(100)

//     }, [])

//     return (
//         <div className="chart" style={{width: "300px", height: "300px"}}></div>
        
//     )
// }

// export default PollResultsPieChart


// import * as React from "react"
// import * as d3 from "d3"

// function PollResultsPieChart(props) {
//     const height = 300
//     const width = 300
//     const data = props.pollAnswers.map((answer) => answer.total_votes)//[3, 6, 26, 1, 2]// props.pollAnswers.map((answer) => answer.total_votes)

//     let pieChart = d3.pie()(data)

//     let arc = d3
//         .arc()
//         .innerRadius(0)
//         .outerRadius(100)

//     // d3.select("path").append("text")
//     //     // .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"})
//     //     // .attr("dy", ".35em")
//     //     .style("text-anchor", "middle")
//     //     .style("color", "black")
//     //     .style("opacity", 1)
//     //     .text(function(d) { return 'test'})

//     return (
//         <svg height={height} width={width}>
//             <g transform={`translate(${width / 2},${height / 2})`}>
//                 {pieChart.map((slice, index) => {
//                     let sliceColor = d3.interpolateRgb("#eaaf79", "#bc3358")(index / (pieChart.length - 1))
//                     return <path key={index} d={arc(slice)} fill={sliceColor} />
//                 })}
//             </g>
//         </svg>
//     )
// }

// export default PollResultsPieChart



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
//         let svg = d3.select(d3Container.current)

//     },[])

// return (
//     <svg
//         className="d3-component"
//         width={400}
//         height={200}
//         ref={d3Container}
//     />
// );