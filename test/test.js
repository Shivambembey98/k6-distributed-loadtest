import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100000,         // Number of virtual users per node
  duration: '5m',     // Duration of the test
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests should be < 500ms
    http_req_failed: ['rate<0.01'],    // Errors should be < 1%
  }
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
