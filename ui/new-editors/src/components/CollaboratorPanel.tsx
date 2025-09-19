import * as React from "react";

import { type ApiEditorUser } from "../protocol/messages";
import { type EditorBridge } from "../hooks/useEditorBridge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";

export interface CollaboratorSelection {
    user: ApiEditorUser;
    selection?: string | null;
}

export interface CollaboratorPanelProps {
    collaborators?: CollaboratorSelection[];
    bridge?: Pick<EditorBridge, "emitCollaboratorSelection" | "emitSelectionChanged">;
    className?: string;
    title?: string;
}

function initialsFromName(name: string): string {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) {
        return name.substring(0, 2).toUpperCase();
    }
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const CollaboratorPanel: React.FC<CollaboratorPanelProps> = ({
    collaborators = [],
    bridge,
    className,
    title = "Collaborators"
}) => {
    const onSelectCollaborator = (selection?: string | null): void => {
        if (selection) {
            bridge?.emitSelectionChanged(selection);
        }
    };

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {collaborators.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-8 text-center text-sm text-muted-foreground">
                        <p>No other editors are connected.</p>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[240px]">
                        <ul className="space-y-2 px-4 py-3 text-sm">
                            {collaborators.map(({ user, selection }) => {
                                const color = user.attributes?.color ? `#${user.attributes.color}` : undefined;
                                return (
                                    <li
                                        key={user.userId}
                                        className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-2 shadow-sm transition hover:border-primary"
                                        onClick={() => onSelectCollaborator(selection)}
                                    >
                                        <Avatar initials={initialsFromName(user.fullName ?? user.userName)} color={color} />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.fullName ?? user.userName}</span>
                                            {selection && (
                                                <span className="text-xs text-muted-foreground">{selection}</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};
