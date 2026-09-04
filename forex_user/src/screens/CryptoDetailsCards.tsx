import type { CryptoAddress } from "../hooks/useProfile";

interface CryptoDetailsCardsProps {
    data: CryptoAddress[];
    onEdit: (item: CryptoAddress) => void;
}

const getAddressValue = (address?: CryptoAddress | null) =>
    address?.address || address?.walletAddress || "";

export default function CryptoDetailsCards({
    data,
    onEdit,
}: CryptoDetailsCardsProps) {
    return (
        <div className="space-y-2 p-2 md:hidden">
            {data.map((item, index) => (
                <div
                    key={item._id || index}
                    className="rounded-lg border border-border bg-card px-3 py-3 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-text-muted">
                                    #{index + 1}
                                </span>
                                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary-light">
                                    {item.network || "N/A"}
                                </span>
                            </div>
                            <p className="mt-2 truncate text-sm font-semibold text-text">
                                {item.label || item.coin || item.symbol || "Crypto Address"}
                            </p>
                            <p
                                className="mt-1 break-all text-xs leading-5 text-text-secondary"
                                title={getAddressValue(item)}
                            >
                                {getAddressValue(item) || "N/A"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-card-hover hover:text-primary"
                            title="Edit crypto address"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                edit
                            </span>
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md border border-border bg-surface px-2 py-2">
                            <p className="text-text-muted">Coin</p>
                            <p className="mt-1 truncate font-semibold text-text">
                                {item.coin || "N/A"}
                            </p>
                        </div>
                        <div className="rounded-md border border-border bg-surface px-2 py-2">
                            <p className="text-text-muted">Symbol</p>
                            <p className="mt-1 truncate font-semibold text-text">
                                {item.symbol || "N/A"}
                            </p>
                        </div>
                        <div className="rounded-md border border-border bg-surface px-2 py-2">
                            <p className="text-text-muted">Status</p>
                            <p className="mt-1 truncate font-semibold capitalize text-success">
                                {item.status || "active"}
                            </p>
                        </div>
                        <div className="rounded-md border border-border bg-surface px-2 py-2">
                            <p className="text-text-muted">Network</p>
                            <p className="mt-1 truncate font-semibold text-text">
                                {item.network || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

