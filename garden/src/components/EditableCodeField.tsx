import React from "react";
import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { Button } from './shadcn/button';
import { XIcon, CheckIcon, Loader2Icon, EditIcon } from 'lucide-react';
import CopyButton from './CopyButton';
import SyntaxHighlighter from './SyntaxHighlighter';

const basicSetup = [
  // Basic key handlers
  keymap.of([
    ...defaultKeymap,
    indentWithTab
  ]),
  // Syntax highlighting
  syntaxHighlighting(defaultHighlightStyle),
  // Basic editor config
  EditorView.lineWrapping,
  EditorView.theme({
    '&': {
      backgroundColor: '#f9fafb',
      fontSize: '14px',
      minHeight: '200px',
      height: '100%'
    },
    '.cm-content': {
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      padding: '8px'
    },
    '.cm-scroller': {
      overflow: 'auto'
    }
  })
];

interface EditableCodeFieldProps {
  label: string;
  value: string;
  fieldName: string;
  onSave: (value: string) => Promise<void>;
  ownsThisFunction: boolean;
  language?: string;
}

export const EditableCodeField = ({
  label,
  value,
  fieldName,
  onSave,
  ownsThisFunction,
  language = 'python',
}: EditableCodeFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView>();

  useEffect(() => {
    if (isEditing && editorRef.current && !editorViewRef.current) {
      const startState = EditorState.create({
        doc: value || '',
        extensions: [
          python(),
          ...basicSetup,
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              const newValue = update.state.doc.toString();
              setEditValue(newValue);
            }
          })
        ]
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current
      });

      editorViewRef.current = view;
      view.focus();

      return () => {
        view.destroy();
        editorViewRef.current = undefined;
      };
    }
  }, [isEditing, value]);

  // Initialize edit value when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditValue(value || '');
    }
  }, [isEditing, value]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      // Keep the editor open if there's an error
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value || '');
  };

  if (!ownsThisFunction || !isEditing) {
    return (
      <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <div className="flex items-center gap-2">
            <CopyButton hint={`Copy ${label.toLowerCase()}`} content={value} className="text-gray-500 hover:text-gray-700" />
            {ownsThisFunction && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6">
                <EditIcon className="text-green hover:text-dark-green h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2">
          {isSaving ? (
            <div className="flex items-center justify-center py-8 bg-gray-50 rounded-md">
              <Loader2Icon className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <SyntaxHighlighter className="rounded-md bg-gray-50 !mt-0">
              {value || ''}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <div 
        ref={editorRef}
        className="w-full min-h-[200px] font-mono text-sm rounded-md overflow-hidden border border-gray-200 resize-vertical"
        style={{ resize: 'vertical' }}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-7 px-2"
          disabled={isSaving}
        >
          <XIcon className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-7 px-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <CheckIcon className="h-4 w-4 mr-1" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}; 