import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHeaderStore } from "../../stores/headerStore";
import { useEffect, useState } from "react";
import * as S from "./LoginStyle";
import axios from "axios";

// .env.local에 서버 배포 주소를 API_URL로 저장한다고 간주
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("login.login"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  const handleSubmit = async (e) => {
    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    e.preventDefault();
    // 모든 값을 입력하지 않았을 때
    if (!email.trim() || !password.trim()) {
      alert("Please enter all values correctly.");
      return;
    }
    // 이메일 정규표현식 유효성 검사
    if (!email_regex.test(email)) {
      alert("Please enter the correct email address.");
      return;
    }

    const loginEndpoint = `${API_URL}/api/member/login`;
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(loginEndpoint, loginData, {
        withCredentials: true,
      });

      // 로그인 성공
      if (res.status === 200) {
        navigate("/guide");
      }
    } catch (error) {
      if (error.response) {
        // 서버로부터 응답이 온 경우
        if (error.response.status === 404) {
          // API 명세서에 명시된 에러 코드
          alert("The entered email could not be found.");
          return;
        } else if (error.response.status === 401) {
          // 401 Unauthorized 에러 처리 추가
          alert("Password does not match.\nPlease check your password.");
          return;
        } else {
          // 이외의 경우
          alert(`A ${error.response.status} error occurred while logging in.`);
          return;
        }
      } else if (error.request) {
        // 요청이 보내졌으나 응답이 오지 않은 경우
        alert("Could not connect to the server. Please check your network status.");
        return;
      } else {
        // 요청 설정 중 오류 발생
        alert("An unknown error occurred during login request setup.");
        return;
      }
    }
  };

  return (
    <S.Container>
      <S.Title>FinForU</S.Title>
      <S.FormWrapper>
        <S.Form onSubmit={handleSubmit}>
          <div>
            <S.EmailInput
              placeholder={t("login.email")}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
            />
            <S.PWInput
              placeholder={t("login.password")}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
          </div>
          <S.Btn $isLogin={true} type="submit">
            {t("login.login")}
          </S.Btn>
        </S.Form>
        <S.Div></S.Div>
        <S.Btn $isLogin={false} onClick={() => navigate("/join")}>
          {t("login.join")}
        </S.Btn>
      </S.FormWrapper>
    </S.Container>
  );
}
