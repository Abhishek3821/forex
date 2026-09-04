import MotionWrapper from "../screens/Motion";
import { Children, Fragment, isValidElement, type ReactNode } from "react";

type PageHeadlineProps = {
    title: string;
    subtitle?: string;
    children?: ReactNode;
};

export default function PageHeadline({
    title,
    subtitle,
    children,
}: PageHeadlineProps) {
    const hasActions = Children.toArray(children).some((child) => {
        if (child === null || child === undefined || typeof child === "boolean") {
            return false;
        }

        if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
            return Children.count(child.props.children) > 0;
        }

        return true;
    });

    return (
        <MotionWrapper className="border-b border-border bg-background px-2.5 py-2 sm:px-4 sm:py-3 lg:px-5">
            <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="h-4 w-1 rounded-full bg-primary sm:h-5" />

                        <h1 className="truncate text-base font-bold text-text sm:text-xl">
                            {title}
                        </h1>
                    </div>

                    {subtitle && (
                        <p className="mt-0.5 max-w-3xl truncate whitespace-nowrap text-xs leading-4 text-text-secondary sm:mt-1 sm:text-sm sm:leading-5">
                            {subtitle}
                        </p>
                    )}
                </div>

                {hasActions && (
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2 md:justify-end">
                        {children}
                    </div>
                )}
            </div>
        </MotionWrapper>
    );
}