import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100000, 
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<8000'], // More realistic for UAT
    http_req_failed: ['rate<0.05'],   // Up to 5% errors tolerable in high-load UAT
  },
  ext: {
    influxdb: {
      // Reduce the amount of data pushed to InfluxDB
      pushInterval: '5s', // Higher interval = fewer requests
      tags: { env: 'uat' },
    }
  }
};

export default function () {
  const res = http.get('https://uat.rentte.com/', { timeout: '60s' });
  check(res, {
    'is status 200': (r) => r.status === 200,
    'body not empty': (r) => r.body && r.body.length > 0,
  });
  sleep(1); // Keep traffic realistic
}
