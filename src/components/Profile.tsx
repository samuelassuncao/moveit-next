import { useContext } from "react"
import { ChallengesContext } from "../contexts/ChallengesContext"
import styles from "../styles/components/Profile.module.css"

/**
 * # Future implementation: User can choose their profile pic and name
 *   If user doesn't want a pic, implement cartoon avatar that user can choose
 * # Future implementation: login system
 */

export function Profile () {
    const { level } = useContext(ChallengesContext)
    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/samuelassuncao.png" alt="Samuel Assunção"/>
            <div>
                <strong>Samuel Assunção</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    )
}