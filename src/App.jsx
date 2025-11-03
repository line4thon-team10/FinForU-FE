import { Route, Routes } from "react-router-dom";
import { EmptyLayout, HeaderLayout, HeaderNavLayout } from "./layouts/Layout";
import RootLayout from "./layouts/RootLayout";
import { GlobalStyle } from "./styles/GlobalStyle";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Guide from "./pages/Guide/Guide";

function App() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <RootLayout>
      <GlobalStyle currentLang={currentLang} />
      <Routes>
        {/* header와 navigation이 둘 다 없는 레이아웃 */}
        <Route element={<EmptyLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* header만 있는 레이아웃 */}
        <Route element={<HeaderLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        {/* header와 navigation이 둘 다 있는 레이아웃 */}
        <Route element={<HeaderNavLayout />}>
          <Route path="/guide" element={<Guide />} />
        </Route>
      </Routes>
    </RootLayout>
  );
}

export default App;
