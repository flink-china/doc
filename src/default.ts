import './styles';
import { initDocSearch } from './scripts/doc-search';
import { selectedNav } from './scripts/nav';

async function bootstrap() {
  initDocSearch();
  selectedNav();
}

document.addEventListener('DOMContentLoaded', async () => {
  await bootstrap();
});