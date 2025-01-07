import "./globals.css";
import ThemeProviderWrapper from "../provider/themeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import ReduxProvider from "@/provider/ReduxProvider";
import DatePickerProvider from "@/provider/DatePickerProvider";
import DatePickerProProvider from "@/provider/DatePickerProProvider";
import SnackbarProvider from "@/provider/SnackbarProvider";
import Loading from "@/components/loading/Loading";
import { GlobalProvider } from "@/provider/GlobalContext";

export const metadata = {
  title: "Grab Student Booking",
  description: "Grab Student Booking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderWrapper>
          <SnackbarProvider>
            <DatePickerProProvider>
              <DatePickerProvider>
                <CssBaseline />
                <GlobalProvider>
                  <ReduxProvider>
                    <Loading />
                    {children}
                  </ReduxProvider>
                </GlobalProvider>
              </DatePickerProvider>
            </DatePickerProProvider>
          </SnackbarProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
