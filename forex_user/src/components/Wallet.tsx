import type React from "react";
import { useState } from "react";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
import ButtonBar from "../screens/ButtonBar";
import { walletManagementButtonList } from "../constant";
import DepositList from "./DepositList";
import WithdrawList from "./Withdrawlist";
import InternalTransfer from "./InternalTransfer";
import CreateWithdraw from "../screens/CreateWithdraw";
import CreateDeposit from "../screens/CreateDeposit";
type WalletTab = {
    main: string | null;
    sub: string | null;
};
const WalletManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<WalletTab>({
        main: walletManagementButtonList[0]?.id ?? null,
        sub: walletManagementButtonList[0]?.subButtons?.[0]?.id ?? null,
    });

    const renderActiveTab = () => {
        if (activeTab.main === "deposit" && activeTab.sub === "history") {
            return <DepositList />;
        }

        if (activeTab.main === "deposit" && activeTab.sub === "new") {
            return <CreateDeposit />;
        }

        if (activeTab.main === "withdraw" && activeTab.sub === "history") {
            return <WithdrawList />;
        }

        if (activeTab.main === "withdraw" && activeTab.sub === "new") {
            return <CreateWithdraw />;
        }

        if (activeTab.main === "transfer" && activeTab.sub === "history") {
            return <InternalTransfer mode="history" />;
        }

        if (activeTab.main === "transfer" && activeTab.sub === "new") {
            return <InternalTransfer mode="new" />;
        }

        return null;
    };

    return (
        <MotionWrapper>
            <PageHeadline
                title="Wallet Management"
                subtitle="Track your deposits and withdrawals from one place."
            />
            <ButtonBar
                items={walletManagementButtonList}
                onActiveChange={setActiveTab}
            />
            <div className="sm:p-3 p-1">
                {renderActiveTab()}
            </div>
        </MotionWrapper>
    )
};
export default WalletManagement;
