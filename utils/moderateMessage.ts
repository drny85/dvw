// You need to install the 'node-fetch' package if you haven't already.

const API_KEY = 'AIzaSyCFE5Dr0N39MZotCMpkxfeuE1fpdlUfAJA' // Replace with your API key
const PERSPECTIVE_API_URL =
    'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'

export async function analyzeTextForToxicity(text: string): Promise<boolean> {
    const request = {
        comment: {
            text
        },
        languages: ['en'], // Specify the language of the text
        requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {}
        }
    }

    const response = await fetch(`${PERSPECTIVE_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.status === 200) {
        const data = await response.json()

        const result = Object.values(data.attributeScores).map((k: any) => {
            return k.summaryScore.value
        })
        let answer: boolean = false
        for (const key in result) {
            const score = result[key]
            if (score >= 0.7) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    } else {
        throw new Error(
            `Perspective API request failed with status code ${response.status}`
        )
    }
}

// Example usage
// const textToAnalyze = "You're an idiot!"
// analyzeTextForToxicity(textToAnalyze)
//     .then((toxicityScore) => {
//         console.log(`Toxicity score: ${toxicityScore}`)
//         if (toxicityScore >= 0.7) {
//             console.log('This text is toxic and should be moderated.')
//         } else {
//             console.log('This text is not toxic.')
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error)
//     })
