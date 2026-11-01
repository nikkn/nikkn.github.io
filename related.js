// "More research" at the end of a study: the three newest other studies from the research feed,
// same topic first. Images follow the naming of the study pages (/research/img/<name>-thumb.png).
// If the feed cannot be read, the section stays hidden.
(async function () {
  const box = document.querySelector('section.more');
  if (!box) return;
  const here = location.pathname.replace(/\/$/, '');
  try {
    const r = await fetch('/research/feed.xml');
    if (!r.ok) return;
    const xml = new DOMParser().parseFromString(await r.text(), 'application/xml');
    const items = [...xml.querySelectorAll('item')].map(it => {
      const link = it.querySelector('link').textContent.trim();
      return {
        link, path: new URL(link).pathname,
        title: it.querySelector('title').textContent.trim(),
        cat: (it.querySelector('category') || {}).textContent || '',
        date: new Date(it.querySelector('pubDate').textContent)
      };
    });
    const cur = items.find(i => i.path === here);
    const others = items.filter(i => i.path !== here)
      .sort((a, b) => ((cur && b.cat === cur.cat) - (cur && a.cat === cur.cat)) || (b.date - a.date))
      .slice(0, 3);
    if (!others.length) return;
    const list = box.querySelector('.more-list');
    others.forEach(i => {
      const name = i.path.split('/').pop().replace('.html', '');
      const a = document.createElement('a');
      a.className = 'more-card';
      a.href = i.path;
      const img = document.createElement('img');
      img.src = '/research/img/' + name + '-thumb.png';
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => img.remove();
      const meta = document.createElement('p');
      meta.className = 'more-meta';
      meta.textContent = i.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) + (i.cat ? ' · ' + i.cat : '');
      const h = document.createElement('p');
      h.className = 'more-title';
      h.textContent = i.title;
      const text = document.createElement('div');
      text.append(meta, h);
      a.append(text, img);
      list.appendChild(a);
    });
    box.hidden = false;
  } catch (e) { /* stays hidden */ }
})();
