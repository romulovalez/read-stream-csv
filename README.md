# Stream process big CSV files using worker threads for parallel processing

References:
- https://nodejs.org/api/stream.html#readable-streams
- https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
- https://nodejs.org/api/worker_threads.html

# Profiling

``` shell
tsx --prof script.ts
tsx --prof-process chunk.log > processed.txt
node -prof script.js
node --prof-process chunk-js.log > chunk-js.txt
node --prof-process line-js.log > line-js.txt
```
