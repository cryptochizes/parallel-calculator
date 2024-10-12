# parallel-calculator
Parallel calculator


Start the application:
./start.sh

Using the artillery with the provided configuration - I've tested a few scenarious
and here's the report with avg values after 3 launches:

1. No clusters, no worker pools 3000 req/s

errors.ECONNRESET: 21,154.67
errors.EPIPE: 1.67
errors.ETIMEDOUT: 14,937.67
http.codes.201: 51,110.67
http.codes.400: 23,804.00
http.downloaded_bytes: 2,862,841.33 bytes
http.request_rate: 1,565.67 requests/sec
http.requests: 111,110.67
http.response_time.min: 4.0 ms
http.response_time.max: 10,045.0 ms
http.response_time.mean: 1,767.97 ms
http.response_time.median: 1,229.03 ms
http.response_time.p95: 5,357.6 ms
http.response_time.p99: 8,528.53 ms ​

2. 8 clusters, no worker pools 3000 req/s

errors.EAGAIN: 160.33
errors.ECONNRESET: 24,796.00
errors.EPIPE: 5.33
errors.ETIMEDOUT: 10,343.67
http.codes.201: 51,031.00
http.codes.400: 25,694.67
http.downloaded_bytes: 2,951,856.33 bytes
http.request_rate: 1,632.00 requests/sec
http.requests: 111,031.00
http.response_time.min: 0 ms
http.response_time.max: 10,001.3 ms
http.response_time.mean: 1,455.33 ms
http.response_time.median: 647.57 ms
http.response_time.p95: 6,497.13 ms
http.response_time.p99: 7,731.60 ms

3. No clusters, 7 worker threads in pool

errors.EAGAIN: ................................................................. 18
errors.ECONNRESET: ............................................................. 8146
errors.ETIMEDOUT: .............................................................. 42181
http.codes.201: ................................................................ 28577
http.codes.400: ................................................................ 9655
http.downloaded_bytes: ......................................................... 1388723
http.request_rate: ............................................................. 592/sec
http.requests: ................................................................. 88577
http.response_time:
  min: ......................................................................... 2
  max: ......................................................................... 10126
  mean: ........................................................................ 4757.5
  median: ...................................................................... 4965.3
  p95: ......................................................................... 9416.8
  p99: ......................................................................... 9801.2


4. 8 Clusters, 3 worker thread in pool for each


1000 rps it's the edge.
