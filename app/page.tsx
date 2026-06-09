import { GreetingCard }       from "@/components/home/greeting-card";
import { XpCard }             from "@/components/home/xp-card";
import { DailyQuestionCard }  from "@/components/home/daily-question-card";
import { DailyMissionsCard }  from "@/components/home/daily-missions-card";
import { GrowthMetricsGrid }  from "@/components/home/growth-metrics-grid";
import { AchievementBadges }  from "@/components/home/achievement-badges";
import { RecentInsightsCard } from "@/components/home/recent-insights-card";
import { YearAgoTodayCard }    from "@/components/home/year-ago-today-card";
import { WeeklySummaryCard }  from "@/components/home/weekly-summary-card";

export default function HomePage() {
  return (
    <div className="min-h-full bg-muted/40 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-4">

        {/* 上段: 挨拶 + XP */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr_280px]">
          <GreetingCard />
          <div className="space-y-4">
            <XpCard />
            <WeeklySummaryCard />
          </div>
        </div>

        {/* 今日の問い */}
        <DailyQuestionCard />

        {/* 中段: ミッション + 成長指標 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DailyMissionsCard />
          <div className="space-y-4">
            <GrowthMetricsGrid />
            <AchievementBadges />
          </div>
        </div>

        {/* 下段: 気づき + 1年前 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RecentInsightsCard />
          <YearAgoTodayCard />
        </div>

      </div>
    </div>
  );
}
