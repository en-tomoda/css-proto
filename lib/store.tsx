"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  MEMBERS,
  ACCOUNTS,
  CURRENT_USER_ID,
  REPLACEMENT_ACTIONS,
  MANAGER_NOTICES,
  type Member,
  type Role,
  type Account,
  type DisclosureKey,
  type ManagerNotice,
} from "@/lib/data";

const today = () => new Date().toISOString().slice(0, 10);

type AppState = {
  role: Role | null;
  login: (r: Role) => void;
  logout: () => void;
  onboarded: boolean;
  completeOnboarding: (goal: string, actions: string[]) => void;
  /** 初回設定を未完了状態に戻す（初回設定体験ログイン用） */
  resetOnboarding: () => void;
  members: Member[];
  currentUser: Member;
  toggleAction: (memberId: string, actionId: string) => void;
  /** 目標を手動更新する（履歴に追記し、開示中ならロック確認を出す） */
  updateGoal: (goal: string, careerPath: string) => void;
  /** アクションを理由付きでキャンセルし、代わりの提案を追加する */
  cancelAction: (memberId: string, actionId: string, reason: string, note?: string) => void;
  requestDisclosure: (memberId: string, key: DisclosureKey) => void;
  respondDisclosure: (memberId: string, key: DisclosureKey, approve: boolean) => void;
  /** 開示済みの情報をメンバー自身が再ロックする（理由は上司に通知される） */
  relockDisclosure: (memberId: string, key: DisclosureKey, reason?: string) => void;
  /** 上司向け通知（メンバーのロック操作など） */
  managerNotices: ManagerNotice[];
  dismissManagerNotice: (id: string) => void;
  /** 目標が変わった直後に「開示情報をロックしますか？」を出すフラグ */
  goalChangePrompt: boolean;
  resolveGoalChangePrompt: (lockAll: boolean) => void;
  accounts: Account[];
  setAccounts: (a: Account[]) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [goalChangePrompt, setGoalChangePrompt] = useState(false);
  const [managerNotices, setManagerNotices] = useState<ManagerNotice[]>(MANAGER_NOTICES);

  useEffect(() => {
    setOnboarded(localStorage.getItem("css-proto-onboarded") === "1");
    const savedRole = localStorage.getItem("csas-role");
    if (savedRole === "member" || savedRole === "manager" || savedRole === "admin") {
      setRole(savedRole);
    }
    setHydrated(true);
  }, []);

  const login = useCallback((r: Role) => {
    localStorage.setItem("csas-role", r);
    setRole(r);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("csas-role");
    setRole(null);
  }, []);

  const completeOnboarding = useCallback((goal: string, actions: string[]) => {
    setMembers((prev) => {
      const me = prev.find((m) => m.id === CURRENT_USER_ID);
      // 目標が変わるタイミングで、開示中の情報があればロック確認を出す
      if (me && Object.values(me.disclosure).some((s) => s === "approved")) {
        setGoalChangePrompt(true);
      }
      return prev.map((m) =>
        m.id === CURRENT_USER_ID
          ? {
              ...m,
              goal,
              goalHistory: [
                ...m.goalHistory,
                { goal, careerPath: m.careerPath, setAt: today() },
              ],
              currentActions: actions.map((title, i) => ({
                id: `new-${i}`,
                title,
                done: false,
                carriedWeeks: 1,
              })),
            }
          : m,
      );
    });
    localStorage.setItem("css-proto-onboarded", "1");
    setOnboarded(true);
  }, []);

  const updateGoal = useCallback((goal: string, careerPath: string) => {
    // 目標を更新したら常に「開示情報のロック確認」通知を出す
    setGoalChangePrompt(true);
    setMembers((prev) =>
      prev.map((m) =>
        m.id === CURRENT_USER_ID
          ? {
              ...m,
              goal,
              careerPath,
              goalHistory: [...m.goalHistory, { goal, careerPath, setAt: today() }],
            }
          : m,
      ),
    );
  }, []);

  const cancelAction = useCallback(
    (memberId: string, actionId: string, reason: string, note?: string) => {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id !== memberId) return m;
          const target = m.currentActions.find((a) => a.id === actionId);
          if (!target) return m;
          const replacement =
            REPLACEMENT_ACTIONS[m.cancelledActions.length % REPLACEMENT_ACTIONS.length];
          return {
            ...m,
            currentActions: [
              ...m.currentActions.filter((a) => a.id !== actionId),
              { id: `r-${Date.now()}`, title: replacement, done: false, carriedWeeks: 1 },
            ],
            cancelledActions: [
              ...m.cancelledActions,
              { title: target.title, reason, note, cancelledAt: today() },
            ],
          };
        }),
      );
    },
    [],
  );

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem("css-proto-onboarded");
    setOnboarded(false);
  }, []);

  const toggleAction = useCallback((memberId: string, actionId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              currentActions: m.currentActions.map((a) =>
                a.id === actionId ? { ...a, done: !a.done } : a,
              ),
            }
          : m,
      ),
    );
  }, []);

  const requestDisclosure = useCallback((memberId: string, key: DisclosureKey) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId && m.disclosure[key] === "locked"
          ? { ...m, disclosure: { ...m.disclosure, [key]: "requested" } }
          : m,
      ),
    );
  }, []);

  const respondDisclosure = useCallback(
    (memberId: string, key: DisclosureKey, approve: boolean) => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                disclosure: {
                  ...m.disclosure,
                  [key]: approve ? "approved" : "locked",
                },
              }
            : m,
        ),
      );
    },
    [],
  );

  const relockDisclosure = useCallback(
    (memberId: string, key: DisclosureKey, reason?: string) => {
      const target = members.find((m) => m.id === memberId);
      if (!target || target.disclosure[key] !== "approved") return;
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, disclosure: { ...m.disclosure, [key]: "locked" } }
            : m,
        ),
      );
      // 上司へ理由付きで通知
      setManagerNotices((prev) => [
        {
          id: `n-${Date.now()}-${key}`,
          memberId,
          memberName: target.name,
          key,
          reason,
          at: today(),
        },
        ...prev,
      ]);
    },
    [members],
  );

  const dismissManagerNotice = useCallback((id: string) => {
    setManagerNotices((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const resolveGoalChangePrompt = useCallback(
    (lockAll: boolean) => {
      if (lockAll) {
        const me = members.find((m) => m.id === CURRENT_USER_ID);
        const approvedKeys = me
          ? (Object.keys(me.disclosure) as DisclosureKey[]).filter(
              (k) => me.disclosure[k] === "approved",
            )
          : [];
        setMembers((prev) =>
          prev.map((m) =>
            m.id === CURRENT_USER_ID
              ? {
                  ...m,
                  disclosure: Object.fromEntries(
                    Object.entries(m.disclosure).map(([k, v]) => [
                      k,
                      v === "approved" ? "locked" : v,
                    ]),
                  ) as Member["disclosure"],
                }
              : m,
          ),
        );
        if (me && approvedKeys.length > 0) {
          setManagerNotices((prev) => [
            ...approvedKeys.map((k) => ({
              id: `n-${Date.now()}-${k}`,
              memberId: me.id,
              memberName: me.name,
              key: k,
              reason: "目標を変更したため",
              at: today(),
            })),
            ...prev,
          ]);
        }
      }
      setGoalChangePrompt(false);
    },
    [members],
  );

  const currentUser = members.find((m) => m.id === CURRENT_USER_ID)!;

  if (!hydrated) return null;

  return (
    <AppContext.Provider
      value={{
        role,
        login,
        logout,
        onboarded,
        completeOnboarding,
        resetOnboarding,
        members,
        currentUser,
        toggleAction,
        updateGoal,
        cancelAction,
        requestDisclosure,
        respondDisclosure,
        relockDisclosure,
        managerNotices,
        dismissManagerNotice,
        goalChangePrompt,
        resolveGoalChangePrompt,
        accounts,
        setAccounts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
