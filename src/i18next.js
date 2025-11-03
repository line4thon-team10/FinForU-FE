import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import vi from "./locales/vi.json";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
    vi: {
      translation: vi,
    },
  },
  // 기본 언어 설정 : en
  lng: "en",
  // react-i18next 처리 로그 콘솔 출력 설정 ==> 거슬려서 false로 변경
  debug: false,
  // 동적인 데이터 값 할당 설정
  interpolation: {
    escapeValue: false, // react는 XSS에 안전하기 때문에 false로 설정
  },
});

export default i18next;
