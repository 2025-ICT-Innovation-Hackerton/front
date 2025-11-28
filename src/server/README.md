# 짐프리 웹소켓 서버

실시간 콜 알림을 위한 웹소켓 서버입니다.

## 설치 방법

1. 서버 디렉토리로 이동:
```bash
cd server
```

2. 필요한 패키지 설치:
```bash
npm install
```

## 실행 방법

### 일반 실행
```bash
npm start
```

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

## 서버 정보

- **기본 포트**: 8080
- **연결 주소**: `ws://YOUR_IP:8080/ws`
- **로컬 테스트**: `ws://localhost:8080/ws`

## IP 주소 확인 방법

### Windows
```bash
ipconfig
```
→ "IPv4 주소" 확인

### Mac/Linux
```bash
ifconfig
```
또는
```bash
hostname -I
```

## 프론트엔드 연결 설정

`/App.tsx` 파일에서 웹소켓 URL을 수정하세요:

```typescript
const websocket = useWebSocket({
  url: 'ws://YOUR_IP:8080/ws',  // 여기를 실제 IP로 변경
  // ...
});
```

예시:
```typescript
url: 'ws://192.168.0.23:8080/ws',  // 실제 IP 주소
```

## 메시지 타입

### 클라이언트 → 서버

1. **AUTH** - 인증
```json
{
  "type": "AUTH",
  "userId": "user_123",
  "userType": "customer" | "partner" | "driver"
}
```

2. **CREATE_STORAGE_CALL** - 짐 보관 요청
```json
{
  "type": "CREATE_STORAGE_CALL",
  "data": {
    "type": "storage" | "pre-delivery" | "post-delivery",
    "customerName": "김고객",
    "customerPhone": "010-1234-5678",
    "itemType": "캐리어",
    "itemCount": 2,
    "startTime": "2024-11-28 14:00",
    "endTime": "2024-11-28 18:00",
    "address": "서울시 강남구...",
    "memo": "메모",
    "price": 8000
  }
}
```

3. **CREATE_DELIVERY_CALL** - 짐 배달 요청
```json
{
  "type": "CREATE_DELIVERY_CALL",
  "data": {
    "startLocation": "GS25 강남점",
    "startAddress": "서울시 강남구...",
    "endLocation": "서울역",
    "endAddress": "서울시 용산구...",
    "distance": "8.5km",
    "price": 15000,
    "itemType": "캐리어",
    "itemCount": 2,
    "desiredArrivalTime": "오후 3:30",
    "memo": "메모",
    "urgency": "high" | "normal"
  }
}
```

4. **ACCEPT_CALL** - 콜 수락
```json
{
  "type": "ACCEPT_CALL",
  "callId": 1,
  "userType": "partner" | "driver"
}
```

5. **CANCEL_CALL** - 콜 취소
```json
{
  "type": "CANCEL_CALL",
  "callId": 1
}
```

### 서버 → 클라이언트

1. **CONNECTED** - 연결 성공
2. **AUTH_SUCCESS** - 인증 성공
3. **NEW_CALL** - 새로운 콜 알림 (가맹점/배달기사에게)
4. **CALL_CREATED** - 콜 생성 완료 (고객에게)
5. **CALL_ACCEPTED** - 콜이 수락됨
6. **CALL_CANCELLED** - 콜이 취소됨
7. **ERROR** - 에러 발생

## 테스트

서버가 실행되면 콘솔에 다음과 같은 로그가 표시됩니다:

```
🚀 짐프리 웹소켓 서버 시작 중...
🎉 웹소켓 서버가 포트 8080에서 실행 중입니다
📡 클라이언트는 ws://YOUR_IP:8080/ws 로 연결하세요
💡 로컬: ws://localhost:8080/ws
```

## 주의사항

1. **방화벽**: 8080 포트가 열려있어야 합니다
2. **네트워크**: 같은 네트워크에 연결되어야 합니다
3. **포트 변경**: 환경변수 `PORT`로 포트를 변경할 수 있습니다
   ```bash
   PORT=3001 npm start
   ```

## 문제 해결

### "EADDRINUSE" 에러
포트가 이미 사용 중입니다. 다른 포트를 사용하거나 기존 프로세스를 종료하세요.

### 연결이 안 될 때
1. 서버가 실행 중인지 확인
2. IP 주소가 올바른지 확인
3. 방화벽 설정 확인
4. 같은 네트워크에 있는지 확인

### 콘솔 로그
서버는 모든 연결과 메시지를 콘솔에 로그로 출력합니다. 문제가 생기면 서버 콘솔을 확인하세요.
