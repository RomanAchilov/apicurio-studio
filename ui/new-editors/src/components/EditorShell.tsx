import * as React from "react";
import { type ValidationProblem } from "@apicurio/data-models";

import { type EditorBridge } from "../hooks/useEditorBridge";
import { cn } from "../lib/utils";
import { EditorToolbar } from "./EditorToolbar";
import { ValidationPanel } from "./ValidationPanel";
import { CollaboratorPanel, type CollaboratorSelection } from "./CollaboratorPanel";
import { OutlineTree, type OutlineItem } from "./OutlineTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

export interface EditorShellProps {
    title: string;
    description?: string;
    bridge: EditorBridge;
    outlineItems?: OutlineItem[];
    selectedPath?: string;
    onSelectionChange?: (path: string) => void;
    validationProblems?: ValidationProblem[];
    collaborators?: CollaboratorSelection[];
    undoCount?: number;
    redoCount?: number;
    isDirty?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    onValidate?: () => void;
    onSave?: () => void;
    sourceContent?: React.ReactNode;
    previewContent?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

type TabDefinition = {
    value: string;
    label: string;
    content: React.ReactNode;
};

export const EditorShell: React.FC<EditorShellProps> = ({
    title,
    description,
    bridge,
    outlineItems = [],
    selectedPath,
    onSelectionChange,
    validationProblems,
    collaborators,
    undoCount,
    redoCount,
    isDirty,
    onUndo,
    onRedo,
    onValidate,
    onSave,
    sourceContent,
    previewContent,
    className,
    children
}) => {
    const tabs = React.useMemo<TabDefinition[]>(() => {
        const definitions: TabDefinition[] = [];
        definitions.push({ value: "design", label: "Design", content: children ?? <div className="p-4 text-sm text-muted-foreground">Provide editor content via `children`.</div> });
        if (sourceContent) {
            definitions.push({ value: "source", label: "Source", content: sourceContent });
        }
        if (previewContent) {
            definitions.push({ value: "preview", label: "Preview", content: previewContent });
        }
        return definitions;
    }, [children, sourceContent, previewContent]);

    const [activeTab, setActiveTab] = React.useState<string>(tabs[0]?.value ?? "design");
    React.useEffect(() => {
        if (!tabs.find(tab => tab.value === activeTab)) {
            setActiveTab(tabs[0]?.value ?? "design");
        }
    }, [tabs, activeTab]);

    const hasOutline = outlineItems.length > 0;
    const hasRightRail = Boolean(validationProblems?.length || collaborators?.length);

    const handleSelectOutline = (item: OutlineItem): void => {
        bridge.emitSelectionChanged(item.path);
        onSelectionChange?.(item.path);
    };

    return (
        <div className={cn("flex h-full flex-col gap-4", className)}>
            <header className="space-y-2">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                <EditorToolbar
                    bridge={bridge}
                    undoDisabled={(undoCount ?? 0) === 0}
                    redoDisabled={(redoCount ?? 0) === 0}
                    isDirty={isDirty}
                    onUndo={onUndo}
                    onRedo={onRedo}
                    onValidate={onValidate}
                    onSave={onSave}
                />
            </header>
            <div className="flex flex-1 gap-4 overflow-hidden">
                {hasOutline && (
                    <aside className="w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                        <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Outline
                        </div>
                        <ScrollArea className="h-full">
                            <OutlineTree
                                items={outlineItems}
                                selectedPath={selectedPath}
                                onSelect={handleSelectOutline}
                                className="px-2 py-2"
                            />
                        </ScrollArea>
                    </aside>
                )}
                <main className="flex-1 overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
                        <TabsList>
                            {tabs.map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {tabs.map(tab => (
                            <TabsContent key={tab.value} value={tab.value} className="flex-1 overflow-auto">
                                {tab.content}
                            </TabsContent>
                        ))}
                    </Tabs>
                </main>
                {hasRightRail && (
                    <aside className="w-72 shrink-0 space-y-4">
                        <ValidationPanel problems={validationProblems} bridge={bridge} />
                        <CollaboratorPanel collaborators={collaborators} bridge={bridge} />
                    </aside>
                )}
            </div>
            {selectedPath && (
                <footer className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                    Selected path: {selectedPath}
                </footer>
            )}
        </div>
    );
};
