export type DayActivity = {
    time: string;
    place: string;
    description: string;
    estimated_cost: string;
};

export type DayPlan = {
    day: number;
    title: string;
    activities: DayActivity[];
    total_cost: string;
};

export type PlanResult = {
    days: DayPlan[];
    total_budget_estimate: string;
    tips: string;
};

export type PlanMeta = {
    durasi: number | string;
    budget: string;
    minat?: string | null;
};
