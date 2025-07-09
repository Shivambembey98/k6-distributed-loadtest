import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000000, 
  stages: [
    { duration: '1m', target: 25000 },
    { duration: '1m', target: 50000 },
    { duration: '1m', target: 75000 },
    { duration: '1m', target: 100000 },
    { duration: '2m', target: 150000 },
    { duration: '2m', target: 200000 },
    { duration: '2m', target: 300000 },
    { duration: '2m', target: 400000 },
    { duration: '2m', target: 500000 },
    { duration: '2m', target: 600000 },
    { duration: '2m', target: 700000 },
    { duration: '2m', target: 800000 },
    { duration: '2m', target: 900000 },
    { duration: '5m', target: 1000000 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<8000'], // More realistic for UAT
    http_req_failed: ['rate<0.05'],   // Up to 5% errors tolerable in high-load UAT
  },
  ext: {
    influxdb: {
      // Reduce the amount of data pushed to InfluxDB
      pushInterval: '10s', // Higher interval = fewer requests
      tags: { env: 'uat' },
    }
  }
};

export default function () {
  const res = http.get('https://uat.rentte.com/', {
    timeout: '60s',
    headers: {
      'Connection': 'keep-alive',
    },
  });

  check(res, {
    'is status 200': (r) => r.status === 200,
    'body not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1); // Keep traffic realistic
}
