import * as React from "react";

import { type EditorBridge } from "../hooks/useEditorBridge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";

export interface EditorToolbarProps {
    bridge?: Pick<EditorBridge, "emitCommandUndo" | "emitCommandRedo" | "emitValidationRequested">;
    className?: string;
    undoDisabled?: boolean;
    redoDisabled?: boolean;
    isDirty?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    onValidate?: () => void;
    onSave?: () => void;
    saveLabel?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    bridge,
    className,
    undoDisabled,
    redoDisabled,
    isDirty,
    onUndo,
    onRedo,
    onValidate,
    onSave,
    saveLabel = "Save"
}) => {
    const handleUndo = (): void => {
        bridge?.emitCommandUndo();
        onUndo?.();
    };

    const handleRedo = (): void => {
        bridge?.emitCommandRedo();
        onRedo?.();
    };

    const handleValidate = (): void => {
        bridge?.emitValidationRequested();
        onValidate?.();
    };

    return (
        <div className={cn("flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 shadow-sm", className)}>
            <Button variant="ghost" size="sm" disabled={undoDisabled} onClick={handleUndo}>
                Undo
            </Button>
            <Button variant="ghost" size="sm" disabled={redoDisabled} onClick={handleRedo}>
                Redo
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="outline" size="sm" onClick={handleValidate}>
                Validate
            </Button>
            <div className="flex-1" />
            <Button size="sm" disabled={!isDirty} onClick={onSave}>
                {saveLabel}
            </Button>
        </div>
    );
};
