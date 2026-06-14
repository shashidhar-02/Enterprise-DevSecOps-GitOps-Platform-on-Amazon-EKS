package com.company.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class RateLimitingFilter implements GatewayFilter {

    private final ConcurrentMap<String, Integer> requestCounts = new ConcurrentHashMap<>();
    private final int limit = 100; // requests per minute

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String clientIp = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        String key = "rate_limit:" + clientIp;

        int count = requestCounts.getOrDefault(key, 0);
        if (count >= limit) {
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }

        requestCounts.put(key, count + 1);
        return chain.filter(exchange);
    }
}
