"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
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
          <CardTitle>Mistakes Made</CardTitle>
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
                  left: 20,
                  right: 20,
                }}
              >
                <YAxis
                  dataKey="amount"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  hide
                />
                <XAxis type="number" dataKey="count" hide />
                {/* <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                /> */}
                <Bar
                  dataKey="count"
                  layout="vertical"
                  fill="var(--color-count)"
                  radius={5} >
                  <LabelList
                    dataKey="count"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="amount"
                    position="left"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
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
          className="bg-blue-500 hover:bg-blue-600 absolute -top-2.5 -right-2.5"
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