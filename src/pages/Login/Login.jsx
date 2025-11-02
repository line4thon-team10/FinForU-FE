import { useNavigate } from "react-router-dom";
import ButtonGroup from "../../components/button-group/ButtonGroup";

export default function Login() {
  const navigate = useNavigate();
  return (
    <>
      <div>로그인 페이지</div>
      <ButtonGroup
        grayText="Back"
        onGrayClick={() => navigate(-1)}
        blueType="button"
        blueText="Next"
        blueDisabled={false}
        onBlueClick={() => navigate("/")}
      />
    </>
  );
}
