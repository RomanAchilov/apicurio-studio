import * as React from "react";

import { cn } from "../lib/utils";

export interface OutlineItem {
    id: string;
    label: string;
    path: string;
    badge?: string;
    icon?: React.ReactNode;
    children?: OutlineItem[];
}

export interface OutlineTreeProps {
    items: OutlineItem[];
    selectedPath?: string;
    onSelect?: (item: OutlineItem) => void;
    className?: string;
}

function OutlineNode({ item, selectedPath, onSelect }: { item: OutlineItem; selectedPath?: string; onSelect?: (item: OutlineItem) => void }): React.ReactElement {
    const isSelected = selectedPath === item.path;

    return (
        <li>
            <button
                type="button"
                className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition",
                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => onSelect?.(item)}
            >
                <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                </span>
                {item.badge && <span className="text-xs text-muted-foreground">{item.badge}</span>}
            </button>
            {item.children && item.children.length > 0 && (
                <ul className="mt-1 space-y-1 border-l border-border pl-3">
                    {item.children.map(child => (
                        <OutlineNode key={child.id} item={child} selectedPath={selectedPath} onSelect={onSelect} />
                    ))}
                </ul>
            )}
        </li>
    );
}

export const OutlineTree: React.FC<OutlineTreeProps> = ({ items, selectedPath, onSelect, className }) => (
    <ul className={cn("space-y-1", className)}>
        {items.map(item => (
            <OutlineNode key={item.id} item={item} selectedPath={selectedPath} onSelect={onSelect} />
        ))}
    </ul>
);
