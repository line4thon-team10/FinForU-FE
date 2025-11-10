import { useTranslation } from "react-i18next";
import Navigation from "../../components/Navigation/Navigation";
import { useHeaderStore } from "../../stores/headerStore";
import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./MapStyle";

// 카카오맵 API 키 (.env)
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;
const DEFAULT_POSITION = { lat: 37.5665, lng: 126.978, accuracy: 300 };
const FILTER_CONFIGS = {
  hanabank: { type: "keyword", query: "하나은행" },
  kookminbank: { type: "keyword", query: "국민은행" },
  shinhanbank: { type: "keyword", query: "신한은행" },
  wooribank: { type: "keyword", query: "우리은행" },
  foreign: { type: "keyword", query: "외국인특화지점 은행" },
  general: { type: "category", code: "BK9" },
  atm: { type: "category", code: "AT4" },
};

export default function Map() {
  const { t, i18n } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerOverlayRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const placeMarkersRef = useRef([]);
  const hasCenteredToCurrentRef = useRef(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_POSITION);
  const [selectedFilter, setSelectedFilter] = useState("general");
  const [places, setPlaces] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const buildUserMarkerContent = useCallback(() => {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "48px";
    container.style.height = "48px";
    container.style.pointerEvents = "none";

    const halo = document.createElement("div");
    halo.style.position = "absolute";
    halo.style.top = "0";
    halo.style.left = "0";
    halo.style.width = "48px";
    halo.style.height = "48px";
    halo.style.borderRadius = "50%";
    halo.style.background = "rgba(0, 156, 234, 0.2)";

    const inner = document.createElement("div");
    inner.style.position = "absolute";
    inner.style.top = "50%";
    inner.style.left = "50%";
    inner.style.transform = "translate(-50%, -50%)";
    inner.style.width = "22px";
    inner.style.height = "22px";
    inner.style.borderRadius = "50%";
    inner.style.background = "#009cea";
    inner.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

    const core = document.createElement("div");
    core.style.position = "absolute";
    core.style.top = "50%";
    core.style.left = "50%";
    core.style.transform = "translate(-50%, -50%)";
    core.style.width = "8px";
    core.style.height = "8px";
    core.style.borderRadius = "50%";
    core.style.background = "#ffffff";

    container.appendChild(halo);
    container.appendChild(inner);
    container.appendChild(core);

    return container;
  }, []);

  const clearPlaceMarkers = useCallback(() => {
    placeMarkersRef.current.forEach((marker) => marker.setMap(null));
    placeMarkersRef.current = [];
  }, []);

  const performSearch = useCallback(
    (filterId, position) => {
      if (!mapInstanceRef.current || !window.kakao?.maps?.services) {
        return;
      }

      const config = FILTER_CONFIGS[filterId] || FILTER_CONFIGS.general;
      const service = new window.kakao.maps.services.Places();
      const center = new window.kakao.maps.LatLng(position.lat, position.lng);
      const options = { location: center, radius: 5000 };

      setIsSearching(true);
      setSearchError(null);
      clearPlaceMarkers();
      setSelectedPlace(null);
      setIsDetailOpen(false);

      const callback = (data, status) => {
        setIsSearching(false);

        if (status === window.kakao.maps.services.Status.OK) {
          const limited = data.slice(0, 8);
          setPlaces(limited);

          const bounds = new window.kakao.maps.LatLngBounds();
          let hasBounds = false;

          limited.forEach((place) => {
            const lat = Number(place.y);
            const lng = Number(place.x);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return;

            const positionLatLng = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              position: positionLatLng,
            });
            marker.setMap(mapInstanceRef.current);
            window.kakao.maps.event.addListener(marker, "click", () => {
              setSelectedPlace(place);
              setIsDetailOpen(true);
            });
            placeMarkersRef.current.push(marker);
            bounds.extend(positionLatLng);
            hasBounds = true;
          });

          if (hasBounds && !hasCenteredToCurrentRef.current) {
            mapInstanceRef.current.setBounds(bounds);
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setPlaces([]);
          setSearchError(null);
        } else {
          setPlaces([]);
          setSearchError("검색 중 오류가 발생했습니다.");
        }
      };

      if (config.type === "category") {
        service.categorySearch(config.code, callback, options);
      } else {
        service.keywordSearch(config.query, callback, { ...options, size: 15 });
      }
    },
    [clearPlaceMarkers]
  );

  useEffect(() => {
    return () => {
      clearPlaceMarkers();
      if (userMarkerOverlayRef.current) {
        userMarkerOverlayRef.current.setMap(null);
        userMarkerOverlayRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.setMap(null);
        userAccuracyCircleRef.current = null;
      }
    };
  }, [clearPlaceMarkers]);

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.map"),
      showBackBtn: false,
      showSettingBtn: true,
    });
  }, [setHeaderConfig, i18n.language]);

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        hasCenteredToCurrentRef.current = false;
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy ?? 0,
        });
      },
      (error) => {
        console.error("현재 위치를 가져오지 못했습니다:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  // 카카오맵 스크립트 동적 로드
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY) {
      console.error("카카오맵 API 키(VITE_KAKAO_MAP_API_KEY)가 설정되지 않았습니다.");
      return;
    }

    const scriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;

    const handleScriptLoad = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          setIsScriptLoaded(true);
        });
      } else {
        console.error("카카오맵 객체를 초기화할 수 없습니다.");
      }
    };

    if (window.kakao && window.kakao.maps) {
      handleScriptLoad();
      return;
    }

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", handleScriptLoad, { once: true });
      return () => existingScript.removeEventListener("load", handleScriptLoad);
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptUrl;
    script.async = true;
    script.addEventListener("load", handleScriptLoad, { once: true });
    script.addEventListener("error", () => {
      console.error("카카오맵 스크립트 로드 실패");
    });
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
    };
  }, []);

  // 지도 초기화 및 현재 위치 반영 (지도는 이동 가능, 마커만 현재 위치 표시)
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    const mapCenter = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
    const accuracyRadius =
      currentPosition.accuracy && currentPosition.accuracy > 0
        ? Math.min(Math.max(currentPosition.accuracy, 150), 2000)
        : 300;

    if (!mapInstanceRef.current) {
      const container = mapRef.current;
      const options = {
        center: mapCenter,
        level: 3,
      };
      const kakaoMap = new window.kakao.maps.Map(container, options);
      kakaoMap.setDraggable(true);
      kakaoMap.setZoomable(true);

      mapInstanceRef.current = kakaoMap;
      hasCenteredToCurrentRef.current = false;

      window.kakao.maps.event.addListener(kakaoMap, "dragstart", () => {
        hasCenteredToCurrentRef.current = true;
      });

      const userMarkerOverlay = new window.kakao.maps.CustomOverlay({
        position: mapCenter,
        content: buildUserMarkerContent(),
        yAnchor: 0.5,
        xAnchor: 0.5,
        zIndex: 3,
      });
      userMarkerOverlay.setMap(kakaoMap);
      userMarkerOverlayRef.current = userMarkerOverlay;

      const accuracyCircle = new window.kakao.maps.Circle({
        center: mapCenter,
        radius: accuracyRadius,
        strokeWeight: 0,
        fillColor: "rgba(0, 156, 234, 0.2)",
        fillOpacity: 1,
      });
      accuracyCircle.setMap(kakaoMap);
      userAccuracyCircleRef.current = accuracyCircle;

      performSearch(selectedFilter, currentPosition);
    } else {
      if (!hasCenteredToCurrentRef.current) {
        mapInstanceRef.current.panTo(mapCenter);
        hasCenteredToCurrentRef.current = true;
      }

      if (!userMarkerOverlayRef.current) {
        const userMarkerOverlay = new window.kakao.maps.CustomOverlay({
          position: mapCenter,
          content: buildUserMarkerContent(),
          yAnchor: 0.5,
          xAnchor: 0.5,
          zIndex: 3,
        });
        userMarkerOverlay.setMap(mapInstanceRef.current);
        userMarkerOverlayRef.current = userMarkerOverlay;
      } else {
        userMarkerOverlayRef.current.setPosition(mapCenter);
      }

      if (!userAccuracyCircleRef.current) {
        const accuracyCircle = new window.kakao.maps.Circle({
          center: mapCenter,
          radius: accuracyRadius,
          strokeWeight: 0,
          fillColor: "rgba(0, 156, 234, 0.2)",
          fillOpacity: 1,
        });
        accuracyCircle.setMap(mapInstanceRef.current);
        userAccuracyCircleRef.current = accuracyCircle;
      } else {
        userAccuracyCircleRef.current.setOptions({
          center: mapCenter,
          radius: accuracyRadius,
        });
      }
    }
  }, [isScriptLoaded, currentPosition, performSearch, selectedFilter, buildUserMarkerContent]);

  useEffect(() => {
    if (!isScriptLoaded || !mapInstanceRef.current) return;
    performSearch(selectedFilter, currentPosition);
  }, [isScriptLoaded, selectedFilter, currentPosition, performSearch]);


  // 필터 버튼 데이터
  const bankFilters = [
    { id: "hanabank", label: "Hana Bank" },
    { id: "kookminbank", label: "Kookmin Bank" },
    { id: "shinhanbank", label: "Shinhan Bank" },
    { id: "wooribank", label: "Woori Bank" },
  ];

  const serviceFilters = [
    { id: "foreign", label: t("map.foreignExclusiveBranch"), icon: "building" },
    { id: "general", label: t("map.generalBank"), icon: "globe" },
    { id: "atm", label: t("map.atm"), icon: "atm" },
  ];

  const handleFilterClick = (id) => {
    setSelectedFilter(id);
    hasCenteredToCurrentRef.current = false;
  };

  const handleCardClick = (place) => {
    setSelectedPlace(place);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
  };

  const formatDistance = (distance) => {
    if (!distance) return null;
    const num = Number(distance);
    if (Number.isNaN(num)) return null;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} km`;
    return `${Math.round(num)} m`;
  };

  const selectedDistanceLabel = selectedPlace ? formatDistance(selectedPlace.distance) : null;

  return (
    <>
      <S.Container>
        <S.FilterSection>
          <S.FilterRow>
            {bankFilters.map((filter) => (
              <S.FilterButton
                key={filter.id}
                $isActive={selectedFilter === filter.id}
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.label}
              </S.FilterButton>
            ))}
          </S.FilterRow>
          <S.FilterRow>
            {serviceFilters.map((filter) => (
              <S.FilterButton
                key={filter.id}
                $isActive={selectedFilter === filter.id}
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.icon === "building" && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 14H14V6H2V14ZM3 7H6V9H3V7ZM3 10H6V12H3V10ZM10 7H13V9H10V7ZM10 10H13V12H10V10ZM8 4V2H6V4H4L8 8L12 4H10Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {filter.icon === "globe" && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 13.5C5.51 13.5 3.5 11.49 3.5 9C3.5 8.42 3.63 7.87 3.85 7.37L7.5 11.02V12.5H8.5V10.5H6.5V9.5H8.5V8.5H6.5V7.5H8.5V6.5H6.5V5.5H8.5V4.5H10.5V5.5H12.5V6.5H10.5V7.5H12.5V8.5H10.5V9.5H12.5V10.5H10.5V11.02L12.15 7.37C12.37 7.87 12.5 8.42 12.5 9C12.5 11.49 10.49 13.5 8 13.5Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {filter.icon === "atm" && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 2H14V14H2V2ZM3 3V13H13V3H3ZM5 5H11V7H5V5ZM5 9H11V11H5V9Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {filter.label}
              </S.FilterButton>
            ))}
          </S.FilterRow>
        </S.FilterSection>

        <S.MapWrapper>
          <S.MapCanvas ref={mapRef} />
        </S.MapWrapper>

        <S.CardSection>
          <S.CardRow>
            {isSearching ? (
              <S.InfoCard $isInteractive={false}>
                <S.CardInfo>주변 정보를 불러오는 중입니다...</S.CardInfo>
              </S.InfoCard>
            ) : searchError ? (
              <S.InfoCard $isInteractive={false}>
                <S.CardInfo>{searchError}</S.CardInfo>
              </S.InfoCard>
            ) : places.length === 0 ? (
              <S.InfoCard $isInteractive={false}>
                <S.CardInfo>주변에 표시할 지점이 없습니다.</S.CardInfo>
              </S.InfoCard>
            ) : (
              places.map((place) => {
                const distanceLabel = formatDistance(place.distance);
                return (
                  <S.InfoCard
                    key={place.id}
                    $isActive={selectedPlace?.id === place.id}
                    $isInteractive
                    onClick={() => handleCardClick(place)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handleCardClick(place);
                        event.preventDefault();
                      }
                    }}
                  >
                    <S.CardTitle>{place.place_name}</S.CardTitle>
                    <S.CardInfo>{place.road_address_name || place.address_name}</S.CardInfo>
                    {distanceLabel && <S.CardInfo>{distanceLabel}</S.CardInfo>}
                    {place.phone && <S.CardInfo>{place.phone}</S.CardInfo>}
                    <S.CardLink href={place.place_url} target="_blank" rel="noopener noreferrer">
                      상세보기
                    </S.CardLink>
                  </S.InfoCard>
                );
              })
            )}
          </S.CardRow>
        </S.CardSection>
        {selectedPlace && (
          <S.DetailSheet $isOpen={isDetailOpen}>
            <S.DetailHandle />
            <S.DetailHeader>
              <S.DetailAvatar>{selectedPlace.place_name?.[0] || "?"}</S.DetailAvatar>
              <div>
                <S.DetailTitle>{selectedPlace.place_name}</S.DetailTitle>
                {(selectedPlace.category_group_name || selectedPlace.category_name) && (
                  <S.DetailSubtitle>
                    {selectedPlace.category_group_name || selectedPlace.category_name}
                  </S.DetailSubtitle>
                )}
              </div>
              <S.DetailCloseButton type="button" onClick={handleDetailClose} aria-label="닫기">
                &times;
              </S.DetailCloseButton>
            </S.DetailHeader>
            <S.DetailBody>
              <S.DetailRow>
                <S.DetailIcon aria-hidden>
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.333C5.053 1.333 2.667 3.72 2.667 6.667c0 3.72 4.266 7.667 5.106 8.396.135.116.32.116.454 0 .84-.729 5.106-4.676 5.106-8.396C13.333 3.72 10.947 1.333 8 1.333Zm0 6.667a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                      fill="currentColor"
                    />
                  </svg>
                </S.DetailIcon>
                <span>{selectedPlace.road_address_name || selectedPlace.address_name}</span>
              </S.DetailRow>
              {selectedPlace.phone && (
                <S.DetailRow>
                  <S.DetailIcon aria-hidden>
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4.667 1.333H2A.667.667 0 0 0 1.333 2c0 6.443 6.224 12.667 12.667 12.667a.667.667 0 0 0 .667-.667v-2.667a.667.667 0 0 0-.667-.667h-2.4a.667.667 0 0 0-.627.44l-.667 1.867c-1.92-.64-3.453-2.173-4.093-4.093l1.867-.667a.667.667 0 0 0 .44-.627V2A.667.667 0 0 0 7.333 1.333H4.667Z"
                        fill="currentColor"
                      />
                    </svg>
                  </S.DetailIcon>
                  <span>{selectedPlace.phone}</span>
                </S.DetailRow>
              )}
              {selectedPlace.place_url && (
                <S.DetailRow>
                  <S.DetailIcon aria-hidden>
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M9.333 2.667A2.667 2.667 0 0 1 12 5.333V6h-1.333v-.667A1.333 1.333 0 0 0 9.333 4H6.667A1.333 1.333 0 0 0 5.333 5.333v5.334A1.333 1.333 0 0 0 6.667 12h2.666a1.333 1.333 0 0 0 1.334-1.333V10H12v.667A2.667 2.667 0 0 1 9.333 13.333H6.667A2.667 2.667 0 0 1 4 10.667V5.333A2.667 2.667 0 0 1 6.667 2.667h2.666Z"
                        fill="currentColor"
                      />
                      <path d="M8 7.333h6v1.334H8V7.333Z" fill="currentColor" />
                      <path d="M12.667 5.333 16 8l-3.333 2.667V5.333Z" fill="currentColor" />
                    </svg>
                  </S.DetailIcon>
                  <S.DetailLink href={selectedPlace.place_url} target="_blank" rel="noopener noreferrer">
                    카카오맵에서 보기
                  </S.DetailLink>
                </S.DetailRow>
              )}
              {selectedDistanceLabel && (
                <S.DetailRow>
                  <S.DetailIcon aria-hidden>
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.333 3.333a1.333 1.333 0 1 1 2.667 0 1.333 1.333 0 0 1-2.667 0Zm-2 0A3.333 3.333 0 1 0 7 3.333a3.333 3.333 0 0 0-5.667 0Z"
                        fill="currentColor"
                      />
                      <path
                        d="M7.333 3.333H9a3.333 3.333 0 0 1 3.333 3.334V8h-1.333V6.667A2 2 0 0 0 9 4.667H7.333v-1.334Z"
                        fill="currentColor"
                      />
                      <path d="M10.667 8H6.667v1.333h2.667V12h1.333V8Z" fill="currentColor" />
                      <path d="m10.333 13.333 2 2 2-2h-4Z" fill="currentColor" />
                    </svg>
                  </S.DetailIcon>
                  <span>현재 위치에서 {selectedDistanceLabel} 거리</span>
                </S.DetailRow>
              )}
            </S.DetailBody>
          </S.DetailSheet>
        )}
      </S.Container>
      <Navigation />
    </>
  );
}
