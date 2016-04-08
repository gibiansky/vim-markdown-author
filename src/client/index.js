import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Remarkable from 'remarkable';
import highlightjs from 'highlight.js';

let renderer = new Remarkable({
    highlight: (str, lang) => {
        if (lang && highlightjs.getLanguage(lang)) {
            try {
                return highlightjs.highlight(lang, str).value;
            } catch (err) {}
        }

        try {
            return highlightjs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
    },
});

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            markdown: "# Waiting...\n$$a+b$$",
        };
    }

    render() {
        let html = renderer.render(this.state.markdown);
        return <div
            className="container"
            style={{maxWidth: "60em"}}
            dangerouslySetInnerHTML={{__html: html}}/>;
    }

    componentDidUpdate(root) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
}

// Create the viewing component
let _component; 
ReactDOM.render(<Main ref={component => _component = component}/>,
                document.getElementById("app"));

// Connect to the data stream
let socket = io('http://localhost:3000');
socket.on('change', data => {
    console.log("Received markdown data.");
    _component.setState({
        markdown: data.markdown
                      .replace("\\(", "\\\\(")
                      .replace("\\)", "\\\\)")
                      .replace("\\]", "\\\\]")
                      .replace("\\[", "\\\\["),
    });
});
