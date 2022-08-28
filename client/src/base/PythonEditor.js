import React, { useState } from "react";
import { PythonEditor } from "react-python-editor";

export default function Python() {
  const [value, setValue] = useState("");
  return (
    <PythonEditor
      editorHeight="400px"
      outputHeight="200px"
      value={value}
      onChange={setValue}
    />
  );
}