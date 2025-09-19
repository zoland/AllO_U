#!/bin/bash

# Build (если нужно)
echo "📦 Подготовка к деплою..."

# Создание ветки gh-pages
git checkout -b gh-pages

# Коммит
git add .
git commit -m "Deploy to GitHub Pages"

# Пуш на GitHub Pages
git push origin gh-pages --force

# Возврат на main
git checkout main

echo "✅ Деплой завершен!"
echo "🌐 Доступно по адресу: https://zoland.github.io/AllO_U/"