import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountDownContextData {
    minutes: number
    seconds: number
    hasFinished: boolean
    isActive: boolean
    startCountDown: () => void
    resetCountDown: () => void
}

type CountDownProviderProps = {
  children: ReactNode
}

export  const CountDownContext = createContext({} as CountDownContextData)

const INITIAL_TIME = 25 * 60 // Opted to declare as global to make it easier to configure initial time. In the future, user can choose what this value should be.
let countDownTimeOut: NodeJS.Timeout



export function CountDownProvider({children}: CountDownProviderProps) {

    const { startNewChallenge } = useContext(ChallengesContext)

    const [time, setTime] = useState(INITIAL_TIME)
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false)

    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    function startCountDown () {
        setIsActive(true)
    }

    function resetCountDown () {
        clearTimeout(countDownTimeOut)
        setIsActive(false)
        setHasFinished(false)
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
            startNewChallenge()
        }
    }, [isActive, time])

    return (
        <CountDownContext.Provider
            value={
                {
                    minutes,
                    seconds,
                    hasFinished,
                    isActive,
                    startCountDown,
                    resetCountDown
                }
            }
        >
            {children}
        </CountDownContext.Provider>
    )
}