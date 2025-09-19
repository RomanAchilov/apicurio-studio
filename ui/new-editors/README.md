# New React Editors

This package hosts the next-generation visual editors for Apicurio Studio.  The
components are implemented with React and expose shadcn-style building blocks so
they can be re-used in multiple views (for example, drafts and branches in the
main UI or future standalone products).

## Goals

* Provide a composable shell that mirrors the feature set of the Angular
  editors (command execution, validation feedback, and collaboration signals).
* Expose headless hooks that describe the WebSocket traffic expected by the
  backend so any consumer knows which messages to send without re-reading the
  legacy application.
* Offer ready-to-use shadcn primitives (`Button`, `Tabs`, `ScrollArea`, etc.) so
  downstream apps can adopt a consistent design system even before Tailwind
  styles are wired in.

## Package contents

* `components/EditorShell.tsx` – grid layout with toolbar, outline and
  validation panes.  All interactions are routed through an `EditorBridge` so
  they can be replayed over WebSockets.
* `components/ValidationPanel.tsx` – renders validation problems and emits
  selection requests when the user focuses an error.
* `components/CollaboratorPanel.tsx` – shows remote collaborators and their
  current selections.
* `hooks/useEditorBridge.ts` – converts high-level editor events into typed
  WebSocket payloads.  Consumers may send the payloads through any transport
  (native `WebSocket`, STOMP, mock transports during tests, and so on).
* `protocol/messages.ts` – TypeScript definitions for every message that flows
  between the editor and the collaboration service.
* `components/ui/*` – minimal shadcn-compatible primitives that can later be
  swapped for the auto-generated counterparts once Tailwind is available in the
  build.

## WebSocket messages

The bridge hook surfaces the following payloads.  The `type` field is designed
for direct routing on the collaboration service; it mirrors the events emitted
by the Angular editor (`onCommandExecuted`, `onUndo`, `onRedo`,
`onSelectionChanged`, `finalizeCommand`, and `updateCollaboratorSelection`).

| UI action | Message type | Notes |
| --- | --- | --- |
| Execute command | `command.execute` | Contains the OT command and the local content version so the server can perform operational transforms. |
| Undo command | `command.undo` | When `commandId` is omitted the last local command is assumed. |
| Redo command | `command.redo` | Same semantics as undo. |
| Receive ACK | `command.ack` | Carries the `VersionedAck` information returned by the collaboration server. |
| Change selection | `selection.changed` | Broadcasts the node path selected by the local user. |
| Collaborator selection update | `collaboration.selection` | Sent when the UI needs to highlight another user's selection. |
| Request validation | `validation.request` | Instructs the server to validate the current document. |
| Publish validation results | `validation.result` | Communicates local validation calculations back to other clients. |

See `protocol/messages.ts` for the exact TypeScript definitions.

## Usage example

```tsx
import { EditorShell, useEditorBridge } from "@apicurio/new-editors";

const bridge = useEditorBridge({
  onMessage: (message) => collaborativeSocket.send(JSON.stringify(message))
});

<EditorShell
  title="Pet Store"
  bridge={bridge}
  outlineItems={outline}
  onExecuteCommand={(cmd) => bridge.emitCommandExecuted(cmd)}
  onSelectionChange={(path) => bridge.emitSelectionChanged(path)}
/>;
```

The shell does not own the WebSocket implementation.  Instead, it guarantees
that every user action produces a well-typed payload so existing collaboration
infrastructure can be re-used without guesswork.
