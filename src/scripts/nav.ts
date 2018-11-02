export function selectedNav() {
  try {
    const listOfNav = document.getElementById('nav').querySelectorAll('li');
    for (let l of listOfNav as any) {
      const regex = new RegExp(l.dataset.match);
      if (regex.test(window.location.pathname)) {
        l.classList.add('ant-menu-item-selected');
      }
    }
  } catch (e) {

  }

}