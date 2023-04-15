# 窩潮募資平台 - 後台管理系統

## 環境

pnpm 8 <br>
node 16

## 開發原則

- 變數使用小駝峰
- 變數命名與 DB 相同

### Branch

1. 主分支命名 **`master`**。
2. 開發分支基於主分支，命名是 **`dev`**。
3. 功能分支基於開發分支，命名依照功能，eg.**`feature/xxx`** 或者 **`feat/xxx`**，其中xxx是功能的描述，細節參考 commit 規範。
4. 修復錯誤的分支使用 **`bugfix/xxx`** 或 **`fix/xxx`**，其中xxx是錯誤的描述。
5. 測試分之使用 **`test/xxx`**，其中xxx是功能的描述。

### Commit

1. 新增功能：**`feat: add xxx feature`**
2. 修復錯誤：**`fix: fix xxx issue`**
3. 重構代碼：**`refactor: refactor xxx code`**
4. 優化代碼：**`optimize: optimize xxx code`**
5. 更新文檔：**`docs: update xxx doc`**
6. 增加測試：**`test: add xxx test`**
7. 增加依賴庫：**`deps: add xxx dependency`**
8. 格式化代碼：**`style: format xxx code`**
9. 提交注釋：**`chore: add xxx comment`**
10. 回滾代碼：**`revert: revert xxx commit`**

## 開發流程

- 分支開發
- 測試
- 發 PR
- 固定時間 release

### 開發（API 撰寫）

1. 在 **`/controllers` `models` `routes`** 檔案夾新增對應功能
2. branch 命名方式 **`feature/xxxxx`**，xxxxx 為功能敘述，請記得用英文
3. commit 訊息為 **`feat: #number xxxxx`**，number 填 issue 號碼會自動 link 到單上，xxxxx 為補充資訊
4. 進入測試，有問題測試人員會開 bug ticket
5. 發 Pull Request

### 測試

1. 進入 **`/tests`** 資料夾新增對應測試
2. branch 命名方式 **`testcase/xxxxx`**，xxxxx 為功能敘述，請記得用英文
3. commit 訊息為 **`test: #number xxxxx`**，number 填 issue 號碼會自動 link 到單上，xxxxx 為補充資訊
4. 發 Pull Request
5. 進行測試，回報 bug ticket

## 套件使用

### dependencies

- bcryptjs
- cookie-parser
- cors
- dotenv
- express
- helmet
- jsonwebtoken
- mongoose
- validator

### devDependencies

- @types/bcrypt
- @types/cookie-parser
- @types/express
- @types/jest
- @types/node
- @types/supertest
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint
- jest
- nodemon
- supertest
- ts-node
- typescript

## Setup

```
pnpm i
pnpm run start
```