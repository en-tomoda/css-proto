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
  const motionSections = [
    {
      key: "top",
      content: (
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr_280px]">
          <GreetingCard />
          <div className="space-y-4">
            <XpCard />
            <WeeklySummaryCard />
          </div>
        </div>
      ),
    },
    {
      key: "question",
      content: <DailyQuestionCard />,
    },
    {
      key: "middle",
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DailyMissionsCard />
          <div className="space-y-4">
            <GrowthMetricsGrid />
            <AchievementBadges />
          </div>
        </div>
      ),
    },
    {
      key: "bottom",
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RecentInsightsCard />
          <YearAgoTodayCard />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-full bg-muted/40 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {motionSections.map((section, index) => (
          <section
            key={section.key}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${index * 120}ms`, animationFillMode: "both" }}
          >
            {section.content}
          </section>
        ))}
      </div>
    </div>
  );
}
