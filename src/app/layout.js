import "./globals.css";
import ThemeProviderWarp from "./provider/themeProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ThemeProviderWarp>
        {children}
      </ThemeProviderWarp>
      </body>
    </html>
  );
}
