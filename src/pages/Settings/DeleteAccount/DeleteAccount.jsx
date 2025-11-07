import { useEffect } from "react";
import { useHeaderStore } from "../../../stores/headerStore";
import { useTranslation } from "react-i18next";
import * as S from "./DeleteAccountStyle";

export default function DeleteAccount() {
  const { t, i18n } = useTranslation();
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("settings.deleteAccount"),
      showBackBtn: true, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);
  return <div>DeleteAccount</div>;
}
