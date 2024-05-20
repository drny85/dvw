import { SaleData } from '@/types'
import moment from 'moment'

export function calculateSalesGoals(
    userId: string,
    monthlyGoal: number,
    totalUnits: SaleData[]
): {
    weeklyGoal: { units: number; percentage: number }
    monthToDateGoal: { units: number; percentage: number }
    yearlyGoal: { units: number; percentage: number }
} {
    const daysInMonth = 30 // Assuming 30 days in a month
    // const weeksInMonth = 4 // Assuming 4 weeks in a month
    const monthsInYear = 12
    // Calculate goals
    const dailyGoalUnits = monthlyGoal / daysInMonth
    const weeklyGoalUnits = dailyGoalUnits * 6
    const yearlyGoalUnits = monthlyGoal * monthsInYear

    if (!totalUnits) throw new Error('totalUnits not found')

    const unitsSoldThisWeek = totalUnits
        .filter(
            (s) =>
                s.user.id === userId &&
                moment(s.createdAt).isBetween(
                    moment().startOf('week').add(1),
                    moment().endOf('week').add(1, 'day')
                )
        )
        .reduce((a, b) => a + b.numberOfLines, 0)

    const unitsSoldThisMonth = totalUnits
        .filter(
            (s) =>
                s.user.id === userId &&
                moment(s.createdAt).isBetween(
                    moment().startOf('month'),
                    moment().endOf('month')
                )
        )
        .reduce((a, b) => a + b.numberOfLines, 0)

    const unitsSoldThisYear = totalUnits
        .filter((s) => s.user.id === userId)
        .reduce((a, b) => a + b.numberOfLines, 0)

    // Get the current date
    const currentDate = new Date()
    const currentDayOfMonth = currentDate.getDate()

    // Calculate month to date goal
    //const monthToDateGoalUnits = dailyGoalUnits * currentDayOfMonth

    return {
        weeklyGoal: {
            units: weeklyGoalUnits,
            percentage: (unitsSoldThisWeek / weeklyGoalUnits) * 100
        },
        monthToDateGoal: {
            units: monthlyGoal,
            percentage: (unitsSoldThisMonth / monthlyGoal) * 100
        },
        yearlyGoal: {
            units: yearlyGoalUnits,
            percentage: (unitsSoldThisYear / (monthlyGoal * monthsInYear)) * 100
        }
    }
}
