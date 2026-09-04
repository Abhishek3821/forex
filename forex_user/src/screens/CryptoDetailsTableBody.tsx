import type { CryptoAddress } from "../hooks/useProfile";

interface CryptoDetailsTableBodyProps {
    data: CryptoAddress[];
    onEdit: (item: CryptoAddress) => void;
}

const getAddressValue = (address?: CryptoAddress | null) =>
    address?.address || address?.walletAddress || "";

export default function CryptoDetailsTableBody({
    data,
    onEdit,
}: CryptoDetailsTableBodyProps) {
    return (
        <tbody className="divide-y divide-border">
            {data.map((item, index) => (
                <tr
                    key={item._id}
                    className="transition-colors hover:bg-card-hover"
                >
                    <td className="px-4 py-3 font-semibold">{index + 1}</td>

                    <td className="px-4 py-3 font-medium">
                        {item.coin || "N/A"}
                    </td>

                    <td className="px-4 py-3 text-text-secondary">
                        {item.symbol || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                        <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary-light">
                            {item.network || "N/A"}
                        </span>
                    </td>

                    <td className="max-w-[300px] px-4 py-3">
                        <span
                            className="block truncate text-text-secondary"
                            title={getAddressValue(item)}
                        >
                            {getAddressValue(item) || "N/A"}
                        </span>
                    </td>

                    <td className="px-4 py-3 text-text-secondary">
                        {item.label || "N/A"}
                    </td>

                    <td className="px-4 py-3 capitalize">
                        <span className="rounded bg-success/10 px-2 py-1 text-xs font-medium text-success">
                            {item.status || "active"}
                        </span>
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => onEdit(item)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-card-hover hover:text-primary"
                                title="Edit crypto address"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    edit
                                </span>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

