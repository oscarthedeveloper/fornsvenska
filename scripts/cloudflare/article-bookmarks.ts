import { getStorageBridge } from '../../lib/ordbok/bridgeClient';

const button = document.getElementById('bokmarke-knapp') as HTMLButtonElement | null;
if (button) {
  const bridge = getStorageBridge();
  const post = JSON.parse(button.dataset.post!);
  let saved = false;
  button.disabled = true;
  const render = (list: {id:string}[]) => {
    saved = list.some(item => item.id === post.id);
    document.getElementById('bokmarke-ikon')!.textContent = saved ? '★' : '☆';
    document.getElementById('bokmarke-text')!.textContent = saved ? 'Sparat' : 'Spara ord';
    button.disabled = false;
  };
  const fail = () => {
    button.disabled = true;
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'Den gemensamma ordlistan är inte tillgänglig. Ingen data har skrivits över. ';
    const link = document.createElement('a');
    link.href = 'https://www.fornsvenska.se/ordbok';
    link.textContent = 'Öppna Min ordlista på huvudsajten';
    message.append(link); button.after(message);
  };
  bridge.subscribe(render);
  bridge.hamtaSparadeOrd().then(render).catch(fail);
  window.addEventListener('focus',()=>bridge.hamtaSparadeOrd().then(render).catch(fail));
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const list = saved ? await bridge.taBortSparatOrd(post.id) : await bridge.sparaOrd({...post, sparadDatum: new Date().toISOString()});
      render(list);
    } catch { fail(); }
  });
}
