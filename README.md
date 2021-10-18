# もくスケ

**エンジニアが安心して「もくもく会を開催・参加できる」ためのスケジュールアプリです。**

ユーザはもくもく会の予定を追加することができ、カード形式とカレンダー形式で確認できる仕様です。

(まだレスポンシブは未対応です)

DemoURL：https://staging-mekumoku.netlify.app/

## きっかけ

インターン先で使われている技術の知識をさらに深く身につけたいと思い個人開発をしようと考えました。

その題材で誰かの課題を解決したいと思い色んな人にヒアリングをしました。その中で CTO と話した際に出てきた
**「もくもく会を開いた時って誰来てくれるか不安だよね」**
という課題を解決したいと作成しようと決めました。

## 現状できること

- サインアップ・ログイン・ログアウト
- もくもく会のスケジュール追加/削除
- もくもく会に参加表明機能 (カードの+ボタンで)
- もくもく会の情報を編集
- ユーザ情報の変更

## 使い方

### トップページ (カード表示)

<img width="1431" alt="top" src="https://user-images.githubusercontent.com/56116874/130394777-18228d94-9b29-4518-98e2-68d32f07e17a.png">

右側の欄から会のスケジュールを追加することができます。

左側の ⚙ でスケジュールの変更ができます(開催者のみ)

➕ で参加表明、➖ で参加取り消しすることができます。

### カレンダー表示

<img width="1440" alt="スクリーンショット 2021-08-24 7 34 16" src="https://user-images.githubusercontent.com/56116874/130528276-254cd662-e99d-4fec-a7fe-7ff0c7672954.png">

カレンダー内の文字をクリックすると、会の編集もしくは参加表明、参加取り消しができます。

![2](https://user-images.githubusercontent.com/56116874/130528281-3a707121-f9e2-4692-9810-ac348e0a36c3.png)

左が参加表明済みの人の表示、右が開催者の人の表示です。

## 使用技術

- React
- TypeScript
- React-router-dom
- AntDesign
- Firebase

## 感想

> はじめてのアプトプット側に立ったニーズを掴んでいて良かった。他の言語への挑戦の壁を壊してくれそう。
> もくもく会をしたことがないのですが、これがあればハードルが下がりそう。
> もくもく会に参加するのが怖かったのですが、このアプリがあれば参加してみたいなと思えるようになりました。
> もくもく会の時に利用したいと思います！
