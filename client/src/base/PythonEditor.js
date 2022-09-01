import React, { useState } from "react";
import { PythonEditor } from "react-python-editor";

export default function Python() {
  return (
    <PythonEditor
      editorHeight="400px"
      outputHeight="200px"
    />
  );
}