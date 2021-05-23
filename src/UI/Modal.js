export class Modal {
    constructor(contentId, fallbackTest) {
        this.fallbackTest = fallbackTest;
        this.contentTemplateEl = document.getElementById(contentId);
        this.modalTemplateEl = document.getElementById('modal-template');
    }

    show() {
        //check if browser support create <template></template>
        if ('content' in document.createElement('template')) {
            const modalElements = document.importNode(
                this.modalTemplateEl.content,
                true
            );

            this.modalElement = modalElements.querySelector('.modal');
            this.backdropElement = modalElements.querySelector('.backdrop');

            const contentElement = document.importNode(
                this.contentTemplateEl.content,
                true
            );

            this.modalElement.appendChild(contentElement);

            document.body.insertAdjacentElement(
                'afterbegin',
                this.modalElement
            );
            document.body.insertAdjacentElement(
                'afterbegin',
                this.backdropElement
            );
        } else {
            //fallback code
            alert(this.fallbackTest);
        }
    }

    hide() {
        document.body.removeChild(this.backdropElement);
        document.body.removeChild(this.modalElement);
        this.backdropElement = null;
        this.modalElement = null;
    }
}
