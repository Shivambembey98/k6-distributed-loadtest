import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<8000'], // SLA: 95% of requests < 8s
    http_req_failed: ['rate<0.05'],    // SLA: <5% request failures
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
    'has token or success message': (r) =>
      r.json('token') !== undefined || r.json('accessToken') !== undefined || r.body.includes('success'),
  });

  sleep(1);
}
