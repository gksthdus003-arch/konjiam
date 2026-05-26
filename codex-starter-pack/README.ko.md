# Codex 스타터팩 사용 가이드

이 폴더는 새 프로젝트에 바로 복사해서 쓸 수 있는 Codex CLI용 패키지입니다.

## 1. 먼저 무엇을 복사하나요?

새 프로젝트 루트에 아래 두 가지만 넣으면 됩니다.

- `AGENTS.md`
- `.Codex/` 폴더 전체

즉, 이 `codex-starter-pack` 폴더 안에서 실제로 새 프로젝트에 가져갈 것은 아래입니다.

- `codex-starter-pack/AGENTS.md`
- `codex-starter-pack/.Codex/`

## 2. 프로젝트에 넣은 다음 무엇을 하나요?

순서는 이렇게 하시면 됩니다.

1. 새 프로젝트 루트에 `AGENTS.md`와 `.Codex/`를 복사합니다.
2. 터미널을 엽니다.
3. `AGENTS.md`가 있는 그 프로젝트 루트로 이동합니다.
4. 그 위치에서 Codex CLI를 실행합니다.
5. 첫 요청으로 프로젝트 분석과 템플릿 현지화를 진행시킵니다.

## 3. 터미널에서 시작 순서

예시:

```powershell
cd D:\path\to\your-project
codex
```

중요한 점:
- 반드시 `AGENTS.md`가 있는 프로젝트 루트에서 시작하는 것이 좋습니다.
- 다른 폴더에서 Codex를 실행하면 이 지침을 제대로 참조하지 못할 수 있습니다.

## 4. Codex를 켠 뒤 첫 번째로 넣을 프롬프트

아래 문장을 첫 요청으로 넣는 것을 권장합니다.

```text
Inspect this repository and update .Codex/CODEX_INTEGRATION_GUIDE.md so it matches the real stack, folders, commands, and constraints. Keep AGENTS.md as the entry point.
```

원하시면 한국어로도 이렇게 시작하셔도 됩니다.

```text
이 저장소를 분석해서 .Codex/CODEX_INTEGRATION_GUIDE.md를 실제 기술 스택, 폴더 구조, 명령어, 제약사항에 맞게 업데이트해주세요. AGENTS.md는 진입점으로 유지해주세요.
```

## 5. 그 다음에 하면 좋은 요청

첫 분석이 끝난 뒤에는 아래 순서가 좋습니다.

1. `.Codex/CODEX_INTEGRATION_GUIDE.md`의 플레이스홀더를 실제 값으로 채우기
2. `.Codex/SUBAGENTS.md`를 프로젝트 구조에 맞게 구체화하기
3. 테스트, 린트, 빌드 명령을 문서에 반영하기
4. 필요하면 레거시 문서나 기존 팀 규칙을 참고 자료로 연결하기

추천 두 번째 프롬프트:

```text
Now update .Codex/SUBAGENTS.md so the delegation examples match this repository's actual modules, directories, and review hotspots.
```

## 6. 이 패키지가 해주는 일

이 스타터팩은 Codex가 다음 흐름으로 움직이도록 도와줍니다.

- 먼저 프로젝트 지침 읽기
- 실제 저장소 구조 확인하기
- 비사소한 작업에서는 멀티에이전트 방식 우선 고려하기
- Claude 전용 자동화가 있더라도 그대로 있다고 가정하지 않기
- 명시적인 체크리스트와 작업 흐름으로 대체하기

## 7. 멀티에이전트 스타일로 더 잘 쓰는 팁

큰 작업에서는 이렇게 요청하면 좋습니다.

```text
이 작업은 가능하면 멀티에이전트 방식으로 진행해주세요. 먼저 코드 구조를 조사할 서브에이전트와, 구현 또는 리뷰를 맡을 서브에이전트를 적절히 나눠서 진행해주세요.
```

혹은 더 짧게:

```text
Use a multi-agent approach for this task when it is beneficial.
```

## 8. 복사 후 꼭 확인할 것

- 새 프로젝트 루트에 `AGENTS.md`가 있는지
- `.Codex/` 폴더가 통째로 들어갔는지
- Codex CLI를 그 루트에서 실행했는지
- 첫 분석 프롬프트로 템플릿 현지화를 먼저 했는지

## 9. 포함 파일

- `AGENTS.md`: Codex가 가장 먼저 볼 진입점
- `.Codex/README.md`: 스타터팩 개요
- `.Codex/CODEX_INTEGRATION_GUIDE.md`: 프로젝트별 커스터마이징 템플릿
- `.Codex/SUBAGENTS.md`: 멀티에이전트 운영 템플릿
