export const domService = {
  createButton(content: string): HTMLButtonElement {
    const btn: HTMLButtonElement = this.createEl('button', {
      content
    });
    return btn;
  },
  createInput(id: string, value: number): HTMLButtonElement {
    const btn: HTMLButtonElement = this.createEl('input', {
      value,
      id
    });
    return btn;
  },
  createSpan(id: string, content: string): HTMLSpanElement {
    const btn: HTMLSpanElement = this.createEl('span', {
      content,
      id
    });
    return btn;
  },

  createEl(elType: string, { content, id, value }): HTMLElement {
    const block: any = document.createElement(elType);
    if (typeof content !== undefined) {
      block.innerText = content;
    }
    if (id) {
      block.id = id;
    }
    if (typeof value !== undefined) {
      block.value = value;
    }
    return block;
  }
};
