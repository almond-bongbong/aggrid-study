# AG Grid Best practice

해당 저장소는 실전에서 AG Grid 사용시 발생하는 상황들에 대한 모범 사례와 패턴을 정리한 저장소이다.

## 목적

- AG Grid에 익숙하지 않은 개발자라도 실무에서 접하는 케이스에 대해 모범사례를 확인하고 각 prop이 무엇을 의미하는지 한눈에 확인한다.

## Tech Stack

- Next.js (App router)
- MSW (API mocking)
- react-query (Remote state management)
- AG Grid

## 케이스

- 각 케이스별로 페이지를 분리하여 해당 케이스에 대한 데모와 코드를 확인 할 수 있다.
- 상태에 대한 값의 변화를 로그로 확인 할 수 있다. (mutable한 변경인지 immutable한 변경인지)

### cell edit (Basic)

cell을 edit하는 기본 사례

### cell edit (immutable)

cell을 edit할때 row data를 불변 값으로 다루는 사례

### cell edit + 커스텀 컴포넌트

cell을 edit할때 커스텀 edit 컴포넌트를 사용하여 처리한다.

### cell edit + post + refetch

cell edit이 완료되는 순간 post

### cell edit + post + refetch (optimistic update)

cell edit이 완료되는 순간 post 그리고 ui를 낙관적으로 update하여 사용자 ux를 극대화 한다.
에러케이스에 대한 fallback 처리도 되어야 한다.
