import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useUser } from "../constant/UserProvider";
import GuideIndicator from "./GuideIndicator";
import SelectBar, { type SelectBarOption } from "./SelectBar";
import EditTradeAccountModel from "./TradingAccountModal";
import useModal from "../hooks/useModal";

interface TradeAccountSwitchBarProps {
    className?: string;
}

const TradeAccountSwitchBar = ({
    className = "",
}: TradeAccountSwitchBarProps) => {
    const { closeModal, openModal, isModalOpen } = useModal();

    const {
        tradeAccountList,
        activeTradeAccount,
        setActiveTradeAccount,
        refetchTradeAccounts,
    } = useUser();

    const accountOptions: SelectBarOption[] = tradeAccountList.map(
        (account) => ({
            label: account.accountID,
            value: account._id,
            icon:
                account.accountType === "live"
                    ? "verified"
                    : "science",
            description: `${account.accountType.toUpperCase()} · ${Number(
                account.balance ?? 0
            ).toFixed(2)} ${account.currency || "USD"}`,
        })
    );

    const handleAccountChange = (accountId: string) => {
        if (
            !accountId ||
            accountId === activeTradeAccount?._id
        ) {
            return;
        }

        setActiveTradeAccount(accountId);
        toast.success("Account switched successfully");
        window.location.reload();
    };

    const onCreateAccount = () => {
        openModal({ is_user: true });
    };

    return (
        <div
            className={`
                flex
                w-full
                items-center
                gap-1.5
                sm:w-auto
                sm:gap-2
                ${className}
            `}
        >
            {/* Trade Account Section */}
            <div
                className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-0.5
                    rounded-md
                    border
                    border-border
                    bg-card
                    p-0.5
                    sm:flex-none
                    sm:gap-1
                "
            >
                {tradeAccountList.length > 0 ? (
                    <SelectBar
                        label="Trade Account"
                        value={activeTradeAccount?._id ?? ""}
                        options={accountOptions}
                        onChange={handleAccountChange}
                        icon="account_balance"
                        className="
                            min-w-0
                            text-[10px]
                            sm:text-xs
                        "
                        menuClassName="
                            left-0
                            right-auto
                            w-52
                            sm:w-60
                        "
                    />
                ) : (
                    <span
                        className="
                            px-1.5
                            text-[10px]
                            text-text-muted
                            sm:px-2
                            sm:text-xs
                        "
                    >
                        No account
                    </span>
                )}

                <div className="h-4 w-px shrink-0 bg-border sm:h-5" />

                {/* Create Account */}
                <div className="relative flex shrink-0 items-center">
                    <GuideIndicator
                        show={tradeAccountList.length === 0}
                        title="Create your first account"
                        direction="right"
                    />

                    <button
                        type="button"
                        onClick={onCreateAccount}
                        title="Create Account"
                        className="
                            flex
                            h-7
                            items-center
                            justify-center
                            gap-1
                            rounded
                            bg-primary
                            px-1.5
                            text-[10px]
                            font-semibold
                            text-white
                            transition-all

                            hover:bg-primary-hover
                            active:scale-95

                            sm:h-8
                            sm:px-2
                            sm:text-xs
                        "
                    >
                        <span
                            className="
                                material-symbols-outlined
                                text-[15px]
                                sm:text-[17px]
                            "
                        >
                            add
                        </span>

                        <span className="hidden md:inline">
                            New
                        </span>
                    </button>
                </div>

                <EditTradeAccountModel
                    isOpen={isModalOpen.is_user || false}
                    closeModal={() =>
                        closeModal({ is_user: false })
                    }
                    isAdd={true}
                    refetch={refetchTradeAccounts}
                />
            </div>

            {/* Deposit */}
            <Link
                to="/wallet/deposit"
                title="Deposit"
                className="
                    inline-flex
                    h-8
                    shrink-0
                    items-center
                    justify-center
                    gap-1
                    rounded-md
                    border
                    border-border
                    bg-primary
                    px-2
                    text-[10px]
                    font-semibold
                    text-white
                    transition-all

                    hover:bg-primary-hover
                    active:scale-95

                    sm:h-9
                    sm:px-2.5
                    sm:text-xs
                "
            >
                <span
                    className="
                        material-symbols-outlined
                        text-[15px]
                        sm:text-[17px]
                    "
                >
                    account_balance_wallet
                </span>
                <span className="hidden sm:inline">
                    Deposit
                </span>
            </Link>
        </div>
    );
};

export default TradeAccountSwitchBar;