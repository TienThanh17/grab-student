import Header from "@/layout/Header";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <div style={{ paddingInline: "10rem" }}>{children}</div>
    </>
  );
}
