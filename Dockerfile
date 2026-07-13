FROM denoland/deno:2.7.11 AS builder
WORKDIR /app

COPY deno.json .
COPY deno.lock .
COPY . .

RUN deno compile --unstable-raw-imports --allow-env --allow-net --allow-read=./ --allow-write=./commands.json --output /bot ./main.ts

FROM debian:11-slim
WORKDIR /app

COPY --from=builder /bot .

CMD ["/app/bot"]
