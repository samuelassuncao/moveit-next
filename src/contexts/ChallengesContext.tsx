import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import { LevelUpDialog } from "../components/LevelUpDialog";

type ChallengesProviderProps = {
  children: ReactNode
  level: number
  currentExperience: number
  challengesCompleted: number
}

type Challenge = {
  type: "body" | "eye"
  description: string
  amount: number
}

interface ChallengesContextData {
    level: number
    currentExperience: number
    challengesCompleted: number
    activeChallenge: Challenge | null
    experienceToNextLevel: number
    levelUp: () => void
    startNewChallenge: () => void 
    resetChallenge: () => void
    completeChallenge: () => void
    handleCloseLevelUpModal: () => void
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({
    children,
    ...props
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(props.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(props.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(props.challengesCompleted ?? 0)

    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) *4, 2)

    useEffect(()=> {
        Cookies.set("level", String(level))
        Cookies.set("currentExperience", String(currentExperience))
        Cookies.set("challengesCompleted", String(challengesCompleted))
    }, [level, currentExperience, challengesCompleted])

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission()
        }
    }, [])

    function levelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function handleCloseLevelUpModal() {
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex] as Challenge

        setActiveChallenge(challenge)

        const notificationAudio = new Audio('/notification.mp3')
        notificationAudio.play().catch(() => {})

        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Novo desafio 🎉", {
                body: `Valendo ${challenge.amount} xp`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return
        }
        const { amount } = activeChallenge 

        let finalExperience = currentExperience + amount

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider
            value={
                {
                    level,
                    levelUp,
                    currentExperience,
                    challengesCompleted,
                    startNewChallenge,
                    activeChallenge,
                    resetChallenge,
                    experienceToNextLevel,
                    completeChallenge,
                    handleCloseLevelUpModal
                }}>
                {children}

                { isLevelUpModalOpen && <LevelUpDialog />}
        </ChallengesContext.Provider>
    )
}