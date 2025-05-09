#!/bin/bash

echo "🔍 .gitignore에 포함된 항목 중 Git에 추적되고 있는 파일 검사 중..."

# .gitignore에서 주석(#)과 빈 줄을 제거하고 유효한 패턴만 가져옴
grep -v '^#' .gitignore | grep -v '^$' | while read pattern; do
  # Git에서 추적 중인 파일/폴더 중, 이 패턴과 일치하는 항목 찾기
  tracked=$(git ls-files "$pattern" 2>/dev/null)

  if [ -n "$tracked" ]; then
    echo "⚠️ 무시 대상인데 Git에 추적되고 있는 항목 발견:"
    echo "$tracked"
  fi
done

echo "✅ 검사 완료"
