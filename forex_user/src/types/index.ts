export interface SubButtonItem {
    id: string;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}
export interface ButtonItem {
    id: string;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    subButtons?: SubButtonItem[];
}

export interface ButtonBarProps {
    items: ButtonItem[];
    className?: string;
    onActiveChange?: (active: { main: string | null; sub: string | null }) => void;
}

export interface NavItem {
    name: string;
    icon: string;
    link: string;
}
