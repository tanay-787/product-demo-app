"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import * as React from "react";
import {
  type DropzoneOptions,
  type DropzoneState,
  type FileRejection,
  type FileWithPath,
  useDropzone as useReactDropzone,
} from "react-dropzone";

export type DropzoneContextProps = DropzoneState & DropzoneOptions;

const DropzoneContext = React.createContext<DropzoneContextProps>(
  {} as DropzoneContextProps,
);

function useDropzone() {
  const context = React.useContext(DropzoneContext);
  if (!context) {
    throw new Error("useDropzone must be used within a <Dropzone />.");
  }

  return context;
}

export interface DropzoneProps extends DropzoneOptions {
  children:
    | React.ReactNode
    | ((state: DropzoneContextProps) => React.ReactNode);
}

function Dropzone({ children, ...props }: DropzoneProps) {
  const state = useReactDropzone(props);
  const context = { ...state, ...props };

  return (
    <DropzoneContext.Provider value={context}>
      {typeof children === "function" ? children(context) : children}
    </DropzoneContext.Provider>
  );
}

function DropzoneInput(props: React.ComponentProps<typeof Primitive.input>) {
  const { getInputProps, disabled } = useDropzone();

  return (
    <Primitive.input
      data-slot="dropzone-input"
      {...getInputProps({ disabled, ...props })}
    />
  );
}

function DropzoneZone(props: React.ComponentProps<typeof Primitive.div>) {
  const {
    getRootProps,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFileDialogActive,
    preventDropOnDocument,
    noClick,
    noKeyboard,
    noDrag,
    noDragEventsBubbling,
    disabled,
  } = useDropzone();

  return (
    <Primitive.div
      data-slot="dropzone-zone"
      data-prevent-drop-on-document={preventDropOnDocument || undefined}
      data-no-click={noClick || undefined}
      data-no-keyboard={noKeyboard || undefined}
      data-no-drag={noDrag || undefined}
      data-no-drag-events-bubbling={noDragEventsBubbling || undefined}
      data-disabled={disabled || undefined}
      data-focused={isFocused || undefined}
      data-drag-active={isDragActive || undefined}
      data-drag-accept={isDragAccept || undefined}
      data-drag-reject={isDragReject || undefined}
      data-file-dialog-active={isFileDialogActive || undefined}
      {...getRootProps(props)}
    />
  );
}

function DropzoneTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof Primitive.button>) {
  const { open } = useDropzone();

  return (
    <Primitive.button
      data-slot="dropzone-trigger"
      onClick={composeEventHandlers(onClick, open)}
      {...props}
    />
  );
}

export interface DropzoneDragAcceptedProps {
  children?: React.ReactNode;
}

function DropzoneDragAccepted({ children }: DropzoneDragAcceptedProps) {
  const { isDragAccept } = useDropzone();
  if (!isDragAccept) return null;
  return <div data-slot="dropzone-drag-accepted">{children}</div>;
}

export interface DropzoneDragRejectedProps {
  children?: React.ReactNode;
}

function DropzoneDragRejected({ children }: DropzoneDragRejectedProps) {
  const { isDragReject } = useDropzone();
  if (!isDragReject) {
    return null;
  }

  return <div data-slot="dropzone-drag-rejected">{children}</div>;
}

export interface DropzoneDragDefaultProps {
  children?: React.ReactNode;
}

function DropzoneDragDefault({ children }: DropzoneDragDefaultProps) {
  const { isDragActive } = useDropzone();
  if (isDragActive) {
    return null;
  }

  return <div data-slot="dropzone-drag-default">{children}</div>;
}

export interface DropzoneAcceptedProps {
  children: (acceptedFiles: Readonly<FileWithPath[]>) => React.ReactNode;
}

function DropzoneAccepted({ children }: DropzoneAcceptedProps) {
  const { acceptedFiles } = useDropzone();
  return <div data-slot="dropzone-accepted">{children(acceptedFiles)}</div>;
}

export interface DropzoneRejectedProps {
  children: (fileRejections: Readonly<FileRejection[]>) => React.ReactNode;
}

function DropzoneRejected({ children }: DropzoneRejectedProps) {
  const { fileRejections } = useDropzone();
  return <div data-slot="dropzone-rejected">{children(fileRejections)}</div>;
}

export {
  Dropzone as Root,
  DropzoneInput as Input,
  DropzoneZone as Zone,
  DropzoneTrigger as Trigger,
  DropzoneDragAccepted as DragAccepted,
  DropzoneDragRejected as DragRejected,
  DropzoneDragDefault as DragDefault,
  DropzoneAccepted as Accepted,
  DropzoneRejected as Rejected,
};