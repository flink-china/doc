import './styles';
import { initDocSearch } from './scripts/doc-search';
import { selectedNav } from './scripts/nav';
import Siema from 'siema';

async function bootstrap() {
  initDocSearch();
  selectedNav();
  let perPage = 3;
  if (window.innerWidth < 1200 && window.innerWidth > 800) {
    perPage = 2;
  } else if (window.innerWidth < 800) {
    perPage = 1;
  }
  const siema = new Siema({
    selector    : '.community-list',
    duration    : 200,
    easing      : 'ease-out',
    perPage     : perPage,
    startIndex  : 0,
    draggable   : true,
    multipleDrag: true,
    threshold   : 20,
    loop        : true
  });
  let interval = setInterval(() => siema.next(), 15000);
  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(() => siema.next(), 15000);
  };
  document.querySelector('.prev').addEventListener('click', () => {
    siema.prev();
    resetInterval();
  });
  document.querySelector('.next').addEventListener('click', () => {
    siema.next();
    resetInterval();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await bootstrap();
});