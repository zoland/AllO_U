#!/bin/bash

# Deploy script for AllO_G v1.2.0

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Заголовок
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       AllO_U Deployment Script         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}🚀 Deploying AllO_G v1.2.0...${NC}"
# Create version tag
VERSION="U_v1.2.0"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_DIR="deploy_${VERSION}_${TIMESTAMP}"

# Create deployment directory
mkdir -p $DEPLOY_DIR

# Copy all files
echo "📦 Copying files..."
cp -r assets $DEPLOY_DIR/
cp -r css $DEPLOY_DIR/
cp -r docs $DEPLOY_DIR/
cp -r index.html $DEPLOY_DIR/
cp -r js $DEPLOY_DIR/
cp -r manifest.json $DEPLOY_DIR/
cp -r sw.js $DEPLOY_DIR/
cp -r version.txt $DEPLOY_DIR/

# Create info file
echo "📝 Creating deployment info..."
cat > $DEPLOY_DIR/deploy_info.txt << EOF
AllO_U Deployment
Version: $VERSION
Date: $(date)
Features:
EOF

# Create zip archive
echo "🗜️ Creating archive..."
zip -r "${DEPLOY_DIR}.zip" $DEPLOY_DIR

echo "✅ Deployment package ready: ${DEPLOY_DIR}.zip"
echo "📊 Total size: $(du -sh $DEPLOY_DIR | cut -f1)"

# Optional: Upload to server
# scp "${DEPLOY_DIR}.zip" user@server:/path/to/deployment/


echo -e "${BLUE}🚀 Деплой AllO_U Research на GitHub Pages...${NC}"

# Проверка соединения с GitHub
echo -e "${YELLOW}🔍 Проверка соединения с GitHub...${NC}"
if ping -c 1 github.com &> /dev/null; then
    echo -e "${GREEN}   ✅ GitHub доступен${NC}"
else
    echo -e "${RED}   ❌ GitHub недоступен!${NC}"
    echo -e "${YELLOW}   Проверьте интернет-соединение${NC}"
    exit 1
fi

# Проверка git статуса
echo -e "${YELLOW}📊 Проверка статуса репозитория...${NC}"
git status --short

# Запрос сообщения коммита
echo ""
echo -e "${YELLOW}💬 Введите сообщение коммита:${NC}"
read -r commit_message

# Если сообщение пустое, используем дефолтное
if [ -z "$commit_message" ]; then
    commit_message="Update $(date +'%Y-%m-%d %H:%M')"
    echo -e "${YELLOW}   Используется: $commit_message${NC}"
fi

# Увеличение версии в файлах для обхода кеша
echo ""
echo -e "${GREEN}🔄 Обновление версий для очистки кеша...${NC}"

# Генерируем timestamp для версии
VERSION=$(date +%s)

# Обновляем версии в index.html
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/style\.css?v=[0-9]*/style.css?v=$VERSION/g" index.html
    sed -i '' "s/app\.js?v=[0-9]*/app.js?v=$VERSION/g" index.html
else
    # Linux
    sed -i "s/style\.css?v=[0-9]*/style.css?v=$VERSION/g" index.html
    sed -i "s/app\.js?v=[0-9]*/app.js?v=$VERSION/g" index.html
fi

# Если версии еще не добавлены, добавляем их
if ! grep -q "style.css?v=" index.html; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/style\.css/style.css?v=$VERSION/g" index.html
        sed -i '' "s/app\.js/app.js?v=$VERSION/g" index.html
    else
        sed -i "s/style\.css/style.css?v=$VERSION/g" index.html
        sed -i "s/app\.js/app.js?v=$VERSION/g" index.html
    fi
fi

echo -e "${GREEN}   ✅ Версия обновлена: $VERSION${NC}"

# Git операции
echo ""
echo -e "${BLUE}🚀 Начинаем деплой...${NC}"

# Добавление файлов
echo -e "${YELLOW}📁 Добавление файлов...${NC}"
git add .

# Коммит
echo -e "${YELLOW}📝 Создание коммита...${NC}"
git commit -m "$commit_message"

# Push
echo -e "${YELLOW}📤 Отправка на GitHub...${NC}"
git push origin main

# Проверка успешности
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         ✅ ДЕПЛОЙ УСПЕШЕН!            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}🔗 Сайт обновится через 2-5 минут:${NC}"
    echo -e "${BLUE}   https://zoland.github.io/AllO_U/${NC}"
    echo ""
    echo -e "${YELLOW}💡 Совет: Откройте в режиме инкогнито или${NC}"
    echo -e "${YELLOW}   очистите кеш (Cmd+Shift+R)${NC}"
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════╗${NC}"
    echo -e "${RED}║         ❌ ОШИБКА ДЕПЛОЯ!             ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Проверьте ошибки выше и попробуйте снова${NC}"
    exit 1
fi

# Опционально: открыть сайт
echo ""
echo -e "${YELLOW}🌐 Открыть сайт сейчас? (y/n):${NC}"
read -r open_site

echo "📱 Откройте на телефоне: https://zoland.github.io/AllO_U/?v=$VERSION"

if [[ "$open_site" == "y" || "$open_site" == "Y" ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://zoland.github.io/AllO_U/?v=$VERSION"
    else
        xdg-open "https://zoland.github.io/AllO_U/?v=$VERSION"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"


# echo "�� AllO_U v1.2.0 запуск..."
# echo "🌐 Открываем http://localhost:8000"

# Автоматически открываем браузер (macOS)
# sleep 1 && open http://localhost:8000/HTML/ &

# Запускаем сервер из корня AllO_U
# python3 -m http.server 8000
