# 원티드 프리온보딩 12th 2팀 3주차 과제 개인안

※ 본 과제는 [원티드 프리온보딩 인턴십 8월](https://www.wanted.co.kr/events/pre_ob_fe_12)를 바탕으로 진행되었습니다.

## 🤝 프로그램 진행과정 및 목적

### ❓ 진행과정

    ✅ 1. 매 주 멘토님 또는 참여 기업으로부터 과제를 부여받습니다.

    ✅ 2. 모든 팀원은 각자 자신의 스타일로 코드를 작성합니다.

    ✅ 3. 서로의 코드를 리뷰하는 과정을 거치며, 본인의 코드를 동료에게 이해하기 쉽게 설명하고, 타인의 코드를 이해하는 과정을 경험합니다.

    ✅ 4. 기능별로 가장 효율적이라고 판단되는 코드를 Best Practice로 선정하여 최종 결과물에 반영합니다.

### 💡 목적

좋은 코드를 만들 위해 고민하고, 그 과정에서 팀으로 일하는 법에 익숙해집니다.

## 🧑🏻‍💻 프로젝트 정보

### 📌 프로젝트 주제

- 특정 사이트(https://clinicaltrialskorea.com)의 검색창 섹션을 클론하고, 더 나아가 키보드를 통한 추천검색어 이동 기능, 로컬 캐싱을 구현합니다.

- 핵심 기능 : `로컬 캐싱`, `API요청 횟수 최적화`, `추천 검색어`, `추천 검색어 마우스로 조작 기능`, `사용자 경험 향상` 등

<br/>


### 🗓️ 진행 기간

23년 9월 5일 ~ 23년 9월 8일

<br/>


### 👀 미리보기 
![Alt text](image.png)

### ▶️ 실행 방법

- 배포 링크: [https://pre-onboarding-12th-3-1w4xs9yjv-pre-onboarding-12th-1team.vercel.app](https://pre-onboarding-12th-3-1w4xs9yjv-pre-onboarding-12th-1team.vercel.app)
- 링크가 실행되지 않는 경우 아래 명령어를 차례대로 입력하여 실행해주세요.
- 서버와 클라이언트 두 가지 앱을 모두 실행해야 정상 작동 됩니다.

```jsx
// 로컬 서버 실행 방법

git clone https://github.com/walking-sunset/assignment-api.git
npm install
npm start
```

```jsx
// 로컬 클라이언트 실행 방법

git clone https://github.com/HWAHAEBANG/pre-onboarding-12th-3.git
npm install
npm start
```

<br/>

## 💭 주요 기능 구현 과정에서의 고민 과정
### 📌 API 요청 최소화

추천 검색어 API의 요청을 최소화하기 위해서는 `불필요한 요청이 발생할 수 있는 경우의 수`를 파악하는 것이 우선이라 판단했습니다.

파악한 경우의 수는 다음과 같습니다.

#### ✅ 경우 1. 입력된 문자 중 마지막 문자가 완성형 글자가 아닌 경우. ex) `'담ㄷ'`

- 구글과 같은 검색엔진의 경우 초성만 입력하여도 추천 검색어를 제공하지만, 과제에서 주어진 API의 경우에는 **완전한 글자에만 추천 검색어를 제공**하고 있습니다. 
- 이러한 API의 특성을 고려하였을 때, `담ㄷ` 와 같이 마지막 글자가 `단모음·단자음`으로 끝나는 경우 API요청 보내지 않는 방법이 글자 수 만큼의 API요청 횟수를 줄여 줄 수 있을 것이라 판단했습니다.
- 또한 입력 도중에 `검색어 없음` 이 뜨는 것을 방지하게 되어 조금 더 우수한 사용자 경험을 제공할 수 있을 것이라 생각했습니다.
- 이를 구현하기 위해 정규식을 사용하여, 문자열의 마지막이 `단모음·단자음`일 때를 구분해주는 `Validator`를 사용하는 방안을 고안했습니다.
```typescript
// utils > validator.ts

const isolatedKoreanCharacterRegex = /[ㄱ-ㅎㅏ-ㅣ]$/;

export const isolatedKoreanCharacterValidator = (searchKeyword: string) => {
  return isolatedKoreanCharacterRegex.test(searchKeyword);
};
```
![Alt text](image-2.png)

#### ✅ 경우 2. 입력된 문자가 없는 경우 (모두 지웠을 경우)
- 모든 입력이 지워진 상태에서도 API요청이 발생합니다. 이 부분을 예외처리 하면 불필요한 요청을 줄이는 효과와 더불어, 빈 문자열을 파라미터로 전송 시 모든 데이터들을 반환해 주는 문제를 보완해 줄 수 있습니다.

#### ✅ 경우 3. 더 입력을 진행해도 더이상 추천할 목록이 없을 것으로 판단되는 경우.
- 이 경우를 예외처리 할 경우 굉장히 많은 API요청을 줄여줄 것이라 판단했습니다. 하지만 한글의 입력방식의 특수성으로 인해 구현하는데에 많은 제한사항이 있었습니다.
<br/><br/>
- 🧪 `시도한 방법 1` :  입력을 하다가 API의 결과가 없어지면, 이후 요청을 하지 않기.
   - 실패 이유
      - 한글의 특성상 받침의 유무에 따라 예상할 수 있는 단어가 달라집니다.
      - 예를들어 `갑상선`을 입력하는 과정에 `갑사` 에서는 추천 검색어가 없다가. `갑상` 에서 다시 생기므로 이 방법 부적합하다고 판단하였습니다.
      <br/>
      <br/>
- 🧪 `시도한 방법 2` :  키보드가 `5번` 눌렸음에도 계속 결과가 없다면, 이후로는 더이상 추천 검색어는 없을 것으로 판단하고 이후 요청을 하지 않기.
   - 왜 하필 5번인 인가?
      - 한글로 만들어낼 수 있는 문자 중 가장 많은 키보드 입력을 요하는 경우는 `괅` 같은 형태이고 5번의 키입력을 요구하기 때문입니다.
   - 구체적인 방안 
      - useRef 훅을 사용하여, 결과가 없을 때마다 Ref값을 1씩 증가 시킵니다.
      - 입력 도중 결과가 나오면 0으로 초기화합니다.
      - Ref가 5 보다 커지면 이후 API요청은 진행하지 않습니다.
      - 다시 삭제하는 경우 재요청이 가능하도록 Backspace를 누르면 다시 1씩 감소시킵니다.
   - 실패 이유
      - 한글의 특성상 키보드 눌리는 횟수가 `입력 시`와 `지울 시` 가 다르기 때문에 ref를 다시 1씩 감소 시킬 시 버그가 발생합니다.
      - 예를 들어, `강남` 을 입력한다고 가정하면 입력 시에는 `ㄱ` → `가` →`강` →`강ㄴ` →`강나` →`강남` 순으로 6회에 걸쳐 생성되는 반면, 삭제 시에는 `강나` →`강ㄴ` →`강` →`‘’` 순을 4회에 걸쳐 삭제되기 때문에, 일관성 있는 Count값을 유지할 수 없습니다.
      <br/><br/>

- 결론 : 결과값이 없을 경우를 미리 판단하는 것에는 한글의 경우 제약이 있으므로, 다른 방향으로의 방법을 모색하는 것이 좋겠다 판단하였습니다.

#### ✅ 경우 4. 값이 계속 입력되는 경우 `ex)'ㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱ...'`
- 사용자가 검색창을 이용하다 의도치 않게 키보드가 눌려 값이 계속 입력되는 경우가 발생할 수 있습니다.
- 이로 인해 API요청이 계속해서 발생할 경우 프로그램의 성능에 큰 무리를 불러올 수 있습니다.

### 📌 키보드로 조작 기능 지원
- 명시된 과제에는 `키보드로 최근 검색어로 이동이 가능하게 하라`라고만 나와있습니다. 하지만 `키보드로 이동이 가능하다` = `키보드로 검색까지도 가능 해야한다` 라고 판단하고 다양한 기능을 재량껏 추가했습니다.
- 클론 대상인 사이트는 키보드 이벤트를 사용하지 않았므로, 이 기능은 검색엔진이 가장 완성도 높은 것으로 유명한 `Google 검색창`의 키보드 이벤트를 분석해 차용하기로 하였습니다.
- 차용하여 구현한 디테일한 기능들은 다음과 같습니다.

    - 키보드로 추천 검색어 이동 가능. 이동시 포커스 생성
    - 맨 위에서 `↑버튼` 누르면 맨 아래로 이동
    - 맨 아래에서 `↓버튼` 누르면 맨 위로 이동
    - 키보드 이동 전에는 포커스 된 항목이 없어야함
    - 포커스 된 내용 `Input 태그` `value`에 즉시 반영 (Enter키 누르면 바로 검색 가능)
    - 빈 문자열이 입력되면 ‘검색어 없음’ 표출
    - 마우스로 추천 검색어 각 요소 클릭하면 바로 검색됨
    - 결과 값 일정 길이 초과시 `스크롤바` 생성
    - 포커스 이동시 스크롤도 따라오도록 구현
    - `X` 아이콘 클릭시 모든 내용 초기화 및 추천 검색어 모달 닫힘
    - `esc버튼` 누를 시 가장 최근에 Focus된 결과 남기고 추천 검색어 모달만 닫힘

### 📌 로컬 캐싱
- 로컬 캐싱은 context API를 통해서 구현했습니다.
- `get`과 `set` 함수를 만들어 API를 요청하기 전에 cache상태에서 키를 조회한 뒤 없거나 TTL이 만료된 경우 새 API요청을 진행하며, 새로 받아온 반환 값은 set함수를 통해 캐시스토리지에 추가되어 다음 요청시 재활용할 수 있도록 구현하였습니다.

```ts
// components > Serchbar.tsx
    const cachedData = cacheContextValue?.get(inputValue);
    if (cachedData) {
      console.info("Data found in cache");
      setSuggestions(cachedData);
    } else {
      const response = await getSuggestionApi(inputValue);
      const data = response.data;
      cacheContextValue?.set(inputValue, data);
      setSuggestions(data);
    }
```

```ts
// App.tsx
function App() {
  const [cache, setCache] = useState<Cache>({});
  const defaultTTL = 3600;

  const set = (key: string, value: Suggestions, ttl = defaultTTL) => {
    const expireTime = Date.now() + ttl * 1000;
    setCache({
      ...cache,
      [key]: {
        value,
        expireTime,
      },
    });
  };

  const get = (key: string) => {
    const cachedItem = cache[key];
    if (cachedItem && Date.now() < cachedItem.expireTime) {
      return cachedItem.value;
    }
    remove(key);
    return null;
  };

    const remove = (key: string) => {
    const updatedCache = { ...cache };
    delete updatedCache[key];
    setCache(updatedCache);
  };

  const cacheContextValue = {
    set,
    get,
  };

  return (
    <CustomCacheContext.Provider value={cacheContextValue}>
      <SearchBar />
    </CustomCacheContext.Provider>
  );
}
```

```ts
// components > SerchBar. ts
    const cachedData = cacheContextValue?.get(inputValue);
    if (cachedData) {
      console.info("Data found in cache");
      setSuggestions(cachedData);
    } else {
      const response = await getSuggestionApi(inputValue);
      const data = response.data;
      cacheContextValue?.set(inputValue, data);
      setSuggestions(data);
    }
```
- 동료학습 과정에서 상의를 해본 결과, context로 구현한 캐싱 기능은 결국에는 상태이므로 새로고침 시 휘발되게 됩니다.
- 이러한 경우 캐시가 짧은 기간만 필요한 경우에는 유효할 수 있지만 검색창의 경우에는 보통 한번의 검색으로 바로 화면 이동을 한다는 사용자의 행동 특성을 고려했을때, 크게 유효하지 않다는 결론을 얻었습니다.
- 따라서 브라우저의 캐시 스토리지를 활용하는 방법을 채택한 조원의 방식이 더 적합하다고 판단하여 해당 방식으로 팀안을 작성하기로 결정하였습니다.


### 📂 프로젝트 구조
```markdown
📦 src
│  App.tsx
│  index.css
│  index.tsx
│  react-app-env.d.ts
├─📂 apis
│      suggestion.ts
├─📂 assets
│      index.ts
│      readingGlasses.svg
├─📂 components
│      SearchBar.tsx
│      SuggestionBox.tsx
├─📂 configs
│      axios.ts
├─📂 contexts
│      customCacheContext.ts
├─📂 types
│      customCacheType.ts
│      searchType.ts
└📂utils
        validator.ts
```
<br/>

### 🖇️ 사용 라이브러리 및 기술

- JavaScript / TypeScript / React
- 라우팅: react-router-dom
- 스타일: styled-components, react-markdown, remark-gfm

```jsx
 "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.48",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "axios": "^1.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "styled-components": "^6.0.7",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "prettier": "^3.0.3"
  }
```

## 🫱🏻‍🫲🏿 Commit zjs & Branch Strategy

### Commit Convention

e.g. FEAT: 로그인 유효성 검증 기능 구현

| 태그      | 설명 (한국어로만 작성하기)                                     |
| --------- | -------------------------------------------------------------- |
| FEAT:     | 새로운 기능 추가 (변수명 변경 포함)                            |
| FIX:      | 버그 해결                                                      |
| DESIGN:   | CSS 등 사용자 UI 디자인 변경                                   |
| STYLE:    | 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우          |
| REFACTOR: | 프로덕션 코드 리팩토링                                         |
| COMMENT:  | 필요한 주석 추가 및 변경                                       |
| DOCS:     | 문서를 수정한 경우                                             |
| CHORE:    | 빌드 테스크 업데이트, 패키지 매니저 설정(프로덕션 코드 변경 X) |
| RENAME:   | 파일 혹은 폴더명을 수정하거나 옮기는 작업                      |
| REMOVE:   | 파일을 삭제하는 작업만 수행한 경우                             |
| INIT:     | 초기 커밋을 진행한 경우                                        |

### Branch Strategy

| 브랜치    | 설명                               |
| --------- | ---------------------------------- |
| main      | 배포 및 최종본, 출시 버전의 브랜치 |
| develop   | 개발용 버전의 기준이 되는 브랜치   |
| feature/~ | 세부 기능 개발을 위한 브랜치       |
| refactor  | 리팩토링을 위한 브랜치             |
