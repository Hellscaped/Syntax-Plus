import React from "react";
import "./App.css";

import CodeEditor from '@uiw/react-textarea-code-editor';

function PlusPage() {
    function handleCSSChange(reactEvent) {
        localStorage.setItem("customcss", reactEvent.target.value);
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>SYNTAX+</h1>
                <p>Custom CSS</p>
                <CodeEditor
                    value={localStorage.getItem("customcss")}
                    onChange={handleCSSChange}
                    language="css"
                    placeholder="/* Syntax+ Custom CSS */"
                />

            </header>
        </div>
    );
}

export default PlusPage;
