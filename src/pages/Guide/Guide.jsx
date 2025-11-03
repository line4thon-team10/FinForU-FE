import { useTranslation } from "react-i18next";
import { useHeaderStore } from "../../stores/headerStore";
import { useEffect } from "react";

export default function Guide() {
  const { t, i18n } = useTranslation();

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.guide"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: true, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  return (
    <>
      <div style={{ marginTop: "3.5625rem" }}>금융 가이드 페이지</div>
    </>
  );
}
