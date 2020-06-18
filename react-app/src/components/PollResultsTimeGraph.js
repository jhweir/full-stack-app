import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import * as d3 from 'd3'

function PollResultsTimeGraph(props) {
    const { post, postId, pollAnswers, totalPollVotes, pollAnswersSortedByScore, colorScale } = props
    const [pollVotes, setPollVotes] = useState([])
    // const [pollLines, setPollLines] = useState([])

    const width = 600
    const height = 350
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }


    function getPollVotes() {
        axios.get(config.environmentURL + `/poll-votes?postId=${postId}`)
        .then(res => { setPollVotes(res.data) })
    }

    useEffect(() => {
        getPollVotes()
        console.log('getPollVotes run on PollResultsTimeGraph component')
    }, [])

    var pollVotesGroupedByAnswer = d3.nest()
        .key(function(d) { return d.pollAnswerId })
        .entries(pollVotes)

    pollVotesGroupedByAnswer.forEach(answer => {
        var valuesArray = answer.values.map(votes => Number(votes.value))
        console.log('valuesArray:', valuesArray)
        // create array of accumulated vote values
        var accumulatedValuesArray = []
        valuesArray.reduce(function(a, b, i) { return accumulatedValuesArray[i] = a + b }, 0)
        // add accumulated values to votes
        answer.values.forEach((vote, i) => vote.accumulatedValue = accumulatedValuesArray[i])
        // add start and end values to vote arrays
        answer.values.unshift({ accumulatedValue: 0, parsedCreatedAt: Date.parse(post.createdAt) })
        answer.values.push({ accumulatedValue: accumulatedValuesArray[accumulatedValuesArray.length - 1], parsedCreatedAt: Date.parse(new Date) })
        // add total score to answer
        answer.total_score = answer.values[answer.values.length - 1].accumulatedValue
    })

    pollVotesGroupedByAnswer.sort((a, b) => b.total_score - a.total_score) 

    console.log('pollVotes', pollVotes)
    console.log('pollVotesGroupedByAnswer', pollVotesGroupedByAnswer)

    // X-axis (horizontal) = time
    const minX = Date.parse(post.createdAt)
    const maxX = Date.parse(new Date)
    // Y-axis (vertical) = points
    const minY = 0
    const maxY = d3.max(pollVotes.map(vote => vote.accumulatedValue))

    const x = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([margin.left, width - margin.right])

    const y = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height - margin.bottom, margin.top])

    const line = d3.line()
        .x(function(d) { return x(d.parsedCreatedAt) })
        .y(function(d) { return y(d.accumulatedValue) })
        //.curve(d3.curveBundle.beta(1))

    const x_axis = d3.axisBottom()
        .scale(x)
        .tickFormat(function(d) {
            let date = new Date(d)
            return `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        })
        .tickArguments([4])
        //.tickArguments([d3.timeMinute.every(15)])
        //.tickValues([1, 2])

    const y_axis = d3.axisLeft()
        .scale(y)

    useEffect(() => {
        if (pollVotes.length) {
            pollVotesGroupedByAnswer.forEach((answer, i) => {
                let line = d3.selectAll(`#line-${answer.key}`)
                let totalLength = line.node().getTotalLength()
                line
                    .attr("stroke-dasharray", totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .attr("stroke-width", 10)
                    //.attr("stroke", "#6788ad")
                    .transition()
                    .duration(3000)
                    .attr("stroke-width", 3)
                    .attr("stroke-dashoffset", 0)

                d3.select("#time-graph-svg").append('g')
                    .selectAll("dot")
                    .data(answer.values)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return x(d.parsedCreatedAt) } )
                    .attr("cy", function (d) { return y(d.accumulatedValue) } )
                    .attr("r", 3)
                    .style("fill", colorScale(i))//d3.interpolateRgb("#9ed5ff", "#00b978")(i))
                    .style("opacity", 0)
                    .transition()
                    .duration(3000)
                    .style("opacity", 1)
            })

            d3.select("#time-graph-svg").append("g")
                .call(x_axis)
                .attr("transform", `translate(0,${height - margin.bottom})`)

            d3.select("#time-graph-svg").append("g")
                .call(y_axis)
                .attr("transform", "translate(50,0)")

            // d3.select("svg").append('g')
            //     .selectAll("dot")
            //     .data(pollVotesGroupedByAnswer[0].values)
            //     .enter()
            //     .append("circle")
            //       .attr("cx", function (d) { return x(d.parsedCreatedAt) } )
            //       .attr("cy", function (d) { return y(d.accumulatedValue) } )
            //       .attr("r", 1.5)
            //       .style("fill", "#69b3a2")

            // d3.selectAll("circle")
            //     .data(pollVotes)
            //     .enter()
            //     .append("circle")
                    //     .attr("width", 200)
    //     .attr("height", 200)
            // let line2 = d3.selectAll("#line");
            // var totalLength = line2.node().getTotalLength();
            // console.log(totalLength);
            // line2
            // .attr("stroke-dasharray", totalLength)
            // .attr("stroke-dashoffset", totalLength)
            // .attr("stroke-width", 10)
            // //.attr("stroke", "#6788ad")
            // .transition()
            // .duration(3000)
            // .attr("stroke-width", 3)
            // .attr("stroke-dashoffset", 0)
        }
    },[pollVotes])

    return (
        // <div className="chart" style={{width: width}}></div>
        <div>
            <svg id={'time-graph-svg'} height={height} width={width}>
                <g>
                    {pollVotesGroupedByAnswer.map((answer, i) =>
                        <path
                            key={i}
                            id={`line-${answer.key}`}
                            d={line(answer.values)}
                            fill={"transparent"}
                            stroke={colorScale(i)} //d3.interpolateRgb("#9ed5ff", "#00b978")(i)}
                            strokeWidth={3}
                        />
                    )}
                </g>
            </svg>
        </div>
    )
}

export default PollResultsTimeGraph

// var allAnswers = []
// pollAnswers.forEach(answer => allAnswers = [...allAnswers, ...answer.Votes])
// console.log('allAnswers', allAnswers)

//var groupedData = []

// pollAnswers.forEach(pollAnswer => {
//     let answerVotes = data.filter(({ answer }) => { return answer === pollAnswer.id })
//     groupedData = [...groupedData, answerVotes]
// })

//console.log('groupedData: ', groupedData)

// const allVotes = data.map(a => a.votes)
// console.log('allVotes: ', allVotes)

// const pollAnswers = [
//     {
//         id: 1,
//         text: "Answer 1...",
//         total_votes: 5,
//         total_score: 5
//     },
//     {
//         id: 2,
//         text: "Answer 2...",
//         total_votes: 2,
//         total_score: 2
//     },
//     {
//         id: 3,
//         text: "Answer 3...",
//         total_votes: 3,
//         total_score: 3
//     }
// ]

// const data = [
//     { answer: 1, date: 1579103238000, value: 0 },
//     { answer: 1, date: 1581781638000, value: 1 },
//     { answer: 1, date: 1584287238000, value: 5 },
//     { answer: 1, date: 1586965638000, value: 2 },
//     { answer: 1, date: 1589557638000, value: 8 },
//     { answer: 2, date: 1579103238000, value: 2 },
//     { answer: 2, date: 1581781638000, value: 3 },
//     { answer: 2, date: 1584287238000, value: 1 },
//     { answer: 2, date: 1586965638000, value: 3 },
//     { answer: 2, date: 1589557638000, value: 4 },
//     { answer: 3, date: 1584287238000, value: 8 },
//     { answer: 3, date: 1586965638000, value: 7 },
//     { answer: 3, date: 1589557638000, value: 9 }
// ]

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