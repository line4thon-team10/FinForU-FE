import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  padding: calc(3.5625rem + 0.875rem) 1.875rem 6.75rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
`;

export const TopBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Toast = styled.div`
  width: 100%;
  max-width: 333px;
  padding: 0.625rem 0.75rem;
  background-color: var(--color-primary-sky-blue);
  color: var(--color-primary);
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 0.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Title = styled.div`
  color: #000;
  font-size: 1.1875rem;
  font-weight: 500;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  input {
    display: none;
  }

  label {
    height: 2.0625rem;
    width: 100%;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;
    background-color: #fff;
    border: 1px solid var(--color-input-gray);
    color: #000;
    font-size: 0.8125rem;
    font-weight: 400;
  }

  input[type="radio"]:checked + label {
    background-color: var(--color-secondary);
    color: #fff;
    border: none;
  }
`;

export const GraphWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const MiniTitle = styled.div`
  font-size: 1.0625rem;
  color: #000;
  font-weight: 500;
`;

export const RateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Rate = styled.div`
  font-size: 2rem;
  color: #000;
  font-weight: 500;
`;

export const TodayBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

export const Today = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #484848;
`;

export const TodayRate = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #ff6767;
`;
