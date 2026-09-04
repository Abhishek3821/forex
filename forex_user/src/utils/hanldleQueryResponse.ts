import { toast } from "react-toastify";
export const createMutationHandlers = (...args: any[]) => {
    return {
        onSuccess: (res: any) => {
            args.forEach(e => typeof e === "function" && e())
            toast.success(res.message || "Action Completed");
        },
        onError: (error: any) => {
            const errorResponse =
                error?.response?.data ||
                error?.data ||
                (error instanceof Error ? { message: error.message } : null);
            const finalMessage =
                (Array.isArray(errorResponse?.errors) && errorResponse.errors.join(", ")) ||
                errorResponse?.message ||
                errorResponse?.error;
            toast.error(finalMessage);
        },
    };
};
