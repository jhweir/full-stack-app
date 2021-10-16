import React, { useEffect, useRef, useState } from 'react'
import styles from '@styles/components/ImageFade.module.scss'
import * as d3 from 'd3'

const ImageFade = (props: {
    imagePath: string | null
    speed: number
    children: any
}): JSX.Element => {
    const { imagePath, speed, children } = props
    const [previousImage, setPreviousImage] = useState<string | null>(null)
    const topImageRef = useRef(null)
    const bottomImageRef = useRef(null)
    const topImage = d3.select(topImageRef.current)
    const bottomImage = d3.select(bottomImageRef.current)

    useEffect(() => {
        if (previousImage) {
            // set bottom image to previous image
            bottomImage.style('opacity', 1)
            bottomImage.attr('src', previousImage)
        }
        if (imagePath) {
            // hide top image and fade in new imagePath when loaded
            topImage.style('opacity', 0)
            topImage.on('load', () => {
                topImage.transition().duration(speed).style('opacity', 1)
                bottomImage.transition().delay(300).duration(speed).style('opacity', 0)
            })
            topImage.attr('src', imagePath)
        } else {
            // hide bottom image and fade top image out to reveal placeholder
            bottomImage.style('opacity', 0)
            topImage.transition().duration(speed).style('opacity', 0)
        }
        // store imagePath for next transition
        setPreviousImage(imagePath)
    }, [imagePath])

    return (
        <div className={styles.wrapper}>
            <div className={styles.placeholder}>{children}</div>
            <img ref={bottomImageRef} className={styles.bottomImage} alt='' />
            <img ref={topImageRef} className={styles.topImage} alt='' />
        </div>
    )
}

export default ImageFade
