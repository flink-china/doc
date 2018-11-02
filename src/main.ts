import './styles';
import { initDocSearch } from './scripts/doc-search';
import { selectedNav } from './scripts/nav';
import { TextTick } from './scripts/text-tick';

async function bootstrap() {
  initDocSearch();
  selectedNav();
  const elements = document.getElementsByClassName('text-tick');
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[ i ].getAttribute('data-rotate');
    let period = +elements[ i ].getAttribute('data-period');
    if (toRotate) {
      new TextTick(elements[ i ], JSON.parse(toRotate), period);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await bootstrap();
});
