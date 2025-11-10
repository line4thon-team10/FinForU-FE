import { useTranslation } from "react-i18next";
import Navigation from "../../components/Navigation/Navigation";
import { useHeaderStore } from "../../stores/headerStore";
import { useEffect, useState, useRef } from "react";
import * as S from "./GuideStyle";

export default function Guide() {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatAreaRef = useRef(null);
  const messageEndRef = useRef(null);

  // 디자인 확인용 임시 데이터, api 연결 후 삭제
  const faqQuestions = [
    { question: "How to open a bank account?" },
    { question: "How to open a bank account?" },
    { question: "How to open a bank account?" },
  ];

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.guide"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: true, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  // 대화 내용 길어질 때 스크롤을 맨 아래로
  useEffect(() => {
    if (chatAreaRef.current && messageEndRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // AI 응답 생성
  const generateAIResponse = (question) => {
    setIsLoading(true);
    
    // 디자인 확인용 임시 응답
    setTimeout(() => {
      const response = "This is a sample AI response.";
      setMessages((prev) => [...prev, { type: "ai", text: response }]);
      setIsLoading(false);
    }, 1500);
  };

  // FAQ 버튼 클릭 핸들러
  const handleFAQClick = (question) => {
    handleSendMessage(question, true);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = (text = null, fromFAQ = false) => {
    // 로딩 중이면 새 질문 불가
    if (isLoading) return;
    
    const messageText = text || inputValue.trim();
    
    if (!messageText) return;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { type: "user", text: messageText }]);
    
    // 입력창 초기화
    if (!fromFAQ) {
      setInputValue("");
    }

    // AI 응답 생성
    generateAIResponse(messageText);
  };

  // Enter 키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSendMessage();
      }
    }
  };

  return (
    <>
      <S.Container>
        <S.ChatArea ref={chatAreaRef}>
          <S.WelcomeMessage>{t("guide.greeting")}</S.WelcomeMessage>
          
          {messages.length > 0 && (
            <S.MessageList>
              {messages.map((msg, index) => (
                msg.type === "user" ? (
                  <S.UserMessage key={index}>{msg.text}</S.UserMessage>
                ) : (
                  <S.AIMessage key={index}>{msg.text}</S.AIMessage>
                )
              ))}
              {isLoading && (
                <S.LoadingMessage>{t("guide.loading")}</S.LoadingMessage>
              )}
              <div ref={messageEndRef} />
            </S.MessageList>
          )}
          
          {isLoading && messages.length === 0 && (
            <S.LoadingMessage>{t("guide.loading")}</S.LoadingMessage>
          )}
        </S.ChatArea>

        <S.FAQSection>
          {faqQuestions.map((faq, index) => (
            <S.FAQButton
              key={index}
              onClick={() => handleFAQClick(faq.question)}
              disabled={isLoading}
            >
              {faq.question}
            </S.FAQButton>
          ))}
        </S.FAQSection>

        <S.InputSection>
          <S.InputField
            type="text"
            placeholder={t("guide.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <S.SendButton
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 3.33333L10 16.6667M10 3.33333L4.16667 9.16667M10 3.33333L15.8333 9.16667"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </S.SendButton>
        </S.InputSection>
      </S.Container>
      <Navigation />
    </>
  );
}
