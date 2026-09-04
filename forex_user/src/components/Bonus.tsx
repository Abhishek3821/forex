import type React from "react";
import { useMemo, useState } from "react";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
import ButtonBar from "../screens/ButtonBar";
import { bonusManagementList } from "../constant";
import {
    useBonusList,
    useRedeemBonusList,
    type BonusItem,
} from "../hooks/useBonus";

const getBonusTitle = (bonus: BonusItem) =>
    bonus.title || bonus.name || bonus.bonusName || "Bonus";

const formatAmount = (value: unknown) => {
    if (typeof value !== "number") return "N/A";
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
    }).format(value);
};

const BonusCard = ({ bonus }: { bonus: BonusItem }) => (
    <article className="rounded-xl border border-border bg-card p-3 transition hover:bg-card-hover">
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-text">
                    {getBonusTitle(bonus)}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                    {bonus.description || "Bonus details will appear here when available."}
                </p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold capitalize text-primary-light">
                {bonus.status || bonus.type || "active"}
            </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-border bg-background px-2 py-2">
                <p className="text-[10px] uppercase text-text-muted">Amount</p>
                <p className="mt-1 truncate text-xs font-semibold text-text">
                    {formatAmount(bonus.amount ?? bonus.bonusAmount)}
                </p>
            </div>
            <div className="rounded-lg border border-border bg-background px-2 py-2">
                <p className="text-[10px] uppercase text-text-muted">Percent</p>
                <p className="mt-1 truncate text-xs font-semibold text-text">
                    {bonus.percentage ? `${bonus.percentage}%` : "N/A"}
                </p>
            </div>
            <div className="rounded-lg border border-border bg-background px-2 py-2">
                <p className="text-[10px] uppercase text-text-muted">Max</p>
                <p className="mt-1 truncate text-xs font-semibold text-text">
                    {formatAmount(bonus.maxBonus)}
                </p>
            </div>
        </div>
    </article>
);

const Bonus: React.FC = () => {
    const [activeView, setActiveView] = useState<{
        main: string | null;
        sub: string | null;
    }>({
        main: bonusManagementList[0]?.id ?? "profile",
        sub: bonusManagementList[0]?.subButtons?.[0]?.id ?? null,
    });
    const bonusListQuery = useBonusList();
    const redeemBonusQuery = useRedeemBonusList();

    const availableBonuses = useMemo(
        () => bonusListQuery.data?.results ?? bonusListQuery.data?.data ?? [],
        [bonusListQuery.data]
    );
    const redeemedBonuses = useMemo(
        () =>
            redeemBonusQuery.data?.results ?? redeemBonusQuery.data?.data ?? [],
        [redeemBonusQuery.data]
    );

    const showingRedeemed =
        activeView.sub === "claimed" ||
        activeView.sub === "history" ||
        activeView.main === "earnings";
    const visibleBonuses = showingRedeemed
        ? redeemedBonuses
        : availableBonuses;
    const activeQuery = showingRedeemed ? redeemBonusQuery : bonusListQuery;

    return (
        <MotionWrapper>
            <PageHeadline
                title="Bonus"
                subtitle="Track available and redeemed trading bonuses."
            />
            <ButtonBar
                items={bonusManagementList}
                onActiveChange={(active) => setActiveView(active)}
            />

            <div className="grid gap-3 p-2 sm:grid-cols-3 sm:p-3">
                <div className="rounded-xl border border-border bg-surface p-3">
                    <p className="text-xs text-text-muted">Available Bonuses</p>
                    <p className="mt-2 text-2xl font-bold text-text">
                        {availableBonuses.length}
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                    <p className="text-xs text-text-muted">Redeemed Bonuses</p>
                    <p className="mt-2 text-2xl font-bold text-text">
                        {redeemedBonuses.length}
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                    <p className="text-xs text-text-muted">Current View</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-text">
                        {showingRedeemed ? "Redeemed" : "Available"}
                    </p>
                </div>
            </div>

            <section className="p-2 pt-0 sm:p-3 sm:pt-0">
                {activeQuery.isLoading ? (
                    <div className="rounded-xl border border-border bg-surface p-4 text-sm text-text-secondary">
                        Loading bonuses...
                    </div>
                ) : activeQuery.isError ? (
                    <div className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
                        Unable to load bonus data.
                    </div>
                ) : visibleBonuses.length ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {visibleBonuses.map((bonus, index) => (
                            <BonusCard key={bonus._id || String(index)} bonus={bonus} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-surface p-6 text-center">
                        <p className="text-sm font-semibold text-text">
                            No {showingRedeemed ? "redeemed" : "available"} bonuses found
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                            Bonus data will appear here after the API returns records.
                        </p>
                    </div>
                )}
            </section>
        </MotionWrapper>
    );
};

export default Bonus;
