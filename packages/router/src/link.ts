import { useRouter } from './router';

export interface CxLinkProps {
  to: string;
  label?: string;
}

class CxLink extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const router = useRouter();
    const root = this.attachShadow({ mode: 'open' });
    const anchor = document.createElement('a');
    const to = this.getAttribute('to') || '/';
    anchor.setAttribute('href', to);
    anchor.textContent = this.getAttribute('label') || '';
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      router.push(to);
    });
    root.appendChild(anchor);
  }
}

customElements.define('cx-link', CxLink);
