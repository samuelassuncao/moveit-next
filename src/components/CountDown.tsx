import { useEffect, useState } from "react"
import styles from "../styles/components/CountDown.module.css"

import { FaCheckCircle as CheckIcon } from "react-icons/fa"
let countDownTimeOut: NodeJS.Timeout
const INITIAL_TIME = 0.1 * 60

export function CountDown () {
    const [time, setTime] = useState(INITIAL_TIME)
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false)

    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('')
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('')

    function startCountDown () {
        setIsActive(true)
    }

    function resetCountDown () {
        clearTimeout(countDownTimeOut)
        setIsActive(false)
        setTime(INITIAL_TIME)
    }

    useEffect(() => {
        if (isActive && time > 0) {
            countDownTimeOut = setTimeout(() => {
            setTime(prev => prev - 1)
            }, 1000)

            return () => clearTimeout(countDownTimeOut)
        } else if (isActive && time === 0) {
            setHasFinished(true)
            setIsActive(false)
        }
    }, [isActive, time])


    return (
        <div>
            <div className={styles.countDownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            { hasFinished ? (
                <button
                    disabled
                    className={styles.countDownButton}
                >
                    Ciclo finalizado
                    <CheckIcon style={{ marginLeft: "1rem", color: "#4cd62b" }}/>
                </button>
            ) : (
                <>
                    { isActive ? (
                        <button
                            type="button"
                            className={`${styles.countDownButton} ${styles.countDownButtonActive}`}
                            onClick={resetCountDown}>
                            Abandonar ciclo
                        </button>
                    )
                    : (
                        <button
                            type="button"
                            className={styles.countDownButton}
                            onClick={startCountDown}>
                            Iniciar um ciclo
                        </button>
                    )}
                </>
            )}
        </div>
    )
}