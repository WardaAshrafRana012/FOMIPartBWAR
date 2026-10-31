import "./studio.css";
import "./atelier.css";
import "./clay.css";
import "./typography.css";
import localFont from "next/font/local";
const jakarta = localFont({
  src: "../public/fonts/plus-jakarta-sans-variable.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-studio",
});
export const metadata = {
  title: "Fomi — WAR",
  description:
    "A creative direction workspace. From a brief to a considered sequence.",
};
export default function Layout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
