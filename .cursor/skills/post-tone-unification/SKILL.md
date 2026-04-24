---
name: post-tone-unification
description: Rewrite blog posts to remove AI-sounding phrasing, standardize title/subtitle/section-heading voice, and preserve facts. Use when the user says writing feels AI, asks to polish style across posts, or requests title-system consistency and link checks.
---

# Post Tone Unification

## Goal

在不改变事实、数据、结论的前提下，把文章改成务实、理性、克制的写法。重点处理 AI 腔模板句、标题系统不一致、以及由改名引发的展示与链接不一致。

## Non-Negotiables

1. 不改事实，不改数据，不改结论，不新增未经验证信息。
2. 先定位问题再改写，不盲改整篇。
3. 改因不改果：优先改句式机制，而不是只删一个词。
4. 每轮改完必须回归检查链接与展示一致性。

## Trigger Signals

当用户出现以下表达时启用本 skill：

- 这段很 AI / 这句话像机器人写的
- 全篇再精修一遍
- 统一声线 / 统一标题体系
- changed/shaped everything 这种说法很怪
- 检查改标题后链接有没有问题

## Workflow

### 1) Define scope and hypothesis first

先给出可验证假设，再动手：

- 假设 A：问题来自抽象结论句（例如 changed everything）
- 假设 B：问题来自模板化开头（This X..., The decision that...）
- 假设 C：问题来自标题层命名不一致（冒号、连字符、Versus）

### 2) Detect before rewrite

先扫描命中点，再做定点改写。优先扫描：

- `changed/shaped ... everything`
- `This ...` 段首高频句
- `not ... but ...` 机械对比句
- 标题层 `Versus`、连字符、冒号使用不一致

### 3) Rewrite by mechanism, not by adjective

把抽象判断改成可验证机制：

- changed everything -> 明确哪一项指标变化、为什么变化
- shaped everything -> 明确核心约束是什么，影响了哪些决策
- everything works -> 说明 demo 过滤了哪些失败样本

### 4) Unify title layer

统一 `title`、`subtitle`、`Design Decision` 风格：

- 避免口号式句子
- 使用信息密度更高的名词短语或动作短语
- 对比词统一（例如统一为 `vs.`）
- 连字符只保留必要技术术语

### 5) Check cross-page consistency

改标题后检查三类一致性：

1. `about.md`、`index.html`、`projects.md` 的展示标题是否仍是旧文案
2. 内部链接是否仍可达（特别是草稿链接）
3. README 或说明文档里的示例链接是否失效

### 6) Validate

完成后必须执行：

- 再扫一遍目标触发词，确认清零或降到可接受范围
- 检查 recently edited files 的 lints
- 说明哪些改动是风格层，哪些是链接层

## Rewrite Rules (Applied)

1. 开头直接给判断或事实，不写前言句。
2. 用动作、因果、取舍替代抽象评价。
3. 少用引号；引用只在必要处保留。
4. 少用否定句，优先正向定义。
5. 避免机械连接词和模板句。
6. 段落节奏采用短句 + 中句组合，避免整段同节奏。

## Quick Replacement Patterns

- The Constraint That Shaped Everything -> The Core Operating Constraint
- Lowering the friction changed everything -> Lower input friction increased documentation volume and consistency
- This changed everything -> This changed routing logic, cost profile, and failure rate
- everything in one conversation -> strategy and execution in one conversation

## Output Contract

向用户汇报时包含：

1. 改了哪些文件
2. 这轮改动是风格层还是事实层（默认风格层）
3. 触发词清理结果
4. 链接/展示一致性检查结果
