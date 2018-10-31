import katex from "katex";
import zmark, { Renderer } from "zmark";
import highlightjs from "highlight.js";
import "katex/dist/katex.css";
import "../assets/github.css";
import "../assets/github-markdown.css";

const renderer = new Renderer();
renderer.code = (code, language) => {
  const validLang = !!(language && highlightjs.getLanguage(language));
  const highlighted = validLang
    ? highlightjs.highlight(language, code).value
    : code;
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

zmark.setOptions({
  renderer: renderer,
  math: (text, display) => katex.renderToString(text, { displayMode: display })
});

export default function render(markdown) {
  try {
    let result = zmark(markdown || "# Nothing to shown");
    return result;
  } catch (e) {
    return `<pre><code>${e.message}\nSource:\n${markdown}</code></pre>`;
  }
}
