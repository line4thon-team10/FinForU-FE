import { useTranslation } from "react-i18next";
import { useHeaderStore } from "../../stores/headerStore";
import { useEffect } from "react";
import i18next from "i18next";
import * as S from "./RatesStyle";

const res = {
  isSuccess: true,
  timeStamp: "2025-11-06 15:01:49",
  code: "SUCCESS_200",
  httpStatus: 200,
  message: "호출에 성공했습니다.",
  data: [
    {
      ExchangeRateData: {
        currencyType: "USD",
        todayRate: 1437.7,
        rateCompareYesterday: 0.0,
        priceGraphData: [
          {
            date: "2024-11-06",
            price: 1377.8,
          },
          {
            date: "2024-11-07",
            price: 1391.5,
          },
          {
            date: "2024-11-08",
            price: 1399.1,
          },
          // ...
          {
            date: "2025-11-05",
            price: 1437.7,
          },
        ],
        eachBankFee: [
          {
            bank: "shinhan",
            fee: 0.175,
          },
          {
            bank: "hana",
            fee: 0.175,
          },
          {
            bank: "kookmin",
            fee: 0.175,
          },
          {
            bank: "woori",
            fee: 0.175,
          },
        ],
      },
      toastMessage: "It's a good time to exchange your KRW today!",
    },
    {
      ExchangeRateData: {
        currencyType: "CNY",
        todayRate: 201.9,
        rateCompareYesterday: 0.0,
        priceGraphData: [
          {
            date: "2024-11-06",
            price: 193.95,
          },
          {
            date: "2024-11-07",
            price: 194.35,
          },
          {
            date: "2024-11-08",
            price: 194.32,
          },

          // ...

          {
            date: "2025-11-05",
            price: 201.9,
          },
        ],
        eachBankFee: [
          {
            bank: "shinhan",
            fee: 2.0,
          },
          {
            bank: "hana",
            fee: 3.5,
          },
          {
            bank: "kookmin",
            fee: 3.0,
          },
          {
            bank: "woori",
            fee: 3.25,
          },
        ],
      },
      toastMessage: "It's a good time to exchange currency today!",
    },
    {
      ExchangeRateData: {
        currencyType: "VND",
        todayRate: 5.46,
        rateCompareYesterday: 0.0,
        priceGraphData: [
          {
            date: "2024-11-06",
            price: 5.44,
          },
          {
            date: "2024-11-07",
            price: 5.48,
          },
          {
            date: "2024-11-08",
            price: 5.52,
          },

          // ...

          {
            date: "2025-11-05",
            price: 5.46,
          },
        ],
        eachBankFee: [
          {
            bank: "shinhan",
            fee: 6.6,
          },
          {
            bank: "hana",
            fee: 11.8,
          },
          {
            bank: "kookmin",
            fee: 9.6,
          },
          {
            bank: "woori",
            fee: null,
          },
        ],
      },
      toastMessage: "Not a good day to exchange money today!",
    },
  ],
};

export default function Rates() {
  const { t } = useTranslation();
  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.rates"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: true, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18next.language]);
  return (
    <S.Container>
      <S.TopBox>
        <S.Toast>{res.data[0].toastMessage || t("rates.recommendMsg")}</S.Toast>
        <S.Title>{t("rates.currencyExchangeRate")}</S.Title>
        <S.ButtonWrapper>
          <input
            type="radio"
            id="USD"
            name="currencyType"
            value="USD"
            checked={res.data[0].ExchangeRateData.currencyType === "USD"}
            readOnly={true}
          />
          <label htmlFor="USD">USD</label>
          <input
            type="radio"
            id="CNY"
            name="currencyType"
            value="CNY"
            checked={res.data[0].ExchangeRateData.currencyType === "CNY"}
            readOnly={true}
          />
          <label htmlFor="CNY">CNY</label>
          <input
            type="radio"
            id="VND"
            name="currencyType"
            value="VND"
            checked={res.data[0].ExchangeRateData.currencyType === "VND"}
            readOnly={true}
          />
          <label htmlFor="VND">VND</label>
        </S.ButtonWrapper>
      </S.TopBox>
      <S.GraphWrapper>
        <S.MiniTitle>KRW to {res.data[0].ExchangeRateData.currencyType}</S.MiniTitle>
        <S.RateBox>
          <S.Rate>{res.data[0].ExchangeRateData.todayRate}</S.Rate>
          <S.TodayBox>
            <S.Today>{t("rates.today")}</S.Today>
            <S.TodayRate>
              {res.data[0].ExchangeRateData.rateCompareYesterday.toFixed(1)}%
            </S.TodayRate>
          </S.TodayBox>
        </S.RateBox>
      </S.GraphWrapper>
    </S.Container>
  );
}
