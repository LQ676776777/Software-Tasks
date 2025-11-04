FROM library/amazoncorretto:17

WORKDIR /app

COPY HustDIDIBackend-0.0.2.jar app.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]