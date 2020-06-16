import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import * as d3 from "d3"

function PollResultsTimeGraph(props) {
    //const { postId, pollAnswers, totalPollVotes, pollAnswersSortedByScore } = props
    const [pollVotes, setPollVotes] = useState([])
    const [pollLines, setPollLines] = useState([])
    
    const height = 300
    const width = 500

    const pollAnswers = [
        {
            id: 1,
            text: "Answer 1...",
            total_votes: 5,
            total_score: 5
        },
        {
            id: 2,
            text: "Answer 2...",
            total_votes: 2,
            total_score: 2
        },
        {
            id: 3,
            text: "Answer 3...",
            total_votes: 3,
            total_score: 3
        }
    ]

    const data = [
        { answer: 1, date: 1579103238000, value: 0 },
        { answer: 1, date: 1581781638000, value: 1 },
        { answer: 1, date: 1584287238000, value: 5 },
        { answer: 1, date: 1586965638000, value: 2 },
        { answer: 1, date: 1589557638000, value: 8 },
        { answer: 2, date: 1579103238000, value: 2 },
        { answer: 2, date: 1581781638000, value: 3 },
        { answer: 2, date: 1584287238000, value: 1 },
        { answer: 2, date: 1586965638000, value: 3 },
        { answer: 2, date: 1589557638000, value: 4 },
        { answer: 3, date: 1584287238000, value: 8 },
        { answer: 3, date: 1586965638000, value: 7 },
        { answer: 3, date: 1589557638000, value: 9 }
    ]

    var groupedData = []

    pollAnswers.forEach(pollAnswer => {
        let answerVotes = data.filter(({ answer }) => { return answer === pollAnswer.id })
        groupedData = [...groupedData, answerVotes]
    })

    console.log('groupedData: ', groupedData)

    // const allVotes = data.map(a => a.votes)
    // console.log('allVotes: ', allVotes)

    // X axis (horizontal) = time
    const minX = d3.min(data.map(vote => vote.date))
    const maxX = d3.max(data.map(vote => vote.date))
    // Y axis (vertical) = points
    const minY = 0 //d3.min(data.map(vote => vote.value))
    const maxY = d3.max(data.map(vote => vote.value))

    let x = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([0, width])

    let y = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height, height / 3])

    var line = d3
        .line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })

    useEffect(() => {
        let aline = d3.selectAll("#line");
        var totalLength = aline.node().getTotalLength();
        console.log(totalLength);
        aline
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("stroke-width", 10)
        //.attr("stroke", "#6788ad")
        .transition()
        .duration(3000)
        .attr("stroke-width", 3)
        .attr("stroke-dashoffset", 0);
    },[])

    return (
        // <div className="chart" style={{width: width}}></div>
        <div>
            <svg height={height} width={width}>
                <g id={"xAxis"}>
                    {groupedData.map((answer, i) =>
                        <path
                            key={i}
                            id={"line"}
                            d={line(answer)}
                            fill={"transparent"}
                            stroke={d3.interpolateRgb("#9ed5ff", "#00b978")(i)}
                            strokeWidth={3}
                        />
                    )}
                    {/* <path
                        id={"line"}
                        d={line(data)}
                        fill={"transparent"}
                        stroke={"blue"}
                        strokeWidth={3}
                    /> */}
                </g>
            </svg>
        </div>
    )
}

export default PollResultsTimeGraph


// {
//     answer: 1,
//     votes: [
//         { date: 1579103238000, value: 0 },
//         { date: 1581781638000, value: 1 },
//         { date: 1584287238000, value: 5 },
//         { date: 1586965638000, value: 2 },
//         { date: 1589557638000, value: 8 }
//     ]
// },
// {
//     answer: 2,
//     votes: [
//         { date: 1579103238000, value: 2 },
//         { date: 1581781638000, value: 3 },
//         { date: 1584287238000, value: 1 },
//         { date: 1586965638000, value: 3 },
//         { date: 1589557638000, value: 4 }
//     ]
// }

// useEffect(() => {
//     const minX = d3.min(data.map(vote => vote.date))
//     const maxX = d3.max(data.map(vote => vote.date))
//     const minY = d3.min(data.map(vote => vote.value))
//     const maxY = d3.max(data.map(vote => vote.value))

//     let x = d3
//         .scaleLinear()
//         .domain([minX, maxX])
//         .range([0, width])

//     let y = d3
//         .scaleLinear()
//         .domain([minY, maxY])
//         .range([height, height / 3])

//     var line = d3
//         .line()
//         .x(function(d) { return x(d.date) })
//         .y(function(d) { return y(d.value) })

// }, [])

// console.log("2020-01-15T15:47:18.000Z : ", Date.parse("2020-01-15T15:47:18.000Z"))
// console.log("2020-02-15T15:47:18.000Z : ", Date.parse("2020-02-15T15:47:18.000Z"))
// console.log("2020-03-15T15:47:18.000Z : ", Date.parse("2020-03-15T15:47:18.000Z"))
// console.log("2020-04-15T15:47:18.000Z : ", Date.parse("2020-04-15T15:47:18.000Z"))
// console.log("2020-05-15T15:47:18.000Z : ", Date.parse("2020-05-15T15:47:18.000Z"))

// function getPollVotes() {
//     axios.get(config.environmentURL + `/poll-votes?postId=${postId}`)
//     .then(res => { setPollVotes(res.data) })
// }

// useEffect(() => {
//     getPollVotes()
// }, [])

// useEffect(() => {
//     if (pollVotes.length) { 
//         const minX = d3.min(pollVotes.map(vote => vote.parsedCreatedAt))
//         const maxX = d3.max(pollVotes.map(vote => vote.parsedCreatedAt))
//         const minY = 0
//         const maxY = d3.max(pollAnswers.map(answer => answer.total_score))
//         console.log('minX: ', minX)
//         console.log('maxX: ', maxX)
//         console.log('minY: ', minY)
//         console.log('maxY: ', maxY)
//     }
// }, [pollVotes])