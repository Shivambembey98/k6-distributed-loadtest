import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 500 },    // ramp-up to 500 VUs
    { duration: '3m', target: 500 },    // hold at 500 VUs
    { duration: '1m', target: 0 },      // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
  ext: {
    influxdb: {
      pushInterval: '5s', // push every 5 seconds (avoid bulk)
      tags: { test_env: 'uat' }
    }
  }
};

export default function () {
  const res = http.get('https://uat.rentte.com/');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
