import styled from "styled-components";

const SAFE_TOP = "env(safe-area-inset-top, 0px)";
const SAFE_BOTTOM = "env(safe-area-inset-bottom, 0px)";
const HEADER_HEIGHT = "3.5625rem";
const NAV_HEIGHT = "5rem";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
  margin: 0 auto;
  padding-top: calc(${HEADER_HEIGHT} + ${SAFE_TOP});
  padding-bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM});
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  background-color: #e5e5e5;
  z-index: 1;
`;

export const MapCanvas = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const FilterSection = styled.div`
  position: absolute;
  top: calc(${HEADER_HEIGHT} + ${SAFE_TOP} + 0.75rem);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1.25rem;
  z-index: 2;
  pointer-events: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const FilterRow = styled.div`
  display: flex;
  gap: 0.625rem;
  overflow-x: auto;
  margin: 0 -1.25rem;
  padding: 0 1.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  pointer-events: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterButton = styled.button`
  background-color: ${({ $isActive }) => ($isActive ? "#009CEA" : "#fff")};
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#000")};
  border: 1px solid ${({ $isActive }) => ($isActive ? "#009CEA" : "var(--color-secondary-gray)")};
  border-radius: 0.625rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? "#009CEA" : "#f5f5f5")};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const InfoCard = styled.div`
  background-color: #fff;
  border: 1px solid ${({ $isActive }) => ($isActive ? "#009cea" : "var(--color-secondary-gray)")};
  border-radius: 0.625rem;
  padding: 1rem;
  min-width: 280px;
  flex-shrink: 0;
  pointer-events: auto;
  cursor: ${({ $isInteractive }) => ($isInteractive ? "pointer" : "default")};
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  ${({ $isInteractive }) =>
    $isInteractive &&
    `
  &:active {
    transform: scale(0.98);
  }

  `}

  ${({ $isActive }) =>
    $isActive &&
    `
      box-shadow: 0 8px 24px rgba(0, 156, 234, 0.25);
    `}
`;

export const CardSection = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 2.5rem);
  padding: 0 1.25rem;
  z-index: 2;
  pointer-events: auto;
`;

export const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.5rem;
`;

export const CardInfo = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.375rem;
  line-height: 1.5;
`;

export const CardRow = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  margin: 0 -1.25rem;
  padding: 0 1.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  pointer-events: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #009CEA;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const DetailSheet = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 1.5rem);
  padding: 0 1.25rem;
  z-index: 3;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  transform: translateY(${({ $isOpen }) => ($isOpen ? "0%" : "110%")});
  transition: transform 0.3s ease;
`;

export const DetailHandle = styled.div`
  width: 52px;
  height: 6px;
  margin: 0 auto 0.85rem;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem 1rem;
  border-radius: 1.5rem 1.5rem 0 0;
  background-color: #ffffff;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.08);
  position: relative;
`;

export const DetailAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #009cea, #31c0ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const DetailTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111;
  margin: 0;
`;

export const DetailSubtitle = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #6b6b6b;
`;

export const DetailCloseButton = styled.button`
  position: absolute;
  top: 1.1rem;
  right: 1.25rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  color: #222;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
`;

export const DetailBody = styled.div`
  background-color: #ffffff;
  border-radius: 0 0 1.5rem 1.5rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  padding: 0.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #333;
  line-height: 1.5;
`;

export const DetailIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #009cea;

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }
`;

export const DetailLink = styled.a`
  color: #0077ff;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

