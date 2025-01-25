const myApi = '';
const krw = document.getElementById("krw");

//input項目に入力があった場合にイベントリスナーが発動
krw.addEventListener("change", ()=> {
  //入力値を取得
  const amount = document.getElementById("krw").value;
  //画面表示領域を取得
  const resultDiv = document.getElementById("result");
  const rateDiv = document.getElementById("rate");
  const errorDiv = document.getElementById('error-msg');

  //画面上のエラーメッセージを削除
  errorDiv.innerHTML = ``;

  //バリデーションチェック
  const validationResult = validation(amount);
  if (validationResult.isValid)　{

    //apiの呼び出し
    getExchanges(amount)
      .then(data => {
        //APIデータを定数に格納、加工
        const {conversion_rate, conversion_result} = data;
        const processedResult = Number(conversion_result).toLocaleString();

        //画面に結果を表示
        resultDiv.innerHTML =`
                      ¥ ${processedResult}
                      `;

        rateDiv.innerHTML =`
                      * 換算レート：${conversion_rate}
                      `;

      })
      .catch(err => {
        errorDiv.innerHTML = `<p>エラー: ${err.message}</p>`
      });
  }else {
    errorDiv.innerHTML = `<p>${validationResult.message}</p>`;
  }
});

//api連携
async function getExchanges(amount) {
 const url = `https://v6.exchangerate-api.com/v6/${myApi}/pair/KRW/JPY/${amount}`;
 const response = await fetch(url);
 if (!response.ok) throw new Error('通貨情報が取得できませんでした');
    return await response.json();
}

//バリデーションチェック
function validation(amount) {
  if(isNaN(amount)) {
    return {isValid: false, message: '⚠️ 半角数字を入力してください。'};
  }
  else if(parseFloat(amount) <= 0) {
    return {isValid: false, message: '⚠️ 正の整数を入力してください。'};
  }
  else {
    return {isValid: true};
  }
}
