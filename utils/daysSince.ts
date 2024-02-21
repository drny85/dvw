export function daysSinceMonthStarted(): number {
    const now: Date = new Date()
    const startOfMonth: Date = new Date(now.getFullYear(), now.getMonth(), 1)
    const daysSinceStart: number = Math.ceil(
        (now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)
    )
    const fullWeeks: number = Math.floor(daysSinceStart / 7)
    const remainingDays: number = daysSinceStart % 7

    // Assuming each week has 5 days
    const totalDays: number = fullWeeks * 5 + Math.min(remainingDays, 5)

    return totalDays
}
