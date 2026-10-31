import "./studio.css";
export const metadata = {
  title: "Fomi — Continuity",
  description:
    "A creative direction workspace. From a brief to a considered sequence.",
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
