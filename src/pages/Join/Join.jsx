import { useTranslation } from "react-i18next";
import { useHeaderStore } from "../../stores/headerStore";
import { useEffect } from "react";

export default function Join() {
  const { t, i18n } = useTranslation();
  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("join.join"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);
  return <div style={{ marginTop: "3.5625rem" }}>회원가입 페이지</div>;
}
