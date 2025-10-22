package com.se.hustcar.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * ClassName: LoginInterceptor
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 20:48
 * @Veision 1.0
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        System.out.println("请求方法: " + request.getMethod());
        System.out.println("请求路径: " + request.getRequestURI());
        System.out.println("请求参数: " + request.getQueryString());
        System.out.println("请求头: " + request.getHeaderNames());
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(401);
            response.getWriter().write("please login first");
            return false;
        }
        return true; // 继续处理请求
    }
}
