export const domService = {
  createAudio() {
    const audio: HTMLAudioElement = this.createEl('audio', { id: 'samir' });
    const source: HTMLSourceElement = this.createEl('source', {
      attr: { type: 'audio/mpeg', src: 'assets/ke_passe.mp3' }
    });
    audio.appendChild(source);
    return audio;
  },
  createForm() {
    const form: HTMLFormElement = this.createEl('form', {
      classes: ['form-inline']
    });
    return form;
  },
  createButton(content: string): HTMLButtonElement {
    const btn: HTMLButtonElement = this.createEl('button', {
      content,
      id: 'btn-' + content.toLowerCase(),
      classes: ['btn']
    });
    return btn;
  },
  createInput(id: string, value): HTMLButtonElement {
    const btn: HTMLButtonElement = this.createEl('input', {
      value,
      id,
      classes: ['form-control']
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

  createEl(elType: string, { content, id, value, classes, attr }): HTMLElement {
    const block: any = document.createElement(elType);
    if (typeof content !== 'undefined') {
      block.innerText = content;
    }
    if (id) {
      block.id = id;
    }
    if (typeof value !== 'undefined') {
      block.value = value;
    }
    if (classes) {
      classes.forEach(element => {
        block.classList.add(element);
      });
    }
    for (let key in attr) {
      block.setAttribute(key, attr[key]);
    }
    return block;
  }
};
