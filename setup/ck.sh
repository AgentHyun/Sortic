#!/bin/bash

# ck.sh (최신 정밀 버전)
# Git에 추적되고 있지만 .gitignore에 의해 무시되어야 하는 파일/디렉토리 감지

echo "\n⚡ .gitignore 무시 대상인데 Git에 추적되고 있는 항목 탐지 중...\n"

found=false

# Git 추적 중인 모든 파일 기준으로 확인
git ls-files | while read file; do
  # .gitignore에 의해 무시되는지 확인
  if echo "$file" | git check-ignore --stdin --quiet; then
    if [ "$found" = false ]; then
      echo "⚠️ 무시 대상인데 Git에 추적되고 있는 항목 발견:"
      found=true
    fi
    echo "$file"
  fi

  # note: check-ignore는 무시 대상이 아니면 아무 것도 출력하지 않음

done

if [ "$found" = false ]; then
  echo "✅ 검사 완료: Git에 추적 중인 무시 대상 항목 없음"
else
  echo "\n❗ 위 항목들은 .gitignore에 의해 무시되어야 하지만 Git에 추적되고 있습니다."
  echo "👉 다음 명령어로 Git 추적에서 제거하세요:"
  echo "   git rm --cached [파일명]"
fi
