import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { Button } from './shadcn/button';
import { XIcon, CheckIcon, PencilIcon } from 'lucide-react';
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
      height: '200px'
    },
    '.cm-content': {
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      padding: '8px'
    }
  })
];

interface EditableCodeFieldProps {
  label: string;
  value: string;
  fieldName: string;
  onSave: (value: string) => void;
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
  const [editValue, setEditValue] = useState(value || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView>();

  useEffect(() => {
    if (isEditing && editorRef.current && !editorViewRef.current) {
      const startState = EditorState.create({
        doc: editValue,
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
  }, [isEditing]);

  // Reset edit value when value prop changes
  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value || '');
  };

  if (!ownsThisFunction || !isEditing) {
    return (
      <div className="relative group rounded-lg border border-gray-200 hover:border-blue-200 bg-gradient-to-b from-white to-gray-50 shadow-sm">
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">{label}</h3>
          <div className="flex items-center gap-2">
            <CopyButton hint={`Copy ${label.toLowerCase()}`} content={value} className="text-gray-500 hover:text-gray-700" />
            {ownsThisFunction && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="p-4">
          <SyntaxHighlighter className="rounded-md bg-gray-50 !mt-0">
            {value || ''}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group rounded-lg border border-gray-200 hover:border-blue-200 bg-gradient-to-b from-white to-gray-50 shadow-sm">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">{label}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-7 px-2"
          >
            <XIcon className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-7 px-2"
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div 
          ref={editorRef} 
          className="w-full min-h-[200px] font-mono text-sm rounded-md overflow-hidden border border-gray-200"
        />
      </div>
    </div>
  );
}; 