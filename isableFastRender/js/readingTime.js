function readingTime() {
  const article = document.querySelector("article");
  if (!article) return;
  
  const text = article.innerText;
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);

  const timeElement = document.querySelector("span#readingTime");
  if (timeElement) {
    timeElement.textContent = `${time} min read`;
  }
}
readingTime();
