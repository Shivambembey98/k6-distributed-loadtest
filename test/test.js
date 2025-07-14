import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, 
  stages: [
    { duration: '10s', target: 2 }, 
    { duration: '10s', target: 5 }, 
    { duration: '10s', target: 7 }, 
    { duration: '30s', target: 10 }, 
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<8000'],
    http_req_failed: ['rate<0.05'],
  },
  ext: {
    influxdb: {
      pushInterval: '10s',
      tags: { env: 'uat' },
    }
  }
};

export default function () {
  const url = 'https://uat-backend.rentte.com/user/auth/login';

  const payload = JSON.stringify({
    email: 'ashwani@yopmail.com',
    password: 'Partner@123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    },
    timeout: '60s'
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has token in result': (r) => {
      if (!r || !r.body) return false;
      try {
        const json = r.json();
        return json.result && json.result.token !== undefined;
      } catch (e) {
        return false;
      }
    }
  });

  sleep(1);
}
