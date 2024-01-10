const wait = (selector) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// We need to force this "island" to fetch remote js to then trigger the next "wait" code
wait('summary[aria-label="View profile and more"]').then(el => {
  el.click();
  setTimeout(() => {
    el.click();
  }, 50) // 50ms is arbitrary, could be zero I think
});

// This'll trigger once the above executes
wait('a[data-ga-click="Header, go to profile, text:Signed in as"]').then(el => {
  const username = el.querySelector('strong').innerHTML;
  const navMenu = document.querySelector('#global-nav');
  const children = Array.from(navMenu.childNodes);
  const exploreNode = children.find(c => c.innerHTML === 'Explore');
  const repoNode = exploreNode.cloneNode(true);

  repoNode.href = `/${username}?tab=repositories`;
  repoNode.innerHTML = 'Repositories';

  exploreNode.parentNode.insertBefore(repoNode, exploreNode);
});
