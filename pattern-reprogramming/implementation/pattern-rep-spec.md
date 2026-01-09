⸻


# Pattern Language Specification v0.1

Pattern は、チューリング完全性を目的としない、  
**プリミティブな図形描画に特化した短いプログラミング言語**である。

Web 上のテキストボックスにコードを入力すると、  
即座にグラフィック結果が表示されることを前提とする。

---

## 1. Canvas / Coordinate System

- **論理キャンバスサイズ**：1000 × 1000
- **表示**：ウィンドウサイズに応じてレスポンシブにスケール
- **座標系**
  - 原点 `(0,0)`：左上
  - +x：右方向
  - +y：下方向
- 内部描画は常に 1000×1000 上で行う

---

## 2. Execution Model

コードは **左から右へ逐次実行**される。

### State

インタプリタは以下の状態を持つ：

| State | Description | Initial Value |
|------|------------|---------------|
| `pos` | 現在位置 `(x, y)` | `(500, 500)` |
| `θ` | 向き（角度・度） | `0°`（右向き） |
| `s` | スケール | `1.0` |
| `h` | Hue（0.0–1.0） | `0.0` |

定数：
- `step`：移動量基準（例：24px）

---

## 3. Allowed Characters

### Drawing

o x + | -

### Translate

^ v > <

### Scale

! i

### Rotation

?

### Color

	•	

### Loop

( ) . ,

上記以外の文字（空白・改行含む）は **すべて無視**される。

---

## 4. Translate (Movement)

移動は **現在の向き θ とスケール s を考慮**する。

### Direction Vectors

- Forward  

F = (cosθ, sinθ)

- Right  

R = (cos(θ + 90°), sin(θ + 90°))

移動量：

Δ = step × s

### Commands

| Command | Effect |
|-------|--------|
| `^` | `pos += F × Δ` |
| `v` | `pos -= F × Δ` |
| `>` | `pos += R × Δ` |
| `<` | `pos -= R × Δ` |

---

## 5. Scale / Rotation / Color

### Scale

| Command | Effect |
|-------|--------|
| `!` | `s *= 2` |
| `i` | `s /= 2` |

- `s` は `[1/64, 64]` に clamp

---

### Rotation

| Command | Effect |
|-------|--------|
| `?` | `θ += 15°` |

- `θ` は 0–360° で wrap

---

### Color

| Command | Effect |
|-------|--------|
| `*` | `h = (h + 0.10) mod 1.0` |

---

## 6. Drawing Primitives

共通仕様：

- 描画中心：`pos`
- 回転：`θ`
- サイズ：スケール `s` に追従
- 線幅：**スケール追従（A方式）**
- Fill：なし
- Stroke：

hsla(h*360, 80%, 60%, 0.7)

### Base Parameters

| Parameter | Value |
|---------|-------|
| `R0` | 18 |
| `L0` | 28 |
| `W0` | 2 |

R = R0 × s
L = L0 × s
strokeWidth = max(1, W0 × s)

### Shapes

| Command | Shape |
|-------|------|
| `o` | 円（半径 R） |
| `x` | 斜線2本（×） |
| `+` | 縦横2本 |
| `|` | 縦線1本 |
| `-` | 横線1本 |

---

## 7. Loop Syntax

### Block

( sequence )

### Repeat Markers（ブロック直後のみ有効）

- `.`：1回
- `,`：5回

繰り返し回数：

d = count(’.’)
c = count(’,’)
n = (d > 0 ? d : 1) × 5^c

### Examples

(o)…
→ ooo



((o<+)..-v)…
→ o<+o<+-vo<+o<+-vo<+o<+-v

### Rules

- `.` `,` は **ブロック直後限定**
- ネスト可能
- 展開は **内側から外側へ**

---

## 8. Instruction Limit

- **最大命令数：10,000**
- 展開後の実行命令数でカウント

命令として数えるもの：
- 描画コマンド
- 移動
- `! i ? *`

超過時：
- 実行停止
- エラー表示
- 描画結果はクリア

---

## 9. Error Handling

エラーになるケース：

- 対応しない括弧
  - `(` に対応する `)` がない
  - 開き括弧なしの `)`
- 命令数上限超過

エラー時：
- 描画は行わない
- 明示的なエラーメッセージを表示

---

## 10. Design Philosophy

- 難解言語風の表層
- 実装は単純・決定的
- 状態は最小限
- 「打つ → すぐ見る」体験を最優先
- 表現力は **組み合わせ**から生まれる

---

## 11. Non-goals

- チューリング完全性
- 条件分岐
- 乱数・時間・外部入力
- 状態スタック・変数

---

End of Specification


⸻
