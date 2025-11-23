import { AxiosInstance } from "axios";
import {
  ChallengeSubmission,
  SubmissionStatus,
  UserDashboardStats,
  UserSummary,
} from "./types";

function calcCurrentStreakDays(datesIso: string[]): number {
  if (datesIso.length === 0) return 0;
  const toDayKey = (d: Date) => d.toISOString().slice(0, 10);

  const days = new Set(datesIso.map((iso) => toDayKey(new Date(iso))));
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = toDayKey(d);
    if (days.has(key)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export class DashboardApi {
  constructor(private http: AxiosInstance) {}

  async getMyStats(): Promise<UserDashboardStats> {
    const { data: submissions } = await this.http.get<ChallengeSubmission[]>(
      "/challenges/submissions/my"
    );

    const videosUploaded = submissions.length;
    const completedChallenges = submissions.filter(
      (s) => s.status === ("APPROVED" as SubmissionStatus)
    ).length;
    const currentStreakDays = calcCurrentStreakDays(
      submissions.map((s) => s.createdAt)
    );

    const { data: me } = await this.http.get<
      UserSummary & { rank?: number | null }
    >("/auth/me");

    return {
      completedChallenges,
      currentStreakDays,
      videosUploaded,
      globalRank: typeof me.rank === "number" ? me.rank : me.rank ?? null,
    };
  }
}
