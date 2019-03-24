---
title: 使用 cronab 自動化命令行軟件的更新
category: Productivity
tag: [UNIX, crontab, Automation]
isPublished: false
---

**crontab** 是 UNIX 系統上週期性調度任務的任務調度器。其名字是 chronic table（週期性時間表）的縮寫。UNIX 系統上的每一個用戶都有其自己的 "crontab"。

## 編輯 crontab 文件。

通過執行 `crontab -e`，你可以打開你登入的用戶的 crontab。下面的插圖顯示了我的 crontab 的內容。

![crontab 的編輯器](crontab-e.png "crontab 的編輯器")

如你所見，我在用 crontab 來自動化 **home brew**, **npm** 和 **arcanist** 的更新（Arcanist 是代碼審查、項目計畫、代碼託管套件：Phabricator 的一個命令行代碼審查工具）。

左側的如 `0 0 * * *` 這樣的數字序列代表「每天 00:00 AM」。這些數字序列將設置右側命令的執行時間。你可以在 [crontab.guru](https://crontab.guru) 獲得一個用戶友好的介面來設置這串數字。

右側的命令僅支持少部分環境變量。你可以想象一個沒有任何 `*rc` 文件加載的 shell 環境，那就是 crontab 所擁有的。

因爲被 crontab 執行的命令所擁有的是這樣的 shell 環境，連 `PATH` 變量也沒有被設置，所以你必須寫下要執行命令的完全路徑。

被 crontab 執行的命令可以是一個 UNIX 系統隨行的命令行命令，也可以是你自己編寫的一段腳本。如果你要執行一個需要 root 權限的系統命令，那麼你需要保證你要執行的命令在 sudoers 文件裏面。如果你要在 crontab 中執行一個 shell 腳本，那麼你需要使用 `chmod +x 你腳本的名字` 來讓你的腳本有執行權限。

## 保存 crontab 文件

在不同的編輯器上，保存 crontab 文件的方法各不相同。在 VIM 中，你可以使用 `:w⏎` 來保存。如果你在使用 macOS，那麼當你保存完文件後將會遇到下面這個對話框，你需要點擊「OK」來讓你的系統接受你的修改。

![macOS Alert](macos-alert.png "macOS Alert")

## 通知郵件

每一次一個命令被 crontab 所執行，你都會得到一個郵件。你可以在命令行環境以 `mail` 命令查看這封郵件。

![crontab 郵件](crontab-mails.png "crontab 郵件")

然後每天你來到你的桌前，只需要打開你的命令行終端，然後輸入 `mail`，然後你就可以知道你哪些命令行軟件更新了。如你所見，今天我電腦上的 **npm** 更新了。

![crontab 郵件內容](crontab-mails-contents.png "crontab 郵件內容")

## 改變通知郵件目的地

默認下，每一個被 crontab 執行的命令都會發送一封郵件給設置這個命令的用戶。但是你可以通過在 crontab 文件的頂部加入如下一行來改變目的地的地址（輸入 `crontab -e` 打開 crontab 文件）。

```crontab
MAILTO=your@emailaddress.com
``` 

你也可以通過設置 `MAILTO` 爲 `""` 來關閉郵件通知。具體如下列代碼所示：

```crontab
MAILTO=""
``` 

## 閱讀 crontab 的手冊

通過執行 `man crontab`, 你可以查看 crontab 的細節使用方法.

![crontab 手冊](ctontab-man.png "crontab 手冊")

## 一些資源

我的 macOS 用 crontab 腳本： [WeZZard/com.wezzard.crontab.macos](https://github.com/WeZZard/com.wezzard.crontab.macos)

我的開發用 crontab 腳本： [WeZZard/com.wezzard.crontab.dev](https://github.com/WeZZard/com.wezzard.crontab.dev)
