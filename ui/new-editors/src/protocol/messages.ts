import { type OtCommand, type ValidationProblem } from "@apicurio/data-models";

/**
 * Represents a collaborator connected to the editing session.  The structure matches the
 * legacy Angular implementation so the backend can keep its current payloads.
 */
export interface ApiEditorUser {
    userId: string;
    userName: string;
    fullName: string;
    attributes?: Record<string, any>;
}

/**
 * Ack information returned by the collaboration server once a command is persisted.
 * Mirrors {@link VersionedAck} from the Angular editor.
 */
export interface VersionedAck {
    ackType: string;
    commandId: number;
    contentVersion: number;
}

export interface CommandExecuteMessage {
    type: "command.execute";
    command: OtCommand;
    contentVersion: number;
    isLocal: boolean;
}

export interface CommandUndoMessage {
    type: "command.undo";
    commandId?: number | string;
}

export interface CommandRedoMessage {
    type: "command.redo";
    commandId?: number | string;
}

export interface CommandAckMessage {
    type: "command.ack";
    ack: VersionedAck;
}

export interface SelectionChangedMessage {
    type: "selection.changed";
    selection: string;
}

export interface CollaboratorSelectionMessage {
    type: "collaboration.selection";
    user: ApiEditorUser;
    selection: string | null;
}

export interface ValidationRequestMessage {
    type: "validation.request";
}

export interface ValidationResultMessage {
    type: "validation.result";
    problems: ValidationProblem[];
}

export type EditorWsMessage =
    | CommandExecuteMessage
    | CommandUndoMessage
    | CommandRedoMessage
    | CommandAckMessage
    | SelectionChangedMessage
    | CollaboratorSelectionMessage
    | ValidationRequestMessage
    | ValidationResultMessage;
