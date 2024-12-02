window.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");

  app.insertAdjacentHTML(
    "beforeend",
    `
      <div class=' form-input'>
        <form action=''>
          <div class='form-input__wrapper'>
            <h1 class='form-input__title'>Инпут-Файл</h1>
            <span class='form-input__info-text'>Вы можете загрузить до 5 файлов JPG, JPEG, PNG, размер одного — до 10 МБ</span>
            <div class='form-input__info'>
            </div>
            <div class='form-input__grid'></div>
            <div class='form-input__bottom'>
              <label class='form-input__field'>
                <input type='file' multiple />
                <span class='form-input__btn'>Загрузить файл</span>
              </label>
              <button class='form-input__go' type='submit'>Отправить</button>
            </div>
          </div>
        </form>
      </div>
  `
  );

  let fileList = [];
  let fileListError = [];
  let messages = [];
  const buttonSubmit = document.querySelector(".form-input__go");
  const parrentFiles = document.querySelector(".form-input__grid");
  let input = document.querySelector(".form-input__field input");

  const replacementInput = () => {
    input.value = "";
    const newInput = input.cloneNode(true);
    input.replaceWith(newInput);
    input = newInput;
  }

  const onChange = (event) => {
    const eventTar = event.target;
    const files = eventTar.files;

    const showMessage = (message, type) => {
      const messageParent = document.querySelector('.form-input__info');

      messageParent.innerHTML = `<div class='message'>
        <div class="message__wrap">
        </div>
        <div class='message-delete'></div>
      </div>`;

      messages.forEach(elem => {
        document.querySelector('.message__wrap').insertAdjacentHTML('beforeend', `<span class="message__text ${type}">${elem}</span>`)
      })

      document.querySelector('.message-delete').addEventListener('click', event => {
        const evenTar = event.target;

        evenTar.closest('.message').remove();
      })
    }

    const showListFiles = (messageWrap, arr) => {
      messageWrap.insertAdjacentHTML('beforeend', '<span class="message__caption">Не загруженные файлы:</span><ul class="message__list"></ul>')

      arr.forEach(elem => {
        messageWrap.querySelector('.message__list').insertAdjacentHTML('beforeend', `<li class="message__name">${elem}</li>`)
      });
    }

    fileListError = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (fileList.find(elem => elem.name === file.name)) {        
        if (messages.indexOf('Файлы уже добавлены.') < 0) {
          messages.push('Файлы уже добавлены.');
        }
        fileListError.push(file.name);
      } else if (fileList.length >= 5) {
        if (messages.indexOf('Превышено допустимое количество файлов: 5') < 0) {
          messages.push('Превышено допустимое количество файлов: 5');
        }
        fileListError.push(file.name);
      } else {
        if (fileList.length < 5) {
          const preview = document.createElement("div");
          preview.classList.add("preview");

          const previewImg = document.createElement("img");
          previewImg.classList.add("preview__img");
          preview.appendChild(previewImg);

          const previewButton = document.createElement("button");
          previewButton.classList.add("preview__delete");
          previewButton.innerText = "Удалить";
          previewButton.type = "button";
          preview.appendChild(previewButton);

          parrentFiles.insertAdjacentElement("beforeend", preview);

          if (file.type.startsWith("image/")) {
            previewImg.file = file;
            let fileItem;

            const reader = new FileReader();
            reader.onload = (function (aImg) {
              fileItem = {
                name: file.name,
                modified: file.lastModified,
                size: file.size,
                data: reader.result,
              };

              fileList.push(fileItem);
              return function (e) {
                aImg.src = e.target.result;
              };
            })(previewImg);

            reader.readAsDataURL(file);

            previewButton.addEventListener("click", () => {
              if (fileList.length === 5 && document.querySelector('.error')) {
                document.querySelector('.message').remove();
              }

              fileList.splice(fileList.indexOf(fileItem), 1);
              preview.remove();
              replacementInput();
              input.addEventListener("change", event => onChange(event));

              console.log(fileList)
            });
          }
        } 
      }
    }

    console.log(fileListError)

    if (messages.length) {
      showMessage(messages, 'error');
      showListFiles(document.querySelector('.message__wrap'), fileListError)
    }

    input.value = "";
  };

  input.addEventListener("change", event => onChange(event));

  buttonSubmit.addEventListener("click", (event) => {
    event.preventDefault();

    if (!fileList.length) {
      alert("Отправлять нечего");
      return;
    }

    alert(
      JSON.stringify(
        fileList.map(({ name, modified, size }) => ({
          name,
          modified,
          size,
          data: '',
        })),
        null,
        2
      )
    );

    replacementInput();
    input.addEventListener("change", event => onChange(event));
    parrentFiles.innerHTML = '';
    fileList = [];
  });
});