// 웹소켓 서버 - 짐프리 앱
// Node.js와 ws 라이브러리 사용

const WebSocket = require('ws');
const http = require('http');

// HTTP 서버 생성
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// 연결된 클라이언트들을 저장 (사용자 타입별로 분류)
const clients = {
  customer: new Set(),
  partner: new Set(),
  driver: new Set()
};

// userId로 클라이언트를 추적 (중복 연결 방지)
const clientsByUserId = new Map();

// 콜 ID 카운터
let callIdCounter = 1;

// 활성 콜 목록
const activeCalls = new Map();

console.log('🚀 짐프리 웹소켓 서버 시작 중...');

wss.on('connection', (ws, req) => {
  console.log('✅ 새로운 클라이언트 연결됨:', req.socket.remoteAddress);
  
  let userType = null;
  let userId = null;

  // 클라이언트로부터 메시지 수신
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 수신된 메시지:', data);

      switch (data.type) {
        case 'AUTH':
          // 인증 메시지 처리
          userType = data.userType;
          userId = data.userId;
          
          // 기존 연결이 있으면 제거
          if (clientsByUserId.has(userId)) {
            const oldWs = clientsByUserId.get(userId);
            const oldUserType = oldWs.userType;
            if (clients[oldUserType]) {
              clients[oldUserType].delete(oldWs);
            }
            console.log(`🔄 기존 연결 제거됨: ${userId}`);
          }
          
          // 사용자 타입별로 클라이언트 분류
          if (clients[userType]) {
            clients[userType].add(ws);
            ws.userType = userType;
            ws.userId = userId;
            clientsByUserId.set(userId, ws);
            console.log(`👤 사용자 인증됨: ${userId} (${userType})`);
            console.log(`📊 현재 연결 수 - 고객: ${clients.customer.size}, 가맹점: ${clients.partner.size}, 배달기사: ${clients.driver.size}`);
          }
          
          // 인증 성공 응답
          ws.send(JSON.stringify({
            type: 'AUTH_SUCCESS',
            message: '인증 성공'
          }));
          break;

        case 'CREATE_STORAGE_CALL':
          // 짐 보관 콜 생성
          const storageCallId = callIdCounter++;
          const storageCall = {
            id: storageCallId,
            type: data.data.type || 'storage',
            customerName: data.data.customerName || '고객',
            customerPhone: data.data.customerPhone || '010-0000-0000',
            itemType: data.data.itemType || '캐리어',
            itemCount: data.data.itemCount || 1,
            startTime: data.data.startTime,
            endTime: data.data.endTime,
            address: data.data.address,
            memo: data.data.memo,
            requestTime: new Date().toLocaleTimeString('ko-KR'),
            estimatedPrice: data.data.price || 5000,
            status: 'pending'
          };
          
          activeCalls.set(storageCallId, storageCall);
          console.log(`📦 새로운 보관 콜 생성: #${storageCallId}`);
          
          // 모든 가맹점에게 새로운 콜 전송
          clients.partner.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'NEW_CALL',
                data: storageCall
              }));
            }
          });
          
          console.log(`📢 ${clients.partner.size}개 가맹점에게 콜 전송됨`);
          
          // 고객에게 콜 생성 확인
          ws.send(JSON.stringify({
            type: 'CALL_CREATED',
            callId: storageCallId,
            message: '보관 요청이 전송되었습니다'
          }));
          break;

        case 'CREATE_DELIVERY_CALL':
          // 짐 배달 콜 생성
          const deliveryCallId = callIdCounter++;
          const deliveryCall = {
            id: deliveryCallId,
            startLocation: data.data.startLocation || '출발지',
            startAddress: data.data.startAddress,
            endLocation: data.data.endLocation || '도착지',
            endAddress: data.data.endAddress,
            distance: data.data.distance || '5km',
            estimatedPrice: data.data.price || 10000,
            itemType: data.data.itemType || '캐리어',
            itemCount: data.data.itemCount || 1,
            requestTime: new Date().toLocaleTimeString('ko-KR'),
            desiredArrivalTime: data.data.desiredArrivalTime,
            memo: data.data.memo,
            urgency: data.data.urgency || 'normal',
            status: 'pending'
          };
          
          activeCalls.set(deliveryCallId, deliveryCall);
          console.log(`🚚 새로운 배달 콜 생성: #${deliveryCallId}`);
          
          // 모든 배달기사에게 새로운 콜 전송
          clients.driver.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'NEW_CALL',
                data: deliveryCall
              }));
            }
          });
          
          console.log(`📢 ${clients.driver.size}명 배달기사에게 콜 전송됨`);
          
          // 고객에게 콜 생성 확인
          ws.send(JSON.stringify({
            type: 'CALL_CREATED',
            callId: deliveryCallId,
            message: '배달 요청이 전송되었습니다'
          }));
          break;

        case 'ACCEPT_CALL':
          // 콜 수락
          const acceptedCallId = data.callId;
          const call = activeCalls.get(acceptedCallId);
          
          if (call) {
            call.status = 'accepted';
            call.acceptedBy = userId;
            console.log(`✅ 콜 #${acceptedCallId} 수락됨 by ${userId} (${data.userType})`);
            
            // 수락한 사람에게 확인 전송
            ws.send(JSON.stringify({
              type: 'CALL_ACCEPT_SUCCESS',
              callId: acceptedCallId,
              message: '콜을 수락했습니다'
            }));
            
            // 🔥 중요: 모든 클라이언트(고객 포함)에게 콜이 수락되었음을 알림
            const allClients = [...clients.customer, ...clients.partner, ...clients.driver];
            allClients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'CALL_ACCEPTED',
                  callId: acceptedCallId,
                  userType: data.userType, // 'partner' 또는 'driver'
                  data: {
                    callId: acceptedCallId,
                    acceptedBy: userId,
                    acceptedByType: data.userType
                  }
                }));
              }
            });
            
            console.log(`📢 ${allClients.length - 1}개 클라이언트에게 CALL_ACCEPTED 전송 완료 (userType: ${data.userType})`);
          } else {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: '콜을 찾을 수 없습니다'
            }));
          }
          break;

        case 'CANCEL_CALL':
          // 콜 취소
          const cancelledCallId = data.callId;
          activeCalls.delete(cancelledCallId);
          console.log(`❌ 콜 #${cancelledCallId} 취소됨`);
          
          // 모든 클라이언트에게 콜 취소 알림
          [...clients.partner, ...clients.driver].forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'CALL_CANCELLED',
                callId: cancelledCallId
              }));
            }
          });
          break;

        case 'NEW_CALL':
          // 클라이언트에서 보낸 NEW_CALL 메시지 처리
          const targetUserType = data.userType; // 'partner' or 'driver'
          const callData = data.call;
          
          // 활성 콜 목록에 저장
          if (callData && callData.id) {
            activeCalls.set(callData.id, callData);
            console.log(`📞 새로운 콜 저장: #${callData.id}, 타입: ${callData.type || 'N/A'}`);
          }
          
          // 대상 사용자 타입의 모든 클라이언트에게 콜 전송
          if (clients[targetUserType]) {
            let sentCount = 0;
            clients[targetUserType].forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'NEW_CALL',
                  data: callData
                }));
                sentCount++;
              }
            });
            console.log(`📢 ${sentCount}개 ${targetUserType} 클라이언트에게 콜 전송됨`);
          } else {
            console.log(`⚠️ 알 수 없는 사용자 타입: ${targetUserType}`);
          }
          
          // 발신자에게 확인 전송
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'CALL_CREATED',
              callId: callData?.id,
              message: '콜이 전송되었습니다'
            }));
          }
          break;

        default:
          console.log('⚠️ 알 수 없는 메시지 타입:', data.type);
      }
    } catch (error) {
      console.error('❌ 메시지 처리 에러:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: '메시지 처리 중 오류가 발생했습니다'
      }));
    }
  });

  // 클라이언트 연결 종료
  ws.on('close', () => {
    console.log('👋 클라이언트 연결 종료:', userId || '익명');
    
    // 연결 종료된 클라이언트 제거
    if (userType && clients[userType]) {
      clients[userType].delete(ws);
    }
    
    // userId 맵에서도 제거 (현재 연결과 같은 경우만)
    if (userId && clientsByUserId.get(userId) === ws) {
      clientsByUserId.delete(userId);
    }
    
    console.log(`📊 현재 연결 수 - 고객: ${clients.customer.size}, 가맹점: ${clients.partner.size}, 배달기사: ${clients.driver.size}`);
  });

  // 에러 처리
  ws.on('error', (error) => {
    console.error('❌ 웹소켓 에러:', error);
  });

  // 연결 확인 메시지
  ws.send(JSON.stringify({
    type: 'CONNECTED',
    message: '웹소켓 서버에 연결되었습니다'
  }));
});

// 서버 시작
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 웹소켓 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📡 클라이언트는 ws://YOUR_IP:${PORT}/ws 로 연결하세요`);
  console.log(`💡 로컬: ws://localhost:${PORT}/ws`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️  서버 종료 중...');
  server.close(() => {
    console.log('✅ 서버가 정상적으로 종료되었습니다');
  });
});
