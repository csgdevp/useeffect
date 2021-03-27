import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const LogEffect = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("latest value:", text);
  });

  return (
    <>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </>
  );
};

function App() {
  const inputRef = useRef();

  const [value, setValue] = useState("");

  useEffect(() => {
    console.log("render");
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <input
      type="text"
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function Reddit({ subreddit }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setPosts([]);

    fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then((res) => {
        if (res.ok) {
          return res;
        }
        throw new Error("Could not fetch posts");
      })
      .then((res) => res.json())
      .then((json) => setPosts(json.data.children.map((c) => c.data)))
      .catch((error) => {
        // Save the error in state
        setError(error.message);
      });
  }, [subreddit, setPosts]);
  return (
    <ul>
      {error ? error : posts.map((post) => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

function App1() {
  const [inputValue, setValue] = useState("reactjs");
  const [subreddit, setSubreddit] = useState(inputValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubreddit(inputValue);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input value={inputValue} onChange={(e) => setValue(e.target.value)} />
      </form>
      <Reddit subreddit={subreddit} />
    </>
  );
}

function Input() {
  const [value, setValue] = useState(document.title);

  useEffect(() => {
    document.title = value;
  });

  return (
    <>
      Your title:
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}

function Click() {
  useEffect(() => {
    const announceClick = (e) => console.log("clicked!", e.clientX, e.clientY);

    document.addEventListener("click", announceClick);
    return () =>
      // When the effect is cleaned up, remove the click handler
      document.removeEventListener("click", announceClick);
  }, []); // only run once, on mount

  return <div>Click anywhere!</div>;
}

ReactDOM.render(<Reddit subreddit="nodejs" />, document.getElementById("root"));
