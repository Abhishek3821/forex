import { useState } from "react";
const useSearch = () => {
  const default_month = getMonthRangeWithOffset()
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string>(default_month.startDate ?? "");
  const [endDate, setEndDate] = useState<string>(default_month.endDate ?? "");
  const [book, setBook] = useState<"A Book" | null | "B Book">("B Book");
  const [accountType, setAccountType] = useState<"live" | "demo">("live");
  const [mode, setMode] = useState<any>('dep');
  const [countryCode, setCountryCode] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive" | "expired" | "">("");
  return {
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setCountryCode,
    countryCode,
    setEndDate,
    book, setBook,
    setAccountType, accountType,
    setStatus,
    status,
    setMode,
    mode
  };
};

export default useSearch;

const getMonthRangeWithOffset = () => {
  const now = new Date();

  // IST offset = UTC + 5:30 = 330 minutes
  const IST_OFFSET = 330;

  const toISTDate = (date: Date) =>
    new Date(date.getTime() + IST_OFFSET * 60 * 1000);

  // Start of month (local logic, then offset)
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const format = (date: Date) =>
    toISTDate(date).toISOString().split("T")[0];

  return {
    startDate: format(start),
    endDate: format(end),
  };
};

