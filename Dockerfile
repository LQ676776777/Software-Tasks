FROM library/amazoncorretto:17

# 设置工作目录
WORKDIR /app

# 复制你的 JAR 文件到容器中（注意替换为你的实际 JAR 名）
COPY HustDIDIBackend-0.0.1-SNAPSHOT.jar app.jar

# 暴露端口（根据你的 application.properties 中的 server.port，比如 8080）
EXPOSE 9000

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]