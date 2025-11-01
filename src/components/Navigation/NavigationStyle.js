import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 6.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.1875rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  right: max(calc(50vw - 393px / 2), 0px);
  left: auto;
  z-index: 100;
  padding: 1.25rem 2.1875rem 2.1875rem;
  border-top: 1px solid var(--color-secondary-gray);
`;

export const Button = styled.button`
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  & > div {
    color: var(--color-primary-gray);
    text-align: center;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  & > svg,
  div {
    color: ${({ $isActive }) => ($isActive ? "var(--color-primary)" : "var(--color-primary-gray)")};
  }
`;
