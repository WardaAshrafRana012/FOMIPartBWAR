"use client";
export default function ErrorPage({ reset }) {
  return (
    <main className="loading">
      <h1>Something interrupted the workspace.</h1>
      <p>Your last saved project remains in this browser.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
