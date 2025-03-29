import { useEffect, useState } from "react";
import "./App.css";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function App() {
  useEffect(() => {
    prism.highlightAll();
  }, []);

  const [review, setreview] = useState(``);
  const [animatedReview, setAnimatedReview] = useState("");

  async function reviewCode() {
    const response = await axios.post("http://localhost:3000/ai/get-review", {
      code,
    });
    setreview(response.data);
  }

  useEffect(() => {
    let interval;
    if (review) {
      const words = review.split(" ");
      let index = 0;
      setAnimatedReview(""); // Reset animated review
      interval = setInterval(() => {
        if (index < words.length) {
          setAnimatedReview((prev) => prev + (index > 0 ? " " : "") + words[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100); // Adjust the delay (100ms) as needed for animation speed
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount or review change
  }, [review]);

  const [code, setcode] = useState(`function sum(){
  return 1 + 2}`);

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setcode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div className="review" onClick={reviewCode}>
            Review
          </div>
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {animatedReview}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
