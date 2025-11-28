// 카카오맵 API 설정
// 여기에 발급받은 카카오맵 JavaScript 키를 입력하세요
// https://developers.kakao.com/console/app 에서 키를 발급받을 수 있습니다

export const KAKAO_MAP_API_KEY = 'acf45a12f8253a1ad957c414b5f93263'; // 여기에 카카오맵 API 키를 입력하세요

// API 키가 비어있으면 Mock 지도를 사용합니다
export const isKakaoMapAvailable = () => {
  return KAKAO_MAP_API_KEY !== '';
};
