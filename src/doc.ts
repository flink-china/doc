import './styles';
import { initDocSearch } from './scripts/doc-search';
import { registerMenu } from './scripts/menu';
import { selectedNav } from './scripts/nav';

async function bootstrap() {
  initDocSearch();
  registerMenu();
  selectedNav();
}

document.addEventListener('DOMContentLoaded', async () => {
  await bootstrap();
});
