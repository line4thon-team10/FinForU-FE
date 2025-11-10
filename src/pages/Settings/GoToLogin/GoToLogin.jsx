import { useTranslation } from "react-i18next";
import * as S from "./GoToLoginStyle";
import { useNavigate } from "react-router-dom";
import Error from "./icon/error.svg?react";
import { useHeaderStore } from "../../../stores/headerStore";
import { useEffect } from "react";

export default function GoToLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.settings"),
      showBackBtn: true, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);
  return (
    <S.Container>
      <Error />
      <S.Text>{t("settings.loginToSee")}</S.Text>
      <S.Button onClick={() => navigate("/login")}>{t("settings.goToLogin")}</S.Button>
    </S.Container>
  );
}
