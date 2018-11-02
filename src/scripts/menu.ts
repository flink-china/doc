function toggleClassName(element: HTMLElement, className: string) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

export function registerMenu() {
  const listOfTitle = document.querySelectorAll('.ant-menu-submenu-title');
  for (let l of listOfTitle as any) {
    l.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const ul = l.nextSibling;
      toggleClassName(ul, 'ant-menu-hidden');
      const li = l.parentElement;
      toggleClassName(li, 'ant-menu-submenu-open');
    });
  }
}