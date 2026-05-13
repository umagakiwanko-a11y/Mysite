const demoButton = document.querySelector('.submit-demo');

if (demoButton) {
  demoButton.addEventListener('click', () => {
    demoButton.textContent = '送信デモ完了';
    window.setTimeout(() => {
      demoButton.textContent = '発注内容を送信';
    }, 1600);
  });
}
