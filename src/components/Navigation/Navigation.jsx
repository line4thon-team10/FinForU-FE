import { useLocation, useNavigate } from "react-router-dom";
import { GuideIcon, MapIcon, ProductIcon, RatesIcon, WalletIcon } from "./NavigationIcon";
import * as S from "./NavigationStyle";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  return (
    <S.Container>
      <S.Button $isActive={isActive("/guide")} onClick={() => navigate("/guide")}>
        <GuideIcon />
        <div>Guide</div>
      </S.Button>
      <S.Button $isActive={isActive("/map")} onClick={() => navigate("/map")}>
        <MapIcon />
        <div>Map</div>
      </S.Button>
      <S.Button $isActive={isActive("/product")} onClick={() => navigate("/product")}>
        <ProductIcon />
        <div>Product</div>
      </S.Button>
      <S.Button $isActive={isActive("/rates")} onClick={() => navigate("/rates")}>
        <RatesIcon />
        <div>Rates</div>
      </S.Button>
      <S.Button $isActive={isActive("/wallet")} onClick={() => navigate("/wallet")}>
        <WalletIcon />
        <div>Wallet</div>
      </S.Button>
    </S.Container>
  );
}
