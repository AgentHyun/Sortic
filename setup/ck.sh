#!/bin/bash

echo "🔍 .gitignore에 포함된 항목 중 Git에 추적되고 있는 파일 검사 중..."

# 1. 예외 파일 목록 추출 (줄 앞 ! 제거)
mapfile -t exceptions < <(grep '^!' .gitignore | sed 's/^!//')

# 2. 무시할 패턴만 필터링
grep -v '^#' .gitignore | grep -v '^$' | grep -v '^!' | while read pattern; do
  git ls-files "$pattern" 2>/dev/null | while read file; do
    skip=false
    for ex in "${exceptions[@]}"; do
      if [ "$file" = "$ex" ]; then
        skip=true
        break
      fi
    done
    if [ "$skip" = false ]; then
      echo "⚠️ 무시 대상인데 Git에 추적되고 있는 항목 발견:"
      echo "$file"
    fi
  done
done

echo "✅ 검사 완료"
