#Use official maven image to build the spring boot app
FROM maven:3.8.4-openjdk-17 AS build

#working dir
WORKDIR /app

#Copy our pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

#Copy source code and build app
COPY src ./src
RUN mvn clean package -DskipTests

#Use official OpenJDK image to run app
FROM openjdk:17-jdk-slim

#Set work dir
WORKDIR /app

#Copy built jar file from the build stage
COPY --from=build /app/target/tweak-my-resume-0.0.1-SNAPSHOT.jar .

EXPOSE 8080
#Specify command to run the app
ENTRYPOINT ["java", "-jar", "/app/tweak-my-resume-0.0.1-SNAPSHOT.jar"]
