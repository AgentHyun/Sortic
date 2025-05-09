#!/bin/bash

echo "📦 ck.sh를 전역 명령어로 등록합니다..."

# 1. ~/bin 폴더가 없으면 생성
mkdir -p "$HOME/bin"

# 2. 현재 setup.sh가 있는 폴더 찾기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CK_SOURCE="$SCRIPT_DIR/ck.sh"

# 3. ck.sh 파일 존재 확인
if [ ! -f "$CK_SOURCE" ]; then
  echo "❗ setup/ 폴더 안에 ck.sh 파일이 없습니다."
  exit 1
fi

# 4. ~/bin/ck로 복사 (원본은 유지됨)
cp "$CK_SOURCE" "$HOME/bin/ck"
chmod +x "$HOME/bin/ck"
echo "✅ ~/bin/ck 으로 등록 완료됨"

# 5. PATH에 ~/bin이 없으면 추가
if ! grep -q 'export PATH="$HOME/bin:$PATH"' "$HOME/.bashrc"; then
  echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
  echo "📌 PATH 설정을 .bashrc에 추가했습니다."
fi

# 6. PATH 즉시 반영
source ~/.bashrc

# 7. 완료 안내
echo "🎉 이제 터미널에서 'ck' 명령어로 .gitignore 추적 검사 가능!"
echo "🗂 원본 ck.sh는 setup/ 폴더에 그대로 보존됩니다."
