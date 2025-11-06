import { useState } from "react";
import * as S from "./DropdownStyle";
import { useTranslation } from "react-i18next";

/**
 * 커스텀 드롭다운 컴포넌트 - 두 줄짜리 항목 및 좌/우측 상단 Radius도 대응
 * @param {object} props
 * @param {string} props.name - 숨겨진 input의 name 속성 - 폼 제출 시 사용
 * @param {(string | { main: string, sub: string })[]} props.itemArray - 드롭다운에 표시될 항목들의 배열
 * * 한 줄 항목은 문자열만, 두 줄 항목은 main과 sub 키를 가진 객체로 이루어진 배열 넘기기
 */
export default function Dropdown({ name, itemArray }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(t("pleaseSelect")); // ui에 보여질 값
  const [inputValue, setInputValue] = useState(""); // 실제 hidden input에 들어갈 값

  const handleSelect = (item) => {
    // 두 줄인 경우 -> 비자 타입 선택
    const isObject = typeof item === "object" && item !== null;

    let newSelectedValue;
    let newInputValue;
    if (isObject) {
      // 객체 항목 (두 줄) 일 경우
      newSelectedValue = item.main || item;
      newInputValue = item.main || item;
    } else {
      newSelectedValue = item;
      newInputValue = item;
    }
    setSelectedValue(newSelectedValue);
    setInputValue(newInputValue);
    setIsVisible(false);
  };

  return (
    <S.Container
      onClick={() => setIsVisible(!isVisible)}
      $selected={selectedValue !== t("pleaseSelect")}
    >
      {/* 실제 값은 이 input에 */}
      <input type="hidden" id={name} name={name} value={inputValue} />
      <S.Content>
        <div>{selectedValue}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="11"
          viewBox="0 0 21 11"
          fill="none"
        >
          <path
            d="M1.68725 0.282423C1.59178 0.192204 1.47947 0.121675 1.35674 0.0748596C1.23401 0.0280437 1.10327 0.00585938 0.971965 0.00957394C0.840663 0.0132885 0.711378 0.0428286 0.591492 0.0965071C0.471606 0.150186 0.363467 0.226952 0.273249 0.322423C0.183031 0.417894 0.112501 0.530201 0.0656852 0.652929C0.0188697 0.775658 -0.00331434 0.906405 0.000400002 1.03771C0.00411435 1.16901 0.0336542 1.2983 0.0873329 1.41818C0.141012 1.53807 0.217778 1.6462 0.313249 1.73642L9.31325 10.2364C9.49892 10.412 9.74474 10.5098 10.0002 10.5098C10.2558 10.5098 10.5016 10.412 10.6872 10.2364L19.6882 1.73642C19.7858 1.6468 19.8646 1.53869 19.92 1.41836C19.9754 1.29803 20.0064 1.16789 20.0111 1.0355C20.0158 0.903103 19.9942 0.771093 19.9474 0.647137C19.9007 0.52318 19.8298 0.409746 19.7388 0.313426C19.6479 0.217106 19.5387 0.139817 19.4176 0.086051C19.2965 0.0322847 19.166 0.00311279 19.0335 0.000227928C18.9011 -0.00265694 18.7694 0.0208044 18.6461 0.0692482C18.5228 0.117692 18.4103 0.190153 18.3153 0.282423L10.0002 8.13442L1.68725 0.282423Z"
            fill="black"
          />
        </svg>
      </S.Content>
      {isVisible && (
        <>
          <S.Overlay onClick={() => setIsVisible(false)} />
          <S.OptionBox>
            {itemArray.map((item, index) => {
              const isObject = typeof item === "object" && item !== null;

              // 객체일 경우 main/sub 키를 사용하고, 문자열일 경우 전체를 main으로 사용
              const mainText = isObject ? item.main : item;
              const subText = isObject ? item.sub : null;
              // subText가 존재할 때만 두 줄 렌더링
              const isTwoLines = !!subText;
              return (
                <S.ItemWrapper
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  <S.ItemMain>
                    {mainText}
                    {isTwoLines && <S.ItemSub>{subText}</S.ItemSub>}
                  </S.ItemMain>
                </S.ItemWrapper>
              );
            })}
          </S.OptionBox>
        </>
      )}
    </S.Container>
  );
}
