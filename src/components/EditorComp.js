import React, { useRef, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";

const EditorComp = ({ onChange, language, code, theme }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      // Function to handle changes
      const handleEditorChange = () => {
        console.log(editor.getValue());
      };

      // Add the change event listener
      editor.onDidChangeModelContent(handleEditorChange);

      // Cleanup function to remove the listener
      return () => {
        editor.offDidChangeModelContent(handleEditorChange);
      };
    }
  }, [editorRef]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="editor-container">
      <MonacoEditor
        height="1000px"
        language={language || "javascript"}
        theme={theme || "vs-dark"}
        value={code}
        onChange={onChange}
        editorDidMount={handleEditorDidMount} // Hook to get editor instance
      />
    </div>
  );
};

export default EditorComp;
