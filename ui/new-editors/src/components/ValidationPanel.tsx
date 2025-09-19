import * as React from "react";
import { type ValidationProblem } from "@apicurio/data-models";

import { type EditorBridge } from "../hooks/useEditorBridge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

export interface ValidationPanelProps {
    problems?: ValidationProblem[];
    bridge?: Pick<EditorBridge, "emitSelectionChanged" | "emitValidationRequested" | "emitValidationResults">;
    className?: string;
    onProblemFocus?: (problem: ValidationProblem) => void;
    title?: string;
}

const severityVariant: Record<string, "default" | "secondary" | "outline"> = {
    error: "default",
    warning: "secondary",
    info: "outline"
};

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
    problems = [],
    bridge,
    className,
    onProblemFocus,
    title = "Validation"
}) => {
    const hasProblems = problems.length > 0;

    const normalizeNodePath = (problem: ValidationProblem): string | undefined => {
        const value = (problem as any).nodePath;
        if (!value) {
            return undefined;
        }
        if (typeof value === "string") {
            return value;
        }
        if (typeof value.toString === "function") {
            return value.toString();
        }
        return undefined;
    };

    const focusProblem = (problem: ValidationProblem): void => {
        const nodePath = normalizeNodePath(problem);
        if (nodePath) {
            bridge?.emitSelectionChanged(nodePath);
        }
        onProblemFocus?.(problem);
    };

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                <Badge variant={hasProblems ? "default" : "secondary"}>{problems.length}</Badge>
            </CardHeader>
            <CardContent className="p-0">
                {hasProblems ? (
                    <ScrollArea className="max-h-[320px]">
                        <ul className="space-y-2 px-4 py-3 text-sm">
                            {problems.map((problem, index) => {
                                const nodePath = normalizeNodePath(problem);
                                const key = nodePath ?? `${problem.errorCode}-${index}`;
                                return (
                                <li
                                    key={key}
                                    className="cursor-pointer rounded-md border border-border bg-background px-3 py-2 shadow-sm transition hover:border-primary"
                                    onClick={() => focusProblem(problem)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold capitalize">{problem.severity}</span>
                                        <Badge variant={severityVariant[problem.severity] ?? "outline"}>{problem.errorCode}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{problem.message}</p>
                                    {nodePath && (
                                        <p className="mt-1 text-xs text-muted-foreground">{nodePath}</p>
                                    )}
                                </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-sm text-muted-foreground">
                        <p>No validation problems detected.</p>
                        <button
                            type="button"
                            className="mt-3 text-primary underline-offset-4 hover:underline"
                            onClick={() => bridge?.emitValidationRequested()}
                        >
                            Re-run validation
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
