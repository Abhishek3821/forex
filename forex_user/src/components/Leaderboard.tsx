import type React from "react";
import { useState } from "react";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
import ButtonBar from "../screens/ButtonBar";
import { leaderboardButtonList } from "../constant";
import MasterLeaderboard from "./MasterLeaderboard";
import type { MasterMode } from "../hooks/useMaster";

type LeaderboardTab = {
    main: string | null;
    sub: string | null;
};

const modeMap: Record<string, MasterMode> = {
    mam: "MAM",
    pamm: "PAMM",
    copy_trading: "COPY",
};

const LearderBoard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LeaderboardTab>({
        main: leaderboardButtonList[0]?.id ?? null,
        sub: leaderboardButtonList[0]?.subButtons?.[0]?.id ?? null,
    });
    const activeMode = modeMap[activeTab.main ?? "mam"] ?? "MAM";

    return (
        <MotionWrapper>
            <PageHeadline
                title="Leaderboard"
                subtitle="Welcome back! Here's an overview of your trading account."
            />
            <ButtonBar
                items={leaderboardButtonList}
                onActiveChange={setActiveTab}
            />
            <div className="sm:p-3 p-1">
                <MasterLeaderboard mode={activeMode} />
            </div>
        </MotionWrapper>
    )
};
export default LearderBoard;
