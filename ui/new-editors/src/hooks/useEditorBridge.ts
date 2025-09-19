import { useCallback } from "react";
import { type OtCommand, type ValidationProblem } from "@apicurio/data-models";

import {
    type ApiEditorUser,
    type CollaboratorSelectionMessage,
    type CommandAckMessage,
    type CommandExecuteMessage,
    type CommandRedoMessage,
    type CommandUndoMessage,
    type EditorWsMessage,
    type SelectionChangedMessage,
    type ValidationRequestMessage,
    type ValidationResultMessage,
    type VersionedAck
} from "../protocol/messages";

export interface EditorBridgeOptions {
    onMessage?: (message: EditorWsMessage) => void;
}

export interface EditorBridge {
    emitCommandExecuted: (command: OtCommand, options?: { isLocal?: boolean }) => void;
    emitCommandUndo: (command?: OtCommand | number | string | null) => void;
    emitCommandRedo: (command?: OtCommand | number | string | null) => void;
    emitCommandAck: (ack: VersionedAck) => void;
    emitSelectionChanged: (selection: string) => void;
    emitCollaboratorSelection: (user: ApiEditorUser, selection: string | null) => void;
    emitValidationRequested: () => void;
    emitValidationResults: (problems: ValidationProblem[]) => void;
}

function normalizeCommandId(command?: OtCommand | number | string | null): number | string | undefined {
    if (command == null) {
        return undefined;
    }
    if (typeof command === "number" || typeof command === "string") {
        return command;
    }
    if (typeof command.contentVersion === "number") {
        return command.contentVersion;
    }
    return undefined;
}

export function useEditorBridge(options: EditorBridgeOptions = {}): EditorBridge {
    const send = useCallback((message: EditorWsMessage) => {
        options.onMessage?.(message);
    }, [options.onMessage]);

    const emitCommandExecuted = useCallback((command: OtCommand, opts?: { isLocal?: boolean }) => {
        const payload: CommandExecuteMessage = {
            type: "command.execute",
            command,
            contentVersion: command.contentVersion ?? Date.now(),
            isLocal: opts?.isLocal ?? true
        };
        send(payload);
    }, [send]);

    const emitCommandUndo = useCallback((command?: OtCommand | number | string | null) => {
        const payload: CommandUndoMessage = {
            type: "command.undo",
            commandId: normalizeCommandId(command)
        };
        send(payload);
    }, [send]);

    const emitCommandRedo = useCallback((command?: OtCommand | number | string | null) => {
        const payload: CommandRedoMessage = {
            type: "command.redo",
            commandId: normalizeCommandId(command)
        };
        send(payload);
    }, [send]);

    const emitCommandAck = useCallback((ack: VersionedAck) => {
        const payload: CommandAckMessage = {
            type: "command.ack",
            ack
        };
        send(payload);
    }, [send]);

    const emitSelectionChanged = useCallback((selection: string) => {
        const payload: SelectionChangedMessage = {
            type: "selection.changed",
            selection
        };
        send(payload);
    }, [send]);

    const emitCollaboratorSelection = useCallback((user: ApiEditorUser, selection: string | null) => {
        const payload: CollaboratorSelectionMessage = {
            type: "collaboration.selection",
            user,
            selection
        };
        send(payload);
    }, [send]);

    const emitValidationRequested = useCallback(() => {
        const payload: ValidationRequestMessage = {
            type: "validation.request"
        };
        send(payload);
    }, [send]);

    const emitValidationResults = useCallback((problems: ValidationProblem[]) => {
        const payload: ValidationResultMessage = {
            type: "validation.result",
            problems
        };
        send(payload);
    }, [send]);

    return {
        emitCommandExecuted,
        emitCommandUndo,
        emitCommandRedo,
        emitCommandAck,
        emitSelectionChanged,
        emitCollaboratorSelection,
        emitValidationRequested,
        emitValidationResults
    };
}
