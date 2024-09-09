# Используем официальный Node.js образ для сборки React приложения
FROM node:18 AS build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение для продакшена
RUN npm run build

# Используем Nginx для сервировки файлов в продакшене
FROM nginx:alpine

# Копируем собранные файлы React приложения в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем файл конфигурации Nginx (если нужно настроить кастомные правила)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 для Nginx
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
