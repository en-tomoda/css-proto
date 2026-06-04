import { ProfileHeader }           from "@/components/profile/profile-header";
import { SelectabilityScoreCard }  from "@/components/profile/selectability-score-card";
import { ProfileCategories }       from "@/components/profile/profile-categories";

export default function ProfilePage() {
  return (
    <div className="min-h-full bg-muted/40 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-5">
        <ProfileHeader />
        <SelectabilityScoreCard />
        <ProfileCategories />
        <p className="pb-4 text-center text-xs text-muted-foreground">
          対話を重ねるほど、プロフィールはより深く更新されます。
        </p>
      </div>
    </div>
  );
}
