import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  max-width: 393px;
  background-color: #fff;
  display: flex;
  gap: 3.125rem;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  right: max(calc(50vw - 393px / 2), 0px);
  left: auto;
  z-index: 100;
  padding: 2.5rem 0;

  & > button {
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.875rem 2.8125rem;
    height: 3.125rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 0.625rem;
  }
`;

export const BlueBtn = styled.button`
  background-color: var(--color-primary);
  /* 추후 active 효과도 고려 */
`;

export const GrayBtn = styled.button`
  background-color: var(--color-tertiary-gray);
`;
