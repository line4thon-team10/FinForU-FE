import { useHeaderStore } from "../../stores/headerStore";
import BackBtn from "./BackBtn.svg?react";
import SettingBtn from "./SettingBtn.svg?react";
import * as S from "./HeaderStyle";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const headerConfig = useHeaderStore((state) => state.headerConfig);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <S.Container>
      <S.BtnWrapper $isBack={true}>
        {headerConfig.showBackBtn && (
          <S.Button onClick={handleBack}>
            <BackBtn />
          </S.Button>
        )}
      </S.BtnWrapper>
      <S.Title>{headerConfig.title}</S.Title>
      <S.BtnWrapper $isBack={false}>
        {headerConfig.showSettingBtn && (
          <S.Button>
            <SettingBtn />
          </S.Button>
        )}
      </S.BtnWrapper>
    </S.Container>
  );
}
