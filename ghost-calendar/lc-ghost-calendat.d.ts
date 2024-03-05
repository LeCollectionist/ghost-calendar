declare module "ghost-calendar/lc-ghost-calendar" {
  export default class LcGhostCalendar extends HTMLElement {
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void;
    static get observedAttributes(): string[];
  }
}
