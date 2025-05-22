"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card"
import { useState } from "react"
import { GetStats } from "@/data/data"
import { Button } from "./ui/button"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


const WordStats = (props: {
  wordId: number
}) => {

  const [visible, setVisible] = useState<boolean>(false)
  const [stats, setStats] = useState<any | null>(null)

  async function fetchStats() {
    const res = await GetStats(props.wordId)
    setStats(res)
  }

  if (!visible) {
    return (
      <Button
        className="text-blue-500 text-md whitespace-nowrap inline-flex items-center gap-1"
        variant='link'
        onClick={() => {
          fetchStats()
          setVisible(prev => !prev)
        }}
      >
        Stats <ArrowUpRight size={18} />
      </Button>
    )

  }
  return (
    <div className="flex justify-center p-2 pr-3 mb-2">
      <Card className="max-w-fit relative">
        <CardHeader>
          <CardTitle>Global Stats</CardTitle>
          <CardDescription>See how you stack up against others on this word.</CardDescription>
        </CardHeader>
        <CardContent>
          {stats
            ? <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={stats.histogram}
                layout="vertical"
                margin={{
                  left: -20,
                  right: 40,
                }}
              >
                <XAxis type="number" dataKey="count" hide />
                <YAxis
                  dataKey="amount"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={5} />
              </BarChart>
            </ChartContainer>
            : <div className="flex justify-center items-center gap-1.5 min-h-10 text-muted-foreground">
              <Loader2 className="animate-spin" size={"20px"} />
            </div>}
        </CardContent>
        {stats
          ?
          <CardFooter>
            <p className="leading-none tracking-tight">
              {stats.winPercentage}% Win Rate ({stats.totalAttempts} attempts)
            </p>
          </CardFooter>
          : <></>}
        <Button
          className="bg-blue-500 hover:bg-blue-600 absolute -top-2 -right-2"
          size={'smCircle'}
          variant={'outline'}
          onClick={() => {
            setVisible(prev => !prev)
          }}
        >
          <ArrowDownLeft size={20} />
        </Button>
      </Card>
    </div>
  )
}

export { WordStats }